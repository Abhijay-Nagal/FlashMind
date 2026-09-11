# FlashMind architecture

## 1. Pipeline: PDF → connected deck

```
 Phone (browser)                                   Server                 LLM provider
 ───────────────                                   ──────                 ────────────
 PDF ─► pdf.js text extraction (per page)
      ─► clean (headers/footers, hyphenation)
      ─► planner: card budget, topics, sections
      ─► for each section (2 in parallel) ─────► POST /api/generate ───► chat/completions
                                                  (prompt + validation)   (JSON mode)
      ◄─ topics + card chains (+ page numbers) ◄──────────────────────────
      ─► appended to the deck strictly in PDF order, saved on device
```

* **Why the PDF never leaves the phone**: Vercel functions accept ≤ 4.5 MB bodies and textbooks are
  bigger than that. Extracting text locally is faster, private, and keeps each request small.
* **Card budget** (`src/lib/planner.ts`): `cards ≈ 3 × √effectivePages`, where effective pages blend
  the page count with the word count (100 pages ≈ 30 cards, a 15-page paper ≈ 12, a 300-page book ≈ 52). Density multiplies it
  (Light ×0.6, Balanced ×1, Deep ×1.6). Topics ≈ cards / 3, each topic is a chain of 2–4 cards.
* **Sections**: contiguous page ranges with equal amounts of text, ≤ 4 topics each. Every section is
  capped at ~9 000 characters; when a range is longer each page is condensed proportionally (headings
  first, then opening lines), so the model still sees every part of the document.
* **Ordering**: sections are requested two at a time but appended in document order, so a learner can
  start after the first section and later topics simply appear at the end of the deck.

## 2. Deck model (`src/types/deck.ts`)

```ts
Deck   { title, subject, emoji, sourceName, pageCount, topics: Topic[] }
Topic  { title, emoji, hue, cards: Card[] }      // cards[0] is the "core" card
Card   { kind, title, body, page, quiz: { question, options[4], answer, explanation } }
```

`topics` is the vertical axis (swipe up for the next topic, down to go back), `topic.cards` is the horizontal axis (swipe left/right).
Quiz options are shuffled client-side because LLMs tend to put the right answer first.

## 3. Generation contract (`POST /api/generate`)

Implemented twice with identical behaviour: `frontend/api/generate.ts` (Vercel) and `backend/app`
(FastAPI).

Request

```json
{
  "docName": "chapter3.pdf",
  "section": { "index": 0, "total": 3, "pageStart": 1, "pageEnd": 34 },
  "text": "[Page 1]\n…",
  "topicCount": 4, "minDepth": 2, "maxDepth": 4,
  "wantDeckMeta": true
}
```

Response `200`

```json
{
  "deckTitle": "…", "subject": "…", "emoji": "🌐", "model": "openai/gpt-oss-120b",
  "topics": [{ "title": "…", "emoji": "📡", "cards": [{ "title": "…", "body": "…", "kind": "core", "page": 1,
    "quiz": { "question": "…", "options": ["…","…","…","…"], "answer": 2, "explanation": "…" } }] }]
}
```

Errors: `429 {error:"rate_limited", retryAfter}` (client waits and retries), `401 {error:"no_api_key"}`,
`502 {error:"provider_error"|"bad_output"}` (client retries, then skips the section).

`GET /api/generate` returns `{ ok, serverKey, provider }` and powers the "AI engine" status in the app.

An optional `x-llm-key` header carries a user's own Groq key (stored only on their device).

## 4. LLM provider layer

* Any OpenAI-compatible endpoint: `LLM_BASE_URL`, `LLM_API_KEY` (or `GROQ_API_KEY`), `LLM_MODELS`.
* `LLM_MODELS` is an ordered fallback list. On Groq's free tier each model has its own
  tokens-per-minute budget, so falling back on `429` keeps generation fast; a model that has been
  retired (`404`) or returns invalid JSON is skipped the same way.
* Output uses JSON mode and is validated leniently: broken cards are dropped, not the whole section.
* `reasoning_effort: "low"` is only sent to `gpt-oss` models.

### Moving to the institute GPU

1. Serve an instruction-tuned model with an OpenAI-compatible server, e.g.
   `vllm serve Qwen/Qwen2.5-32B-Instruct --port 8000` (JSON mode is supported via guided decoding).
2. Either set `LLM_BASE_URL=http://<gpu>:8000/v1` and `LLM_MODELS=Qwen/Qwen2.5-32B-Instruct` on Vercel,
   **or** run `backend/` (`uvicorn app.main:app`) inside the institute network with the same variables
   and build the web app with `VITE_GENERATE_URL=https://<backend>/api/generate`.
3. Without per-minute token limits you can raise `SECTION_CHAR_BUDGET` in `planner.ts` and the worker
   count in `generator.ts` for richer, faster decks.

## 5. Front-end notes

* State lives in a tiny `useSyncExternalStore` store persisted to `localStorage` (decks, progress,
  XP/streak stats, settings). The generation job lives outside React so it survives navigation.
* `SwipeCard` is a custom pointer-event gesture engine: axis locking, rubber-banding for blocked
  directions, velocity flicks, press-and-hold with a progress ring, and click suppression so a drag or
  a hold never selects a quiz option by accident.
* The phone's back button closes the top layer (sheet → quiz/study → tab) using a single guard history
  entry; the app never calls `history.back()` itself.
* Service worker (vite-plugin-pwa) precaches the app shell, fonts and the pdf.js worker.

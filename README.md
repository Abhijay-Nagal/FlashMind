# FlashMind ⚡

**Turn any PDF into a connected deck of swipeable flashcards — with a quiz on the back of every card.**

FlashMind is a mobile-first Progressive Web App. Upload your study material, and FlashMind reads it
*in order*, splits it into topics and writes a chain of cards for each topic. The cards are generated
only from your document (every card shows the PDF page it came from), not from a random feed.

## How studying works

| Gesture | What happens |
| --- | --- |
| **Swipe down** | Next topic — in the order it appears in your PDF |
| **Swipe left** | Go deeper into the *current* topic (details, examples, formulas, pitfalls…) |
| **Swipe right / up** | Back a level / previous topic |
| **Press & hold** | Flip the card and answer its multiple-choice question |

The "next topic" direction can be switched to *swipe up* in Settings. Buttons below the card and the
arrow keys do the same thing for accessibility and desktop use.

```
 Topic 1 ──►  core ─ swipe left ─► deeper ─► deeper
    │ swipe down
 Topic 2 ──►  core ─► deeper ─► example
    │
 Topic 3 ──►  core ─► formula ─► misconception ─► application
```

## Features

- **PDF → deck**: text extracted on the device (pdf.js); ~30 cards for a 100-page PDF, adjustable
  (Light / Balanced / Deep). Scanned/password-protected PDFs are detected with a friendly message.
- **Live generation screen**: cards drop onto the pile as each section is written; start studying
  after the first section while the rest is generated.
- **Flashy the mascot**: blinks, waves, laughs at correct answers, looks sad at wrong ones, sleeps
  while the AI cools down, and follows your finger with its eyes.
- **Deck map**: the whole deck as a topic × depth map; jump anywhere.
- **Motivation**: XP & levels, daily goal ring, streaks, weekly chart, achievements, combos.
- **Revision**: Quick quiz (10 random MCQs), Review mistakes, Starred cards.
- **PWA**: installable, offline studying of saved decks, Android back button closes layers,
  haptics, soft sound effects, light/dark themes, safe-area aware.

## Project structure

```
frontend/                 React 19 + Vite PWA (deployed on Vercel)
  api/generate.ts         Serverless function: one PDF section → topics + card chains
  src/lib/pdf.ts          On-device PDF text extraction
  src/lib/planner.ts      How many cards/topics, and how to split the PDF into sections
  src/lib/generator.ts    Background job: requests sections, appends topics in order
  src/screens/            Home, Create, Generating, Study, Quiz, Progress
  src/components/study/   SwipeCard (gesture engine), card faces, deck map, tutorial
backend/                  FastAPI twin of /api/generate (for self-hosting, e.g. the institute GPU)
docs/ARCHITECTURE.md      Design notes and the LLM provider contract
```

## Running locally

```bash
cd frontend
npm install
echo "GROQ_API_KEY=gsk_your_key" > .env.local   # free key: https://console.groq.com/keys
npm run dev                                      # http://localhost:5173 (API served by Vite too)
```

## Deployment (Vercel)

The Vercel project's root directory is `frontend/`. Pushing to `main` deploys automatically.
**Set `GROQ_API_KEY` in Vercel → Project → Settings → Environment Variables**, then redeploy.
Without it, users can still paste their own Groq key in *Settings → AI engine*.

## Switching to the institute GPU

The generation layer speaks the OpenAI-compatible Chat Completions protocol, which vLLM, TGI,
Ollama and LM Studio all implement. No code changes are needed — only environment variables:

```
LLM_BASE_URL = http://<gpu-server>:8000/v1
LLM_API_KEY  = <token, if the server needs one>
LLM_MODELS   = Qwen/Qwen2.5-32B-Instruct        # comma-separated fallbacks allowed
```

Set them on Vercel (the function calls the GPU), or run `backend/` next to the GPU and point the web
app at it with `VITE_GENERATE_URL=https://<backend-host>/api/generate`. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

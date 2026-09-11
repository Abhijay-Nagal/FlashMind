"""FlashMind API (FastAPI).

Implements the same contract as the Vercel function `frontend/api/generate.ts`:

  GET  /api/generate   → {"ok": true, "serverKey": bool, "provider": host}
  POST /api/generate   → one PDF section in, ordered topics + card chains out

The browser extracts the PDF text and sends it section by section, so this
server never has to receive the PDF itself.
"""

from urllib.parse import urlparse

from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.core.ai import GROQ_BASE_URL, GROQ_MODELS, GenerationError, SectionRequest, generate_section
from app.core.config import settings

app = FastAPI(title="FlashMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "x-llm-key"],
)


class Section(BaseModel):
    index: int = Field(0, ge=0, le=500)
    total: int = Field(1, ge=1, le=500)
    pageStart: int = Field(1, ge=1)
    pageEnd: int = Field(1, ge=1)


class GenerateBody(BaseModel):
    docName: str = Field("document.pdf", max_length=120)
    section: Section = Section()
    text: str = Field(..., min_length=40, max_length=16000)
    topicCount: int = Field(3, ge=1, le=8)
    minDepth: int = Field(2, ge=1, le=5)
    maxDepth: int = Field(4, ge=1, le=6)
    wantDeckMeta: bool = False


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/generate")
def generate_status():
    return {"ok": True, "serverKey": bool(settings.api_key), "provider": urlparse(settings.llm_base_url).netloc}


@app.post("/api/generate")
async def generate(body: GenerateBody, x_llm_key: str | None = Header(default=None)):
    req = SectionRequest(
        doc_name=body.docName,
        index=body.section.index,
        total=body.section.total,
        page_start=body.section.pageStart,
        page_end=body.section.pageEnd,
        text=body.text,
        topic_count=body.topicCount,
        min_depth=body.minDepth,
        max_depth=max(body.minDepth, body.maxDepth),
        want_deck_meta=body.wantDeckMeta,
    )
    try:
        # a user-supplied key (Settings → AI engine in the app) always targets Groq
        if x_llm_key:
            return await generate_section(req, api_key=x_llm_key, base_url=GROQ_BASE_URL, models=GROQ_MODELS)
        return await generate_section(req)
    except GenerationError as e:
        headers = {"Retry-After": str(int(e.retry_after + 0.999))} if e.retry_after else None
        payload = {"error": e.kind, "message": e.message}
        if e.retry_after:
            payload["retryAfter"] = e.retry_after
        return JSONResponse(payload, status_code=e.status, headers=headers)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.supabase import supabase

app = FastAPI(title="FlashMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://flash-mind-smoky.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/supabase-health")
def supabase_health_check():
    return {"status": "connected"}


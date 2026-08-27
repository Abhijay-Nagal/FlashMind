from fastapi import FastAPI

from app.core.supabase import supabase

app = FastAPI(title="FlashMind API")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/supabase-health")
def supabase_health_check():
    return {"status": "connected"}


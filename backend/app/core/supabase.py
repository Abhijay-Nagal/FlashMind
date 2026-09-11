"""Optional Supabase client (not needed for flashcard generation)."""

from app.core.config import settings

supabase = None

if settings.supabase_url and settings.supabase_key:
    from supabase import Client, create_client

    supabase: Client | None = create_client(settings.supabase_url, settings.supabase_key)

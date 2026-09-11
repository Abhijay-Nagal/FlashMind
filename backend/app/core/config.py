from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment configuration.

    The LLM provider is any OpenAI-compatible Chat Completions API. Today that is
    Groq; to use the institute GPU server (vLLM / TGI / Ollama) only change
    LLM_BASE_URL, LLM_API_KEY and LLM_MODELS.
    """

    llm_base_url: str = "https://api.groq.com/openai/v1"
    llm_api_key: str = ""
    groq_api_key: str = ""
    # tried in order; the next one is used when a model is rate limited or unavailable
    llm_models: str = "openai/gpt-oss-120b,qwen/qwen3.8-27b,openai/gpt-oss-20b"
    llm_timeout_seconds: float = 90

    cors_origins: str = "http://localhost:5173,https://flash-mind-smoky.vercel.app"

    # optional, not required for generation
    supabase_url: str = ""
    supabase_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def api_key(self) -> str:
        return self.llm_api_key or self.groq_api_key

    @property
    def models(self) -> list[str]:
        return [m.strip() for m in self.llm_models.split(",") if m.strip()]

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()

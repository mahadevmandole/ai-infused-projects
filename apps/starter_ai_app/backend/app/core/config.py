import os
from pathlib import Path

from dotenv import load_dotenv

from packages.ai import Settings

APP_DIR = Path(__file__).resolve().parents[2]
load_dotenv(APP_DIR / ".env")

settings = Settings(
    app_name=os.getenv("APP_NAME", "starter_ai_app"),
    ai_provider=os.getenv("AI_PROVIDER", "mock").lower(),
    ai_temperature=float(os.getenv("AI_TEMPERATURE", "0.2")),
    ai_max_output_tokens=int(os.getenv("AI_MAX_OUTPUT_TOKENS", "800")),
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    openai_model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
    groq_api_key=os.getenv("GROQ_API_KEY"),
    groq_model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
    gemini_api_key=os.getenv("GEMINI_API_KEY"),
    gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
)

__all__ = ["settings"]

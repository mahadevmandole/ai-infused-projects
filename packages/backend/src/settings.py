import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from packages.ai import ModelConfig, ProviderName

APP_DIR = Path(__file__).resolve().parents[3]
load_dotenv(APP_DIR / ".env")


class Settings(BaseModel):
    app_name: str = Field(default_factory=lambda: os.getenv("APP_NAME", "starter_ai_app"))
    api_prefix: str = "/api"
    ai_provider: Literal["mock", "openai", "groq", "gemini"] = Field(
        default_factory=lambda: os.getenv("AI_PROVIDER", "mock").lower()
    )
    ai_temperature: float = Field(default_factory=lambda: float(os.getenv("AI_TEMPERATURE", "0.2")))
    ai_max_output_tokens: int = Field(
        default_factory=lambda: int(os.getenv("AI_MAX_OUTPUT_TOKENS", "800"))
    )
    openai_api_key: str | None = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
    openai_model: str = Field(default_factory=lambda: os.getenv("OPENAI_MODEL", "gpt-4.1-mini"))
    groq_api_key: str | None = Field(default_factory=lambda: os.getenv("GROQ_API_KEY"))
    groq_model: str = Field(
        default_factory=lambda: os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    )
    gemini_api_key: str | None = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY"))
    gemini_model: str = Field(default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))

    def model_config_for_provider(self) -> ModelConfig:
        provider: ProviderName = self.ai_provider
        model_by_provider = {
            "mock": "mock-model",
            "openai": self.openai_model,
            "groq": self.groq_model,
            "gemini": self.gemini_model,
        }
        api_key_by_provider = {
            "mock": None,
            "openai": self.openai_api_key,
            "groq": self.groq_api_key,
            "gemini": self.gemini_api_key,
        }
        return ModelConfig(
            provider=provider,
            model=model_by_provider[provider],
            api_key=api_key_by_provider[provider],
            temperature=self.ai_temperature,
            max_output_tokens=self.ai_max_output_tokens,
        )


settings = Settings()

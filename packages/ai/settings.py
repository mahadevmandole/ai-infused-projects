from typing import Literal

from pydantic import BaseModel, Field

from .model_client import ModelConfig, ProviderName


class Settings(BaseModel):
    app_name: str = Field(default="starter_ai_app")
    api_prefix: str = "/api"
    ai_provider: Literal["mock", "openai", "groq", "gemini"] = Field(default="mock")
    ai_temperature: float = Field(default=0.2)
    ai_max_output_tokens: int = Field(default=800)
    openai_api_key: str | None = None
    openai_model: str = Field(default="gpt-4.1-mini")
    groq_api_key: str | None = None
    groq_model: str = Field(default="llama-3.3-70b-versatile")
    gemini_api_key: str | None = None
    gemini_model: str = Field(default="gemini-2.5-flash")

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

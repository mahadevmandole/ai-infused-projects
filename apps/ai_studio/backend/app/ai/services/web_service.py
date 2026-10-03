from urllib.parse import urlparse

from packages.ai import ModelConfig, build_model_client

from ...core.config import settings
from .. import WebAgent, WebRag


class WebService:
    def __init__(self) -> None:
        self.model_client = build_model_client(settings.model_config_for_provider())
        self.agent = WebAgent(model_client=self.model_client)
        self.rag = WebRag()

    def _model_config_for(self, model: str | None = None) -> ModelConfig:
        if not model:
            return settings.model_config_for_provider()

        provider, sep, model_name = model.partition(":")
        provider = provider.lower()
        if not sep or not model_name:
            raise ValueError("Model format must be 'provider:model-name'.")
        if provider not in {"mock", "openai", "groq", "gemini"}:
            raise ValueError(f"Unsupported model provider: {provider}.")

        base_config = settings.model_config_for_provider()
        api_key_by_provider = {
            "mock": None,
            "openai": settings.openai_api_key,
            "groq": settings.groq_api_key,
            "gemini": settings.gemini_api_key,
        }

        return ModelConfig(
            provider=provider,
            model=model_name,
            api_key=api_key_by_provider[provider],
            temperature=base_config.temperature,
            max_output_tokens=base_config.max_output_tokens,
        )

    def _looks_like_url(self, value: str) -> bool:
        parsed = urlparse(value.strip())
        return bool(parsed.scheme and parsed.netloc)

    def answer(self, prompt: str, model: str | None = None) -> dict[str, str]:
        prompt = prompt.strip()
        if not prompt:
            raise ValueError("Prompt is required.")

        if self._looks_like_url(prompt):
            system_prompt = (
                "You analyze the contents of a website and give a short, friendly summary. "
                "Ignore navigation menus. Respond in markdown."
            )
            context = self.rag.retrieve(prompt)
            user_prompt = f"Summarize this website: {prompt}"
        else:
            system_prompt = "Answer the user's question directly and clearly. Respond in markdown."
            context = "No website context was provided; answer from the prompt itself."
            user_prompt = prompt

        model_client = build_model_client(self._model_config_for(model))
        agent = WebAgent(model_client=model_client)
        answer = agent.run(prompt=user_prompt, context=context, system_prompt=system_prompt)

        if not answer.strip():
            answer = "I could not generate a response for this prompt."

        return {
            "answer": answer,
            "context": context,
        }

from dataclasses import dataclass
from typing import Literal, Protocol

ProviderName = Literal["mock", "openai", "groq", "gemini"]


@dataclass(frozen=True)
class ModelConfig:
    provider: ProviderName
    model: str
    api_key: str | None = None
    temperature: float = 0.2
    max_output_tokens: int = 800


class ModelClient(Protocol):
    model: str

    def generate(self, prompt: str, context: str, system_prompt: str | None = None) -> str: ...


class MockModelClient:
    def __init__(self, config: ModelConfig) -> None:
        self.model = config.model

    def generate(self, prompt: str, context: str, system_prompt: str | None = None) -> str:
        return f"Starter answer for '{prompt}'. Retrieved context: {context}"


class OpenAIModelClient:
    def __init__(self, config: ModelConfig) -> None:
        if not config.api_key:
            raise ValueError("OPENAI_API_KEY is required when AI_PROVIDER=openai.")

        from openai import OpenAI

        self.model = config.model
        self.temperature = config.temperature
        self.max_output_tokens = config.max_output_tokens
        self.client = OpenAI(api_key=config.api_key)

    def generate(self, prompt: str, context: str, system_prompt: str | None = None) -> str:
        response = self.client.responses.create(
            model=self.model,
            input=_build_input(prompt=prompt, context=context, system_prompt=system_prompt),
            temperature=self.temperature,
            max_output_tokens=self.max_output_tokens,
        )
        return response.output_text or ""


class GroqModelClient:
    def __init__(self, config: ModelConfig) -> None:
        if not config.api_key:
            raise ValueError("GROQ_API_KEY is required when AI_PROVIDER=groq.")

        from groq import Groq

        self.model = config.model
        self.temperature = config.temperature
        self.max_output_tokens = config.max_output_tokens
        self.client = Groq(api_key=config.api_key)

    def generate(self, prompt: str, context: str, system_prompt: str | None = None) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Answer using the provided context when useful."},
                {
                    "role": "user",
                    "content": _build_input(
                        prompt=prompt, context=context, system_prompt=system_prompt
                    ),
                },
            ],
            temperature=self.temperature,
            max_tokens=self.max_output_tokens,
        )
        return response.choices[0].message.content or ""


class GeminiModelClient:
    def __init__(self, config: ModelConfig) -> None:
        if not config.api_key:
            raise ValueError("GEMINI_API_KEY is required when AI_PROVIDER=gemini.")

        from google import genai
        from google.genai import types

        self.model = config.model
        self.temperature = config.temperature
        self.max_output_tokens = config.max_output_tokens
        self.client = genai.Client(api_key=config.api_key)
        self.types = types

    def generate(self, prompt: str, context: str, system_prompt: str | None = None) -> str:
        user_content = f"Context:\n{context}\n\n{prompt}"
        config = None
        if system_prompt:
            config = self.types.GenerateContentConfig(system_instruction=system_prompt)

        response = self.client.models.generate_content(
            model=self.model,
            contents=user_content,
            config=config,
        )
        return response.text or ""


def build_model_client(config: ModelConfig) -> ModelClient:
    if config.provider == "openai":
        return OpenAIModelClient(config)
    if config.provider == "groq":
        return GroqModelClient(config)
    if config.provider == "gemini":
        return GeminiModelClient(config)
    return MockModelClient(config)


def _build_input(
    prompt: str,
    context: str,
    system_prompt: str | None = None,
) -> str:
    modelInput = []

    if system_prompt:
        modelInput.append({"role": "system", "content": system_prompt})

    modelInput.append({"role": "user", "content": f"Context:\n{context}\n\n{prompt}"})

    return modelInput

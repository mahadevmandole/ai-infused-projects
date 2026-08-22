from packages.ai import ModelClient


class WebAgent:
    def __init__(self, model_client: ModelClient) -> None:
        self.model_client = model_client

    def run(self, prompt: str, context: str, system_prompt: str | None = None) -> str:
        answer = self.model_client.generate(
            prompt=prompt,
            context=context,
            system_prompt=system_prompt,
        )
        return answer or ""

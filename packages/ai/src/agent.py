from packages.ai.src.model_client import ModelClient


class SimpleAgent:
    def __init__(self, model_client: ModelClient) -> None:
        self.model_client = model_client

    def run(self, prompt: str, context: str) -> str:
        return self.model_client.generate(prompt=prompt, context=context)

from packages.ai import SimpleAgent, build_model_client, SimpleRag
from .settings import settings


class AiService:
    def __init__(self) -> None:
        self.model_client = build_model_client(settings.model_config_for_provider())
        self.agent = SimpleAgent(model_client=self.model_client)
        self.rag = SimpleRag()

    def answer(self, prompt: str) -> dict[str, str]:
        context = self.rag.retrieve(prompt)
        answer = self.agent.run(prompt=prompt, context=context)
        return {
            "answer": answer,
            "context": context,
            "provider": settings.ai_provider,
            "model": self.model_client.model,
        }

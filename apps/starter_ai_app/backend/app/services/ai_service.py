from apps.starter_ai_app.ai.agents.simple_agent import SimpleAgent
from apps.starter_ai_app.ai.models.clients import build_model_client
from apps.starter_ai_app.ai.rag.simple_rag import SimpleRag
from apps.starter_ai_app.backend.app.core.config import settings


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

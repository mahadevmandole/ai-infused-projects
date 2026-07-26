from apps.starter_ai_app.ai.agents.simple_agent import SimpleAgent
from apps.starter_ai_app.ai.rag.simple_rag import SimpleRag


class AiService:
    def __init__(self) -> None:
        self.agent = SimpleAgent()
        self.rag = SimpleRag()

    def answer(self, prompt: str) -> dict[str, str]:
        context = self.rag.retrieve(prompt)
        answer = self.agent.run(prompt=prompt, context=context)
        return {"answer": answer, "context": context}

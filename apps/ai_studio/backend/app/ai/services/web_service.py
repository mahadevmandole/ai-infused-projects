from packages.ai import build_model_client

from ...core.config import settings
from .. import WebAgent, WebRag


class WebService:
    def __init__(self) -> None:
        self.model_client = build_model_client(settings.model_config_for_provider())
        self.agent = WebAgent(model_client=self.model_client)
        self.rag = WebRag()

    def answer(self, prompt: str) -> dict[str, str]:
        system_prompt = (
            "You analyze the contents of a website and give a short, friendly summary. "
            "Ignore navigation menus. Respond in markdown."
        )

        context = self.rag.retrieve(prompt)
        user_prompt = f"Summarize this website: {prompt}"
        answer = self.agent.run(prompt=user_prompt, context=context, system_prompt=system_prompt)

        if not answer.strip():
            answer = "I could not generate a summary for this website."

        return {
            "answer": answer,
            "context": context,
        }

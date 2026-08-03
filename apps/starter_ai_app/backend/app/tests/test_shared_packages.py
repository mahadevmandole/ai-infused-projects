from app.ai import SimpleAgent, SimpleRag
from app.ai.services.ai_service import AiService

from packages.ai import MockModelClient, ModelConfig


def test_shared_packages_expose_core_components() -> None:
    model = MockModelClient(ModelConfig(provider="mock", model="mock-model"))
    agent = SimpleAgent(model_client=model)
    rag = SimpleRag()

    assert (
        agent.run(prompt="hello", context="context")
        == "Starter answer for 'hello'. Retrieved context: context"
    )
    assert rag.retrieve("hello") == "No vector store configured yet for query: hello"

    service = AiService()
    response = service.answer("hello")

    assert response["provider"] == "mock"
    assert response["model"] == "mock-model"

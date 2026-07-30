from packages.ai.src.agent import SimpleAgent
from packages.ai.src.model_client import MockModelClient, ModelConfig
from packages.ai.src.rag import SimpleRag
from packages.backend.src.ai_service import AiService


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

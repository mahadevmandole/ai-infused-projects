from app.ai import WebAgent, WebService

from packages.ai import MockModelClient, ModelConfig


def test_shared_packages_expose_core_components() -> None:
    model = MockModelClient(ModelConfig(provider="mock", model="mock-model"))
    agent = WebAgent(model_client=model)

    assert (
        agent.run(prompt="hello", context="context")
        == "Starter answer for 'hello'. Retrieved context: context"
    )

    service = object.__new__(WebService)
    service.agent = agent
    service.rag = type(
        "StubRag",
        (),
        {"retrieve": lambda self, url: "Title: Example\n\nPage contents:\nUseful page text."},
    )()

    response = service.answer("hello")

    assert "Starter answer" in response["answer"]
    assert "Useful page text" in response["context"]

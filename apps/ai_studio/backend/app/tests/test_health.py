import importlib
import sys
from pathlib import Path

from app.main import app
from app.api import routes
from fastapi.testclient import TestClient


def test_health() -> None:
    response = TestClient(app).get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ask_uses_configured_model_client(monkeypatch) -> None:
    monkeypatch.setattr(
        routes.ai_service.rag,
        "retrieve",
        lambda url: "Title: Example\n\nPage contents:\nUseful page text.",
    )
    monkeypatch.setattr(
        routes.ai_service.agent,
        "run",
        lambda prompt, context, system_prompt: "Starter answer for website summary.",
    )

    response = TestClient(app).post("/api/ask", json={"prompt": "https://example.com"})

    assert response.status_code == 200
    body = response.json()
    assert "Starter answer" in body["answer"]
    assert "Useful page text" in body["context"]


def test_main_module_imports_when_backend_is_started_from_backend_directory(monkeypatch) -> None:
    backend_dir = Path(__file__).resolve().parents[2]
    monkeypatch.chdir(backend_dir)
    monkeypatch.setattr(sys, "path", [str(backend_dir)])

    for module_name in ["app.main", "apps.ai_studio.backend.app.main"]:
        sys.modules.pop(module_name, None)

    imported_main = importlib.import_module("app.main")

    assert imported_main.app is not None

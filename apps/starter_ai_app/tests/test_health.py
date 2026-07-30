import importlib
import sys
from pathlib import Path

from fastapi.testclient import TestClient

from apps.starter_ai_app.backend.app.main import app


def test_health() -> None:
    response = TestClient(app).get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ask_uses_configured_model_client() -> None:
    response = TestClient(app).post("/api/ask", json={"prompt": "Hello"})

    assert response.status_code == 200
    body = response.json()
    assert body["provider"] == "mock"
    assert body["model"] == "mock-model"
    assert "Starter answer" in body["answer"]


def test_main_module_imports_when_backend_is_started_from_backend_directory(monkeypatch) -> None:
    backend_dir = Path(__file__).resolve().parents[1] / "backend"
    monkeypatch.chdir(backend_dir)
    monkeypatch.setattr(sys, "path", [str(backend_dir)])

    for module_name in ["app.main", "apps.starter_ai_app.backend.app.main"]:
        sys.modules.pop(module_name, None)

    imported_main = importlib.import_module("app.main")

    assert imported_main.app is not None

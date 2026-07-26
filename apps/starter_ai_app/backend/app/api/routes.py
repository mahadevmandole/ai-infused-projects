from fastapi import APIRouter
from pydantic import BaseModel

from apps.starter_ai_app.backend.app.services.ai_service import AiService

router = APIRouter()
ai_service = AiService()


class PromptRequest(BaseModel):
    prompt: str


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "starter_ai_app"}


@router.post("/ask")
def ask(request: PromptRequest) -> dict[str, str]:
    return ai_service.answer(request.prompt)

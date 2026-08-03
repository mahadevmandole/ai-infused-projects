from fastapi import APIRouter
from pydantic import BaseModel

from ..ai.services.ai_service import AiService

router = APIRouter()
ai_service = AiService()


class PromptRequest(BaseModel):
    prompt: str


class PromptResponse(BaseModel):
    answer: str
    context: str
    provider: str
    model: str


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "starter_ai_app"}


@router.post("/ask")
def ask(request: PromptRequest) -> PromptResponse:
    return ai_service.answer(request.prompt)

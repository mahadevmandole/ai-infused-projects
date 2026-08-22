from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..ai.services.web_service import WebService
from ..ai.utils.web_scraper import WebsiteFetchError

router = APIRouter()
ai_service = WebService()


class PromptRequest(BaseModel):
    prompt: str


class PromptResponse(BaseModel):
    answer: str
    context: str


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai_studio"}


@router.post("/ask")
def ask(request: PromptRequest) -> PromptResponse:
    try:
        return ai_service.answer(request.prompt)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except WebsiteFetchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

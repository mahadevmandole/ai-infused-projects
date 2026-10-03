from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..ai.services.web_service import WebService
from ..ai.utils.web_scraper import WebsiteFetchError

router = APIRouter()
ai_service = WebService()


class PromptRequest(BaseModel):
    prompt: str
    model: str | None = None


class MultiModelPromptRequest(PromptRequest):
    models: list[str]


class PromptResponse(BaseModel):
    answer: str
    context: str


class MultiModelPromptResponse(BaseModel):
    answers: dict[str, str]


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai_studio"}


@router.post("/ask")
def ask(request: PromptRequest) -> PromptResponse:
    try:
        return ai_service.answer(request.prompt, model=request.model)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except WebsiteFetchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/battle")
def battle(request: MultiModelPromptRequest) -> MultiModelPromptResponse:
    try:
        answers = {
            model: ai_service.answer(request.prompt, model=model)["answer"]
            for model in request.models
        }
        return {"answers": answers}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except WebsiteFetchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

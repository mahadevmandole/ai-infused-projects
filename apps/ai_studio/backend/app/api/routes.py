import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..ai.services.web_service import WebService
from ..ai.utils.web_scraper import WebsiteFetchError
from ..utils.vote_store import read_vote_file, write_vote_file

router = APIRouter()
ai_service = WebService()


def _format_provider_error(exc: Exception) -> str:
    raw_message = str(exc).strip()
    if not raw_message:
        return "The request could not be completed. Please retry in a moment."

    if "groq.BadRequestError" in raw_message:
        raw_message = raw_message.split("groq.BadRequestError:", 1)[-1].strip()

    if "Error code:" in raw_message and " - " in raw_message:
        raw_message = raw_message.split(" - ", 1)[1].strip()

    if raw_message.startswith("{") and raw_message.endswith("}"):
        try:
            payload = json.loads(raw_message)
            if isinstance(payload, dict):
                error_payload = payload.get("error")
                if isinstance(error_payload, dict):
                    message = error_payload.get("message")
                    if isinstance(message, str) and message:
                        return message
        except json.JSONDecodeError:
            pass

    return raw_message


def _raise_user_error(status_code: int, exc: Exception) -> None:
    raise HTTPException(
        status_code=status_code,
        detail={
            "message": _format_provider_error(exc),
            "type": "provider_error" if status_code == 400 else "server_error",
            "status_code": status_code,
        },
    ) from exc


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
    errors: dict[str, str] = {}


class VoteRequest(BaseModel):
    model: str


class VoteResponse(BaseModel):
    model: str
    votes: int
    all_votes: dict[str, int]


AVAILABLE_MODELS = [
    {"label": "OpenAI GPT-4o", "value": "openai:gpt-4o"},
    {"label": "OpenAI GPT-4o Mini", "value": "openai:gpt-4o-mini"},
    {"label": "OpenAI GPT-4.1 Mini", "value": "openai:gpt-4.1-mini"},
    {"label": "Gemini 2.0 Flash", "value": "gemini:gemini-2.0-flash"},
    {"label": "Gemini 2.0 Flash Lite", "value": "gemini:gemini-2.0-flash-lite"},
    {"label": "Gemini 2.5 Flash", "value": "gemini:gemini-2.5-flash"},
    {"label": "Groq Llama 3.1 8B Instant", "value": "groq:llama-3.1-8b-instant"},
    {"label": "Groq Llama 3.3 70B Versatile", "value": "groq:llama-3.3-70b-versatile"},
    {"label": "Groq Mixtral 8x7B 32K", "value": "groq:mixtral-8x7b-32768"},
]


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai_studio"}


@router.get("/models")
def get_available_models() -> list[dict[str, str]]:
    return AVAILABLE_MODELS


@router.post("/ask")
def ask(request: PromptRequest) -> PromptResponse:
    try:
        return ai_service.answer(request.prompt, model=request.model)
    except ValueError as exc:
        _raise_user_error(400, exc)
    except WebsiteFetchError as exc:
        _raise_user_error(502, exc)
    except Exception as exc:  # noqa: BLE001 - safety net for provider validation issues
        _raise_user_error(500, exc)


@router.post("/battle")
def battle(request: MultiModelPromptRequest) -> MultiModelPromptResponse:
    answers: dict[str, str] = {}
    errors: dict[str, str] = {}

    for model in request.models:
        try:
            answers[model] = ai_service.answer(request.prompt, model=model)["answer"]
        except ValueError as exc:
            errors[model] = _format_provider_error(exc)
        except WebsiteFetchError as exc:
            errors[model] = _format_provider_error(exc)
        except Exception as exc:  # noqa: BLE001 - safety net for provider validation issues
            errors[model] = _format_provider_error(exc)

    return {"answers": answers, "errors": errors}


@router.get("/votes")
def get_votes() -> dict[str, int]:
    return read_vote_file()


@router.post("/votes")
def upsert_vote(request: VoteRequest) -> VoteResponse:
    model = request.model.strip()
    if not model:
        raise HTTPException(status_code=400, detail="Model is required.")

    current_votes = read_vote_file()
    current_votes[model] = current_votes.get(model, 0) + 1
    write_vote_file(current_votes)

    return {
        "model": model,
        "votes": current_votes[model],
        "all_votes": current_votes,
    }

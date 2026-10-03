import json
from pathlib import Path

VOTES_FILE_PATH = Path(__file__).resolve().parents[1] / "data" / "votes.json"


def ensure_vote_file() -> None:
    VOTES_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not VOTES_FILE_PATH.exists():
        VOTES_FILE_PATH.write_text("{}", encoding="utf-8")


def read_vote_file() -> dict[str, int]:
    ensure_vote_file()

    try:
        payload = json.loads(VOTES_FILE_PATH.read_text(encoding="utf-8") or "{}")
    except json.JSONDecodeError:
        payload = {}

    if not isinstance(payload, dict):
        return {}

    cleaned: dict[str, int] = {}
    for key, value in payload.items():
        if isinstance(value, int):
            cleaned[str(key)] = value

    return cleaned


def write_vote_file(votes: dict[str, int]) -> None:
    ensure_vote_file()
    VOTES_FILE_PATH.write_text(json.dumps(votes, indent=2), encoding="utf-8")

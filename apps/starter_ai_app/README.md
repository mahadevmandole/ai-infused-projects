# starter_ai_app

Runnable AI project boilerplate with a FastAPI backend, shared AI package, and React + TypeScript + SCSS frontend.

## Run

```bash
uv sync
pnpm install
uv run uvicorn apps.starter_ai_app.backend.app.main:app --reload --port 8000
pnpm --filter @apps/starter_ai_app-frontend dev
```

The frontend dev server proxies `/api` to `http://localhost:8000`.

# AI Infused Projects

Monorepo for small AI apps. Each app lives under `apps/<app-name>` and contains:

- `backend`: FastAPI API surface
- `ai`: project-specific agents, RAG, prompts, embeddings, and model utilities
- `frontend`: React + TypeScript + SCSS, bundled with webpack rather than Vite

The backend and AI code share the repo-level Python environment managed by `uv`.

## Create An App

```bash
pnpm create:app my-ai-project
```

This creates `apps/my-ai-project` with runnable starter code.

## Run An App

```bash
uv sync
pnpm install
uv run uvicorn apps.my_ai_project.backend.app.main:app --reload --port 8000
pnpm --filter @apps/my-ai-project-frontend dev
```

The frontend runs on `http://localhost:3000` and proxies `/api` to FastAPI on port `8000`.

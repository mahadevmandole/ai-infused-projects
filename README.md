# AI Infused Projects

Monorepo for small AI apps. Each app lives under `apps/<app-name>` and contains:

- `backend`: FastAPI API surface
- `backend/app/ai`: project-specific agents, RAG, prompts, embeddings, and model utilities
- `frontend`: React + TypeScript + SCSS, bundled with webpack rather than Vite

Reusable code should live under `packages/` in one of these shared areas:

- `packages/frontend`: shared UI components, hooks, and utilities
- `packages/backend`: shared API helpers, services, and domain logic
- `packages/ai`: shared agents, prompts, and model integrations

The backend and AI code share the repo-level Python environment managed by `uv`.

## Create An App

```bash
pnpm create:app my_ai_project
```

This creates `apps/my_ai_project` with runnable starter code.

## Run An App

```bash
uv sync
pnpm install
cp apps/my_ai_project/backend/.env.example apps/my_ai_project/backend/.env
pnpm dev:app my_ai_project backend
pnpm dev:app my_ai_project frontend
```

Run the backend and frontend commands in separate terminals. You can also list the available apps or choose one interactively:

```bash
pnpm dev:app --list
pnpm dev:app
```

The frontend runs on `http://localhost:3000` and proxies `/api` to FastAPI on port `8000`.

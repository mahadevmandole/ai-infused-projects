# AI Infused Projects

Monorepo for small AI apps. Each app lives under `apps/<app-name>` and contains:

- `backend`: FastAPI API surface
- `ai`: project-specific agents, RAG, prompts, embeddings, and model utilities
- `frontend`: React + TypeScript + SCSS, bundled with webpack rather than Vite

Reusable code should live under `packages/` in one of these shared areas:

- `packages/frontend`: shared UI components, hooks, and utilities
- `packages/backend`: shared API helpers, services, and domain logic
- `packages/ai`: shared agents, prompts, and model integrations

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
pnpm dev:app my-ai-project
```

You can also list the available apps or choose one interactively:

```bash
pnpm dev:app --list
pnpm dev:app
```

The frontend runs on `http://localhost:3000` and proxies `/api` to FastAPI on port `8000`.

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

## Install Packages

Install frontend packages with `pnpm`. Use `--filter` when the dependency belongs to one workspace package or app.

```bash
# Add a dependency to a specific frontend app
pnpm --filter @apps/ai_studio-frontend add react-router

# Add a dev dependency to a specific frontend app
pnpm --filter @apps/ai_studio-frontend add -D prettier

# Add a dependency to the shared frontend package
pnpm --filter @ai-infused-projects/frontend add @radix-ui/react-dialog

# Install or refresh all workspace dependencies
pnpm install
```

Install backend Python packages with `uv` from the repository root. Python dependencies are shared through the repo-level `pyproject.toml`.

```bash
# Add a backend/runtime dependency
uv add beautifulsoup4

# Add multiple backend/runtime dependencies
uv add beautifulsoup4 lxml

# Add a development dependency
uv add --dev pytest

# Sync the local Python environment from pyproject.toml and uv.lock
uv sync
```

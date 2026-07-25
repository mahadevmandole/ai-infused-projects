#!/usr/bin/env bash

set -e

# ==========================================================
# Create AI Application Structure
#
# Usage:
#   ./create-ai-app.sh chatbot
#   ./create-ai-app.sh invoice-rag
# ==========================================================

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
    echo "Usage: ./create-ai-app.sh <app-name>"
    exit 1
fi

APP_DIR="apps/$APP_NAME"

if [ -d "$APP_DIR" ]; then
    echo "❌ $APP_NAME already exists."
    exit 1
fi

echo "🚀 Creating AI application: $APP_NAME"

# ----------------------------------------------------------
# Root folders
# ----------------------------------------------------------

mkdir -p "$APP_DIR"/{
frontend,
backend,
ml,
configs,
data,
docker,
tests,
scripts,
docs
}

# ----------------------------------------------------------
# Backend
# ----------------------------------------------------------

mkdir -p "$APP_DIR"/backend/{
app,
api,
core,
db,
services,
middleware,
schemas,
routers,
utils
}

touch "$APP_DIR"/backend/app/__init__.py
touch "$APP_DIR"/backend/api/__init__.py
touch "$APP_DIR"/backend/core/__init__.py
touch "$APP_DIR"/backend/services/__init__.py

# ----------------------------------------------------------
# ML
# ----------------------------------------------------------

mkdir -p "$APP_DIR"/ml/{
models,
training,
inference,
pipelines,
evaluation,
embeddings,
prompts,
agents,
rag,
vectorstores,
datasets,
artifacts,
notebooks,
experiments,
utils
}

touch "$APP_DIR"/ml/__init__.py
touch "$APP_DIR"/ml/utils/__init__.py

# ----------------------------------------------------------
# Docker
# ----------------------------------------------------------

touch "$APP_DIR"/docker/{
backend.Dockerfile,
frontend.Dockerfile,
docker-compose.yml
}

# ----------------------------------------------------------
# Config
# ----------------------------------------------------------

touch "$APP_DIR"/configs/{
development.yaml,
staging.yaml,
production.yaml
}

# ----------------------------------------------------------
# Environment
# ----------------------------------------------------------

touch "$APP_DIR"/.env.example
touch "$APP_DIR"/README.md

echo "📦 Initializing Python project..."

cd "$APP_DIR"

uv init --package
uv venv

echo ""
echo "=================================================="
echo "✅ AI application created successfully!"
echo "=================================================="
echo ""
echo "Location:"
echo "  $APP_DIR"
echo ""
echo "Next:"
echo "  cd $APP_DIR"
echo "  source .venv/bin/activate"
echo "  uv add fastapi uvicorn pydantic python-dotenv httpx loguru"
echo "  uv add --dev pytest ruff mypy ipykernel"

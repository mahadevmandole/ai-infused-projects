#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/scripts/lib/utils.sh"
source "$SCRIPT_DIR/scripts/lib/constants.sh"
source "$SCRIPT_DIR/scripts/lib/config.sh"
source "$SCRIPT_DIR/scripts/lib/create_structure.sh"

usage() {
    cat <<USAGE
Usage: pnpm create:app <app-name>
       bash scripts/new-ai-project.sh <app-name>

Creates a runnable AI project under apps/<app-name> with:
  - backend: FastAPI
  - ai: shared Python package for agents and RAG
  - frontend: React + TypeScript + SCSS on webpack
USAGE
}

slugify() {
    echo "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/[^a-z0-9]+/_/g; s/^_+//; s/_+$//'
}

main() {
    if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
        usage
        exit 0
    fi

    local RAW_APP_NAME="${1:-}"
    if [ -z "$RAW_APP_NAME" ]; then
        usage
        die "App name is required."
    fi

    local APP_NAME
    APP_NAME="$(slugify "$RAW_APP_NAME")"

    if [ -z "$APP_NAME" ]; then
        die "App name must contain at least one letter or number."
    fi

    if ! command -v pnpm >/dev/null 2>&1; then
        log_warning "pnpm is not on PATH. Use corepack pnpm or activate pnpm before running frontend commands."
    fi

    if ! command -v uv >/dev/null 2>&1; then
        log_warning "uv is not on PATH. Install or activate uv before running backend commands."
    fi

    load_config

    if [ -d "$APPS_DIR/$APP_NAME" ]; then
        die "App already exists: apps/$APP_NAME"
    fi

    create_structure "$APP_NAME"

    log_success "Created apps/$APP_NAME"
    log_info "Next steps:"
    log_info "  uv sync"
    log_info "  pnpm install"
    log_info "  pnpm --filter @apps/$APP_NAME-frontend dev"
    log_info "  uv run uvicorn apps.$APP_NAME.backend.app.main:app --reload"
}

main "$@"

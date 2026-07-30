#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$ROOT_DIR/apps"

usage() {
cat <<EOF
Usage:
  pnpm dev:app
  pnpm dev:app <project>
  pnpm dev:app <project> <backend|frontend>
  pnpm dev:app --list
EOF
}

list_apps() {
    find "$APPS_DIR" -mindepth 1 -maxdepth 1 -type d \
        -exec basename {} \; | sort
}

select_app() {

    mapfile -t APPS < <(list_apps)

    if [[ ${#APPS[@]} -eq 0 ]]; then
        echo "No applications found."
        exit 1
    fi

    echo
    echo "Available Projects"
    echo "=================="

    PS3="Select project: "

    select APP in "${APPS[@]}"; do
        [[ -n "$APP" ]] && return
        echo "Invalid selection."
    done
}

select_target() {

    local app="$1"

    TARGETS=()

    [[ -d "$APPS_DIR/$app/backend" ]] && TARGETS+=("backend")
    [[ -d "$APPS_DIR/$app/frontend" ]] && TARGETS+=("frontend")

    if [[ ${#TARGETS[@]} -eq 0 ]]; then
        echo "Project '$app' has no backend or frontend."
        exit 1
    fi

    if [[ ${#TARGETS[@]} -eq 1 ]]; then
        TARGET="${TARGETS[0]}"
        return
    fi

    echo
    echo "Available Targets"
    echo "================="

    PS3="Select target: "

    select TARGET in "${TARGETS[@]}"; do
        [[ -n "$TARGET" ]] && return
        echo "Invalid selection."
    done
}

run_backend() {

    local app="$1"

    echo
    echo "🚀 Starting FastAPI backend..."
    echo

    cd "$APPS_DIR/$app/backend"

    export PYTHONPATH="$ROOT_DIR${PYTHONPATH:+:$PYTHONPATH}"

    exec uv run uvicorn app.main:app --reload
}

run_frontend() {

    local app="$1"

    echo
    echo "🚀 Starting Frontend..."
    echo

    cd "$APPS_DIR/$app/frontend"

    exec pnpm dev
}

####################################
# Main
####################################

case "${1:-}" in
    --help|-h)
        usage
        exit 0
        ;;
    --list)
        list_apps
        exit 0
        ;;
esac

APP="${1:-}"

if [[ -z "$APP" ]]; then
    select_app
fi

if [[ ! -d "$APPS_DIR/$APP" ]]; then
    echo "Project '$APP' not found."
    exit 1
fi

TARGET="${2:-}"

if [[ -z "$TARGET" ]]; then
    select_target "$APP"
fi

case "$TARGET" in
    backend)
        run_backend "$APP"
        ;;
    frontend)
        run_frontend "$APP"
        ;;
    *)
        echo "Unknown target: $TARGET"
        exit 1
        ;;
esac

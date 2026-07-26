#!/usr/bin/env bash

# ==========================================================
# Common Utility Functions
# ==========================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ----------------------------------------------------------
# Logging
# ----------------------------------------------------------

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ----------------------------------------------------------
# Exit with message
# ----------------------------------------------------------

die() {
    log_error "$1"
    exit 1
}

# ----------------------------------------------------------
# Check required command
# ----------------------------------------------------------

require_command() {
    command -v "$1" >/dev/null 2>&1 || die "$1 is not installed."
}

# ----------------------------------------------------------
# Create directory
# ----------------------------------------------------------

create_dir() {
    mkdir -p "$1"
    log_success "Created directory: $1"
}

# ----------------------------------------------------------
# Create file if it doesn't exist
# ----------------------------------------------------------

create_file() {

    if [ ! -f "$1" ]; then
        touch "$1"
        log_success "Created file: $1"
    fi

}

# ----------------------------------------------------------
# Copy template
# ----------------------------------------------------------

copy_template() {

    local SRC="$1"
    local DEST="$2"

    cp "$SRC" "$DEST"

    log_success "Copied $(basename "$SRC")"

}

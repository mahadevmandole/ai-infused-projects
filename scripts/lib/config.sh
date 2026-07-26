#!/usr/bin/env bash

load_config() {

    if [ ! -f "$CONFIG_FILE" ]; then
        die "Configuration file not found: $CONFIG_FILE"
    fi

    source "$CONFIG_FILE"

    log_success "Generator configuration loaded."
}

#!/bin/bash -e

SCRIPT_DIR="$( realpath "$( dirname -- "${BASH_SOURCE[0]}" )" )"
REPO_DIR="$( realpath "${SCRIPT_DIR}/../.." )"

export PYTHONPATH="${REPO_DIR}/server"

python3 "${REPO_DIR}/server/itest/main.py" "${REPO_DIR}/server/itest/config/config.yaml"
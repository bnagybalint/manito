#!/bin/bash -e

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

"${SCRIPT_DIR}/db/start.sh"

"${SCRIPT_DIR}/app/start.sh"
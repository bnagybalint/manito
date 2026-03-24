#!/bin/bash -e

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

bash -c "cd '${SCRIPT_DIR}' && pipenv run backend"
#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

export FLASK_APP=server

bash -c "cd '${SCRIPT_DIR}' && python -m flask run"
#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

export FLASK_APP=data_service.server.app.app:create_app
export FLASK_ENV=development

export PYTHONPATH="${SCRIPT_DIR}/../../service:${SCRIPT_DIR}/../../lib/python:${PYTHONPATH}"

bash -c "cd '${SCRIPT_DIR}' && python server/main.py server/config.yaml"
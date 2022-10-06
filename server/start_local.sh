#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

export FLASK_APP=app.app:create_app
export FLASK_ENV=development

bash -c "cd '${SCRIPT_DIR}' && python -m flask run"
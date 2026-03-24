#!/bin/bash -e

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

npm install --dev

"${SCRIPT_DIR}/src/web/app/start.sh"
#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

APP_ROOT_DIR="${SCRIPT_DIR}"

# don't open the app by default
export BROWSER="none"

cd "${APP_ROOT_DIR}" && npm run start
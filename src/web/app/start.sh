#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

APP_ROOT_DIR="${SCRIPT_DIR}"

# don't open the app by default
export BROWSER="none"

npm run start --workspace "${APP_ROOT_DIR}"
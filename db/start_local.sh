#!/bin/bash -ex

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

docker run --rm \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin \
    -e POSTGRES_DB=manito \
    -v "${SCRIPT_DIR}/sql":/docker-entrypoint-initdb.d:ro \
    -p 5432:5432 \
    postgres:14.4

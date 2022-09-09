#!/bin/bash -e

SCRIPT_DIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "Starting local database..."
docker start manito-db

echo "Starting integration test database..."
docker start manito-db-itest

echo "Done."

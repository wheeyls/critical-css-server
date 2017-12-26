#!/bin/bash
set -e
export PORT=5000
export REDIS_URL=redis://redis
yarn install
exec "$@"

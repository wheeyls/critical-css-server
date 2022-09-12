#!/bin/bash
set -e
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=`which chromium`
export PORT=5001
export REDIS_URL=redis://redis
export
yarn install
exec "$@"

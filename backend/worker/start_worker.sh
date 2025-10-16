#!/bin/bash

# RQ Worker startup script for Render
# This script starts the RQ worker with proper configuration

echo "Starting RQ Worker..."

# Set environment variables if not already set
export REDIS_URL=${REDIS_URL:-"redis://localhost:6379"}
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start RQ worker with scheduler
exec rq worker default --url "$REDIS_URL" --with-scheduler --verbose

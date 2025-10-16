#!/bin/bash

# Startup script for PMArchitect backend
# This script handles both local development and Render deployment

echo "Starting PMArchitect Backend..."

# Set default port if PORT environment variable is not set
export PORT=${PORT:-8001}

# Set Python path to include current directory
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start the FastAPI server
echo "Starting server on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT

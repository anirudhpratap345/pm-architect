@echo off
REM Windows batch script for starting PMArchitect backend
REM This handles both local development and Render deployment

echo Starting PMArchitect Backend...

REM Set default port if PORT environment variable is not set
if "%PORT%"=="" set PORT=8001

REM Set Python path to include current directory
set PYTHONPATH=%PYTHONPATH%;%CD%

REM Start the FastAPI server
echo Starting server on port %PORT%...
python -m uvicorn app.main:app --host 0.0.0.0 --port %PORT%

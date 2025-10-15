@echo off
setlocal
cd /d %~dp0\..
python -m venv .venv
call .venv\Scripts\activate
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8001 --reload



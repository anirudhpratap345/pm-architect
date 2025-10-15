from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers.compare import router as compare_router


app = FastAPI(title="PMArchitect.ai Backend", version="0.1.0")


app.add_middleware(
  CORSMiddleware,
  allow_origins=[str(o) for o in settings.cors_origins] or ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health():
  return {"status": "ok"}


app.include_router(compare_router, prefix="/api")



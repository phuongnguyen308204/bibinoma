from fastapi import FastAPI

from .routes_misc import router as misc_router
from .routes_planning import router as planning_router
from .routes_heart import router as heart_router


def create_app() -> FastAPI:
    app = FastAPI(title="Bibinoma Chat API", version="1.0.0")
    app.include_router(misc_router)
    app.include_router(planning_router)
    app.include_router(heart_router)
    return app



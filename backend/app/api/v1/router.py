"""
Palmlion API v1 Router
"""
from fastapi import APIRouter

from app.api.v1 import auth, conviction, missions, verification, export

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(conviction.router, prefix="/conviction", tags=["Conviction"])
api_router.include_router(missions.router, prefix="/missions", tags=["Missions"])
api_router.include_router(verification.router, prefix="/verify", tags=["Verification"])
api_router.include_router(export.router, prefix="/export", tags=["Export"])

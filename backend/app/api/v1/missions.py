"""
Palmlion Missions API
#PalmDash missions for Telegram/WhatsApp
"""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Demo missions
demo_missions = {
    "mission-1": {
        "id": "mission-1",
        "title": "Share Burna Boy's new track to 5 WhatsApp groups",
        "description": "Spread the Afrobeats love! Share the official link to 5 different WhatsApp groups.",
        "artist_name": "Burna Boy",
        "mission_type": "share",
        "platform": "whatsapp",
        "threshold": 5,
        "reward_conviction_points": 50,
        "reward_multiplier": 1.2,
        "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat(),
        "status": "active",
        "participants": 127,
    },
    "mission-2": {
        "id": "mission-2",
        "title": "Join #PalmPride Telegram Channel",
        "description": "Join our official Telegram community and introduce yourself.",
        "artist_name": "Palmlion",
        "mission_type": "social",
        "platform": "telegram",
        "threshold": 1,
        "reward_conviction_points": 25,
        "reward_multiplier": 1.0,
        "expires_at": None,
        "status": "active",
        "participants": 892,
    },
    "mission-3": {
        "id": "mission-3",
        "title": "Stream Tems 100 times on Boomplay",
        "description": "Verified streaming challenge. Stream any Tems track 100 times.",
        "artist_name": "Tems",
        "mission_type": "stream",
        "platform": "boomplay",
        "threshold": 100,
        "reward_conviction_points": 100,
        "reward_multiplier": 1.5,
        "expires_at": (datetime.utcnow() + timedelta(days=14)).isoformat(),
        "status": "active",
        "participants": 56,
    },
}

# User progress
user_progress: dict = {}


class MissionSubmission(BaseModel):
    """Mission proof submission"""
    mission_id: str
    proof_type: str  # "screenshot", "link", "api_verification"
    proof_data: str
    platform_user_id: Optional[str] = None


@router.get("")
async def get_missions(
    user_id: str = "demo-user-1",
    platform: Optional[str] = None,
    mission_type: Optional[str] = None,
) -> dict:
    """
    Get available #PalmDash missions

    Missions are distributed via Telegram and WhatsApp.
    """
    missions = list(demo_missions.values())

    if platform:
        missions = [m for m in missions if m["platform"].lower() == platform.lower()]
    if mission_type:
        missions = [m for m in missions if m["mission_type"].lower() == mission_type.lower()]

    # Add user progress
    for mission in missions:
        progress_key = f"{user_id}:{mission['id']}"
        progress = user_progress.get(progress_key, {"current": 0, "status": "available"})
        mission["user_progress"] = progress["current"]
        mission["user_status"] = progress["status"]

    return {
        "missions": missions,
        "total": len(missions),
        "active": len([m for m in missions if m["status"] == "active"]),
    }


@router.get("/{mission_id}")
async def get_mission(mission_id: str, user_id: str = "demo-user-1") -> dict:
    """Get mission details with user progress"""
    mission = demo_missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    progress_key = f"{user_id}:{mission_id}"
    progress = user_progress.get(progress_key, {"current": 0, "status": "available"})

    return {
        **mission,
        "user_progress": progress["current"],
        "user_status": progress["status"],
        "percentage": (progress["current"] / mission["threshold"]) * 100,
    }


@router.post("/{mission_id}/submit")
async def submit_mission_proof(
    mission_id: str,
    submission: MissionSubmission,
    user_id: str = "demo-user-1",
) -> dict:
    """
    Submit proof for mission verification

    Proof types:
    - screenshot: Screenshot of completed action
    - link: Shareable link verification
    - api_verification: Automatic via platform API
    """
    mission = demo_missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    progress_key = f"{user_id}:{mission_id}"

    # Initialize progress if not exists
    if progress_key not in user_progress:
        user_progress[progress_key] = {"current": 0, "status": "in_progress"}

    progress = user_progress[progress_key]

    # Simulate verification (in production, would verify via APIs)
    import random
    increment = random.randint(1, 3)
    progress["current"] = min(progress["current"] + increment, mission["threshold"])

    result = {
        "verified": True,
        "mission_id": mission_id,
        "increment": increment,
        "current_progress": progress["current"],
        "threshold": mission["threshold"],
        "percentage": (progress["current"] / mission["threshold"]) * 100,
    }

    # Check completion
    if progress["current"] >= mission["threshold"]:
        progress["status"] = "completed"
        result["completed"] = True
        result["reward"] = {
            "conviction_points": mission["reward_conviction_points"],
            "multiplier": mission["reward_multiplier"],
        }
        result["convicta_export"] = "Conviction data will be exported to Convicta"

    return result


@router.get("/{mission_id}/verify")
async def check_verification_status(
    mission_id: str,
    user_id: str = "demo-user-1",
) -> dict:
    """Check verification status for a mission"""
    mission = demo_missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    progress_key = f"{user_id}:{mission_id}"
    progress = user_progress.get(progress_key, {"current": 0, "status": "available"})

    return {
        "mission_id": mission_id,
        "status": progress["status"],
        "current_progress": progress["current"],
        "threshold": mission["threshold"],
        "verified": progress["status"] == "completed",
    }

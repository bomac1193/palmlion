"""
Palmlion Export API
Export conviction data to Convicta and trigger Issuance mints
"""
from datetime import datetime, timedelta
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.core.conviction import (
    ActionType,
    ConvictionAction,
    Platform,
    calculate_conviction_score,
    export_to_convicta,
)

router = APIRouter()

# Demo actions for export
demo_actions = {
    "demo-user-1": [
        ConvictionAction(ActionType.STREAM, Platform.BOOMPLAY, datetime.utcnow() - timedelta(days=1), True),
        ConvictionAction(ActionType.STREAM, Platform.AUDIOMACK, datetime.utcnow() - timedelta(days=2), True),
        ConvictionAction(ActionType.SHARE, Platform.TELEGRAM, datetime.utcnow() - timedelta(days=3), True),
        ConvictionAction(ActionType.MISSION, Platform.TELEGRAM, datetime.utcnow() - timedelta(days=5), True),
    ]
}


class ExportRequest(BaseModel):
    """Export request to Convicta"""
    convicta_user_id: Optional[str] = None


class BatchExportRequest(BaseModel):
    """Batch export request"""
    user_ids: list[str]


@router.get("/conviction/{user_id}")
async def export_conviction_data(user_id: str) -> dict:
    """
    Export conviction data for a user

    Used by Convicta to pull African superfan metrics.
    """
    actions = demo_actions.get(user_id, [])
    score = calculate_conviction_score(actions)

    export_data = export_to_convicta(user_id, score)

    return {
        "export_format": "convicta_v1",
        "data": export_data,
        "generated_at": datetime.utcnow().isoformat(),
    }


@router.post("/conviction/{user_id}/push")
async def push_to_convicta(
    user_id: str,
    request: ExportRequest,
) -> dict:
    """
    Push conviction data to Convicta webhook

    Triggers real-time update of user's Impact Power in Convicta.
    """
    actions = demo_actions.get(user_id, [])
    score = calculate_conviction_score(actions)
    export_data = export_to_convicta(user_id, score)

    # Add Convicta user ID mapping if provided
    if request.convicta_user_id:
        export_data["convicta_user_id"] = request.convicta_user_id

    # Push to Convicta webhook
    if settings.CONVICTA_API_URL and settings.CONVICTA_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.CONVICTA_API_URL}/api/v1/webhooks/palmlion/conviction",
                    json=export_data,
                    headers={
                        "X-Webhook-Signature": settings.CONVICTA_WEBHOOK_SECRET,
                        "Content-Type": "application/json",
                    },
                    timeout=30.0,
                )

                return {
                    "pushed": True,
                    "convicta_response": response.status_code,
                    "data": export_data,
                }
        except Exception as e:
            return {
                "pushed": False,
                "error": str(e),
                "data": export_data,
            }

    # Demo mode - no actual push
    return {
        "pushed": False,
        "mode": "demo",
        "message": "CONVICTA_API_URL not configured",
        "data": export_data,
    }


@router.post("/batch")
async def batch_export(request: BatchExportRequest) -> dict:
    """
    Batch export conviction data for multiple users

    Used for periodic sync with Convicta.
    """
    exports = []

    for user_id in request.user_ids:
        actions = demo_actions.get(user_id, [])
        score = calculate_conviction_score(actions)
        export_data = export_to_convicta(user_id, score)
        exports.append(export_data)

    return {
        "batch_size": len(exports),
        "exports": exports,
        "generated_at": datetime.utcnow().isoformat(),
    }


@router.post("/trigger-mint/{user_id}")
async def trigger_issuance_mint(
    user_id: str,
    artist_name: str,
    stake_percentage: float,
    wallet_address: str,
) -> dict:
    """
    Trigger fractional IP mint via Issuance

    Called when a user completes qualifying missions.
    """
    mint_trigger = {
        "source": "palmlion",
        "user_id": user_id,
        "artist_name": artist_name,
        "stake_percentage": stake_percentage,
        "wallet_address": wallet_address,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # In production, would call Issuance API
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(
    #         f"{settings.ISSUANCE_API_URL}/api/v1/mint/fractional",
    #         json=mint_trigger,
    #     )

    return {
        "triggered": True,
        "mint_request": mint_trigger,
        "message": "Mint trigger sent to Issuance (demo mode)",
    }

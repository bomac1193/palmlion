"""
Palmlion Conviction Scoring API
African superfan conviction metrics and leaderboards
"""
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Query

from app.core.conviction import (
    ActionType,
    ConvictionAction,
    ConvictionScore,
    Platform,
    calculate_conviction_score,
)

router = APIRouter()

# Demo conviction data
demo_actions = {
    "demo-user-1": [
        ConvictionAction(ActionType.STREAM, Platform.BOOMPLAY, datetime.utcnow() - timedelta(days=1), True),
        ConvictionAction(ActionType.STREAM, Platform.BOOMPLAY, datetime.utcnow() - timedelta(days=1), True),
        ConvictionAction(ActionType.STREAM, Platform.AUDIOMACK, datetime.utcnow() - timedelta(days=2), True),
        ConvictionAction(ActionType.SHARE, Platform.TELEGRAM, datetime.utcnow() - timedelta(days=3), True),
        ConvictionAction(ActionType.MISSION, Platform.TELEGRAM, datetime.utcnow() - timedelta(days=5), True),
        ConvictionAction(ActionType.TIP, Platform.MTN_MUSIC, datetime.utcnow() - timedelta(days=7), True),
    ]
}


@router.get("/score")
async def get_conviction_score(
    user_id: str = "demo-user-1",
) -> dict:
    """
    Get user's current conviction score

    Conviction measures dedication via African platform verification.
    """
    actions = demo_actions.get(user_id, [])
    score = calculate_conviction_score(actions)

    return {
        "user_id": user_id,
        "conviction_score": score.score,
        "impact_power": float(score.impact_power),
        "tier": score.tier,
        "percentile": score.percentile,
        "action_count": score.action_count,
        "consistency_rating": score.consistency_rating,
        "streak_days": score.streak_days,
    }


@router.get("/breakdown")
async def get_score_breakdown(
    user_id: str = "demo-user-1",
) -> dict:
    """
    Get detailed breakdown of conviction score components
    """
    actions = demo_actions.get(user_id, [])
    score = calculate_conviction_score(actions)

    return {
        "user_id": user_id,
        "total_score": score.score,
        "platform_breakdown": score.platform_breakdown,
        "components": {
            "streaming": sum(1 for a in actions if a.action_type == ActionType.STREAM),
            "social": sum(1 for a in actions if a.action_type in [ActionType.SHARE, ActionType.SOCIAL_PROOF]),
            "missions": sum(1 for a in actions if a.action_type == ActionType.MISSION),
            "payments": sum(1 for a in actions if a.action_type in [ActionType.PURCHASE, ActionType.TIP]),
        },
        "platform_weights": {
            "boomplay": 1.2,
            "audiomack": 1.1,
            "mtn_music": 1.3,
            "telegram": 1.0,
            "whatsapp": 1.1,
        },
    }


@router.get("/history")
async def get_conviction_history(
    user_id: str = "demo-user-1",
    days: int = Query(default=30, le=90),
) -> dict:
    """Get conviction score history over time"""
    history = []
    base_score = 50.0

    for i in range(days, 0, -1):
        date = datetime.utcnow() - timedelta(days=i)
        import random
        score = base_score * (1 + (days - i) * 0.02) + random.uniform(-5, 10)
        history.append({
            "date": date.date().isoformat(),
            "score": round(max(0, score), 2),
        })

    return {
        "user_id": user_id,
        "period_days": days,
        "history": history,
    }


@router.get("/leaderboard")
async def get_leaderboard(
    region: Optional[str] = None,
    limit: int = Query(default=50, le=100),
) -> dict:
    """
    Get conviction leaderboard

    #PalmDash regional rankings for African superfans.
    """
    demo_leaderboard = [
        {"rank": 1, "display_name": "AfrobeatKing_Lagos", "score": 847, "tier": "diamond", "region": "lagos"},
        {"rank": 2, "display_name": "TemsFan254", "score": 723, "tier": "diamond", "region": "nairobi"},
        {"rank": 3, "display_name": "AmapianoPrincess", "score": 651, "tier": "gold", "region": "johannesburg"},
        {"rank": 4, "display_name": "BurnaBoyFC", "score": 598, "tier": "gold", "region": "lagos"},
        {"rank": 5, "display_name": "GhanaStreamer", "score": 512, "tier": "gold", "region": "accra"},
    ]

    if region:
        demo_leaderboard = [e for e in demo_leaderboard if e["region"].lower() == region.lower()]

    return {
        "leaderboard": demo_leaderboard[:limit],
        "total_participants": len(demo_leaderboard),
        "region_filter": region,
        "updated_at": datetime.utcnow().isoformat(),
    }


@router.get("/tiers")
async def get_tier_thresholds() -> dict:
    """Get conviction tier thresholds and benefits"""
    return {
        "tiers": [
            {
                "name": "diamond",
                "min_score": 500,
                "benefits": [
                    "Priority mission access",
                    "Highest fractional stake multiplier (2x)",
                    "Direct artist interaction opportunities",
                    "Exclusive merch drops",
                ],
            },
            {
                "name": "gold",
                "min_score": 250,
                "benefits": [
                    "Early mission access",
                    "Enhanced stake multiplier (1.5x)",
                    "Community VIP status",
                ],
            },
            {
                "name": "silver",
                "min_score": 100,
                "benefits": [
                    "Standard mission access",
                    "Base stake multiplier",
                    "Leaderboard eligibility",
                ],
            },
            {
                "name": "bronze",
                "min_score": 50,
                "benefits": [
                    "Basic mission access",
                    "Community membership",
                ],
            },
            {
                "name": "starter",
                "min_score": 0,
                "benefits": [
                    "Platform access",
                    "Score building missions",
                ],
            },
        ],
    }

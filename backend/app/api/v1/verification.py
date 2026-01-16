"""
Palmlion Verification API
Link and verify streaming accounts
"""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Linked accounts store
linked_accounts: dict = {}


class LinkBoomplayRequest(BaseModel):
    """Link Boomplay account"""
    boomplay_user_id: str
    access_token: Optional[str] = None


class LinkAudiomackRequest(BaseModel):
    """Link Audiomack account"""
    audiomack_url_slug: str
    access_token: Optional[str] = None


class VerifyStreamRequest(BaseModel):
    """Verify streaming request"""
    platform: str
    track_id: str
    min_plays: int


@router.post("/boomplay")
async def link_boomplay(
    data: LinkBoomplayRequest,
    user_id: str = "demo-user-1",
) -> dict:
    """
    Link Boomplay account for verification

    Boomplay is Africa's largest streaming platform.
    """
    account_key = f"{user_id}:boomplay"

    # In production, would validate via Boomplay OAuth
    linked_accounts[account_key] = {
        "platform": "boomplay",
        "platform_user_id": data.boomplay_user_id,
        "verified": True,
        "linked_at": datetime.utcnow().isoformat(),
    }

    return {
        "linked": True,
        "platform": "boomplay",
        "platform_user_id": data.boomplay_user_id,
        "message": "Boomplay account linked successfully",
    }


@router.post("/audiomack")
async def link_audiomack(
    data: LinkAudiomackRequest,
    user_id: str = "demo-user-1",
) -> dict:
    """
    Link Audiomack account for verification

    Audiomack has strong presence in Nigeria and African diaspora.
    """
    account_key = f"{user_id}:audiomack"

    linked_accounts[account_key] = {
        "platform": "audiomack",
        "platform_user_id": data.audiomack_url_slug,
        "verified": True,
        "linked_at": datetime.utcnow().isoformat(),
    }

    return {
        "linked": True,
        "platform": "audiomack",
        "platform_user_id": data.audiomack_url_slug,
        "message": "Audiomack account linked successfully",
    }


@router.get("/status")
async def get_verification_status(user_id: str = "demo-user-1") -> dict:
    """Get all linked account statuses"""
    platforms = ["boomplay", "audiomack", "mtn_music", "telegram", "whatsapp"]
    statuses = []

    for platform in platforms:
        account_key = f"{user_id}:{platform}"
        account = linked_accounts.get(account_key)

        statuses.append({
            "platform": platform,
            "linked": account is not None,
            "verified": account.get("verified", False) if account else False,
            "linked_at": account.get("linked_at") if account else None,
        })

    return {
        "user_id": user_id,
        "accounts": statuses,
        "total_linked": sum(1 for s in statuses if s["linked"]),
    }


@router.post("/streams")
async def verify_streams(
    data: VerifyStreamRequest,
    user_id: str = "demo-user-1",
) -> dict:
    """
    Verify streaming count on a platform

    Used for mission verification.
    """
    account_key = f"{user_id}:{data.platform}"
    account = linked_accounts.get(account_key)

    if not account:
        raise HTTPException(
            status_code=400,
            detail=f"No {data.platform} account linked. Link account first.",
        )

    # Simulate verification (in production, call platform API)
    import random
    play_count = random.randint(50, 150)
    verified = play_count >= data.min_plays

    return {
        "verified": verified,
        "platform": data.platform,
        "track_id": data.track_id,
        "play_count": play_count,
        "required": data.min_plays,
        "verified_at": datetime.utcnow().isoformat() if verified else None,
    }


@router.get("/oauth/{platform}")
async def get_oauth_url(
    platform: str,
    redirect_uri: str = "https://palmlion.ai/callback",
) -> dict:
    """Get OAuth URL for platform linking"""
    oauth_urls = {
        "boomplay": f"https://auth.boomplay.com/oauth/authorize?client_id=PALMLION&redirect_uri={redirect_uri}&scope=user:read,streams:read",
        "audiomack": f"https://www.audiomack.com/oauth/authorize?client_id=PALMLION&redirect_uri={redirect_uri}&scope=user_read,plays_read",
    }

    if platform not in oauth_urls:
        raise HTTPException(status_code=400, detail=f"OAuth not supported for {platform}")

    return {
        "platform": platform,
        "oauth_url": oauth_urls[platform],
        "redirect_uri": redirect_uri,
    }

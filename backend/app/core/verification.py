"""
Palmlion Verification Engine
Verify African superfan actions via streaming, social, and telco APIs
"""
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional

import httpx

from app.core.config import settings


class VerificationStatus(str, Enum):
    """Verification status"""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    EXPIRED = "expired"


class VerificationType(str, Enum):
    """Types of verification"""
    STREAMING = "streaming"
    SOCIAL = "social"
    PAYMENT = "payment"
    PHONE = "phone"
    REFERRAL = "referral"


@dataclass
class VerificationResult:
    """Result of verification attempt"""
    verified: bool
    status: VerificationStatus
    verification_type: VerificationType
    platform: str
    proof_hash: Optional[str] = None
    metadata: Optional[dict] = None
    error: Optional[str] = None


async def verify_boomplay_streams(
    user_id: str,
    track_id: str,
    min_plays: int,
) -> VerificationResult:
    """
    Verify user's streaming activity on Boomplay

    Boomplay is Africa's largest music streaming platform.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.boomplay.com/v1/users/{user_id}/streams/{track_id}",
                headers={
                    "X-API-Key": settings.BOOMPLAY_API_KEY,
                    "X-API-Secret": settings.BOOMPLAY_API_SECRET,
                },
                timeout=30.0,
            )

            if response.status_code == 200:
                data = response.json()
                play_count = data.get("play_count", 0)
                verified = play_count >= min_plays

                return VerificationResult(
                    verified=verified,
                    status=VerificationStatus.VERIFIED if verified else VerificationStatus.REJECTED,
                    verification_type=VerificationType.STREAMING,
                    platform="boomplay",
                    proof_hash=f"bp:{user_id}:{track_id}:{play_count}",
                    metadata={"play_count": play_count, "required": min_plays},
                )
            else:
                return VerificationResult(
                    verified=False,
                    status=VerificationStatus.REJECTED,
                    verification_type=VerificationType.STREAMING,
                    platform="boomplay",
                    error=f"API error: {response.status_code}",
                )
        except Exception as e:
            return VerificationResult(
                verified=False,
                status=VerificationStatus.REJECTED,
                verification_type=VerificationType.STREAMING,
                platform="boomplay",
                error=str(e),
            )


async def verify_audiomack_plays(
    user_id: str,
    track_id: str,
    min_plays: int,
) -> VerificationResult:
    """
    Verify user's plays on Audiomack

    Audiomack has strong presence in Nigeria and Africa.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.audiomack.com/v1/user/{user_id}/plays/{track_id}",
                headers={
                    "Authorization": f"Bearer {settings.AUDIOMACK_API_KEY}",
                },
                timeout=30.0,
            )

            if response.status_code == 200:
                data = response.json()
                play_count = data.get("plays", 0)
                verified = play_count >= min_plays

                return VerificationResult(
                    verified=verified,
                    status=VerificationStatus.VERIFIED if verified else VerificationStatus.REJECTED,
                    verification_type=VerificationType.STREAMING,
                    platform="audiomack",
                    proof_hash=f"am:{user_id}:{track_id}:{play_count}",
                    metadata={"play_count": play_count, "required": min_plays},
                )
            else:
                return VerificationResult(
                    verified=False,
                    status=VerificationStatus.REJECTED,
                    verification_type=VerificationType.STREAMING,
                    platform="audiomack",
                    error=f"API error: {response.status_code}",
                )
        except Exception as e:
            return VerificationResult(
                verified=False,
                status=VerificationStatus.REJECTED,
                verification_type=VerificationType.STREAMING,
                platform="audiomack",
                error=str(e),
            )


async def verify_phone_via_africas_talking(
    phone_number: str,
    otp_code: str,
    expected_code: str,
) -> VerificationResult:
    """
    Verify phone number via Africa's Talking SMS

    Africa's Talking provides SMS verification across Africa.
    """
    verified = otp_code == expected_code

    return VerificationResult(
        verified=verified,
        status=VerificationStatus.VERIFIED if verified else VerificationStatus.REJECTED,
        verification_type=VerificationType.PHONE,
        platform="africas_talking",
        proof_hash=f"at:{phone_number[:6]}...:{datetime.utcnow().timestamp()}",
        metadata={"phone_prefix": phone_number[:6]},
    )


async def verify_mtn_momo_payment(
    phone_number: str,
    transaction_id: str,
    min_amount: float,
) -> VerificationResult:
    """
    Verify payment via MTN Mobile Money

    MTN MoMo is the dominant mobile money platform in West/Central Africa.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://momoapi.mtn.com/collection/v1_0/requesttopay/{transaction_id}",
                headers={
                    "Authorization": f"Bearer {settings.MTN_MOMO_API_KEY}",
                    "Ocp-Apim-Subscription-Key": settings.MTN_MOMO_SUBSCRIPTION_KEY,
                    "X-Target-Environment": "production",
                },
                timeout=30.0,
            )

            if response.status_code == 200:
                data = response.json()
                status = data.get("status")
                amount = float(data.get("amount", 0))

                verified = status == "SUCCESSFUL" and amount >= min_amount

                return VerificationResult(
                    verified=verified,
                    status=VerificationStatus.VERIFIED if verified else VerificationStatus.REJECTED,
                    verification_type=VerificationType.PAYMENT,
                    platform="mtn_momo",
                    proof_hash=f"momo:{transaction_id}",
                    metadata={"amount": amount, "status": status, "currency": data.get("currency")},
                )
            else:
                return VerificationResult(
                    verified=False,
                    status=VerificationStatus.REJECTED,
                    verification_type=VerificationType.PAYMENT,
                    platform="mtn_momo",
                    error=f"API error: {response.status_code}",
                )
        except Exception as e:
            return VerificationResult(
                verified=False,
                status=VerificationStatus.REJECTED,
                verification_type=VerificationType.PAYMENT,
                platform="mtn_momo",
                error=str(e),
            )


async def verify_telegram_membership(
    telegram_user_id: str,
    chat_id: str,
) -> VerificationResult:
    """
    Verify user is member of Telegram group/channel

    Used for #PalmDash mission verification.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getChatMember",
                params={
                    "chat_id": chat_id,
                    "user_id": telegram_user_id,
                },
                timeout=30.0,
            )

            if response.status_code == 200:
                data = response.json()
                if data.get("ok"):
                    status = data["result"].get("status")
                    verified = status in ["member", "administrator", "creator"]

                    return VerificationResult(
                        verified=verified,
                        status=VerificationStatus.VERIFIED if verified else VerificationStatus.REJECTED,
                        verification_type=VerificationType.SOCIAL,
                        platform="telegram",
                        proof_hash=f"tg:{telegram_user_id}:{chat_id}",
                        metadata={"membership_status": status},
                    )

            return VerificationResult(
                verified=False,
                status=VerificationStatus.REJECTED,
                verification_type=VerificationType.SOCIAL,
                platform="telegram",
                error="Could not verify membership",
            )
        except Exception as e:
            return VerificationResult(
                verified=False,
                status=VerificationStatus.REJECTED,
                verification_type=VerificationType.SOCIAL,
                platform="telegram",
                error=str(e),
            )

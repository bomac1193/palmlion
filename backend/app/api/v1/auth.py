"""
Palmlion Authentication API
Phone/Telegram/WhatsApp registration for African superfans
"""
from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# Demo user store
users_db: dict = {}
otp_store: dict = {}


class PhoneRegister(BaseModel):
    """Phone registration request"""
    phone: str  # Format: +234XXXXXXXXXX
    region: str = "lagos"


class OTPVerify(BaseModel):
    """OTP verification request"""
    phone: str
    code: str


class TelegramRegister(BaseModel):
    """Telegram registration"""
    telegram_id: str
    telegram_username: Optional[str] = None
    region: str = "lagos"


class UserResponse(BaseModel):
    """User response"""
    id: str
    phone: Optional[str] = None
    telegram_id: Optional[str] = None
    region: str
    conviction_tier: str
    created_at: str


@router.post("/register/phone")
async def register_phone(data: PhoneRegister):
    """
    Register with phone number (Nigeria, Kenya, SA, etc.)

    Sends OTP via Africa's Talking SMS.
    """
    # Validate phone format (African numbers)
    valid_prefixes = ["+234", "+254", "+27", "+233", "+256"]
    if not any(data.phone.startswith(p) for p in valid_prefixes):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Phone must start with: {', '.join(valid_prefixes)}",
        )

    # Generate OTP
    import random
    otp = str(random.randint(100000, 999999))
    otp_store[data.phone] = {
        "code": otp,
        "region": data.region,
        "expires": datetime.utcnow().timestamp() + 300,  # 5 min
    }

    # In production, send via Africa's Talking
    print(f"[Palmlion] OTP for {data.phone}: {otp}")

    return {
        "message": "OTP sent",
        "phone": data.phone[:6] + "****",
        "expires_in": 300,
    }


@router.post("/verify-otp", response_model=UserResponse)
async def verify_otp(data: OTPVerify):
    """Verify OTP and complete registration"""
    stored = otp_store.get(data.phone)

    if not stored:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this phone",
        )

    if datetime.utcnow().timestamp() > stored["expires"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired",
        )

    if stored["code"] != data.code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP",
        )

    # Create user
    user_id = str(uuid4())
    user = {
        "id": user_id,
        "phone": data.phone,
        "region": stored["region"],
        "conviction_tier": "starter",
        "created_at": datetime.utcnow().isoformat(),
    }
    users_db[user_id] = user

    # Clean up OTP
    del otp_store[data.phone]

    return UserResponse(**user)


@router.post("/register/telegram", response_model=UserResponse)
async def register_telegram(data: TelegramRegister):
    """
    Register via Telegram

    Used for #PalmDash missions and bot interactions.
    """
    # Check if already registered
    for user in users_db.values():
        if user.get("telegram_id") == data.telegram_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Telegram already registered",
            )

    user_id = str(uuid4())
    user = {
        "id": user_id,
        "telegram_id": data.telegram_id,
        "telegram_username": data.telegram_username,
        "region": data.region,
        "conviction_tier": "starter",
        "created_at": datetime.utcnow().isoformat(),
    }
    users_db[user_id] = user

    return UserResponse(**user)


@router.get("/me")
async def get_current_user(user_id: str):
    """Get current user profile"""
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

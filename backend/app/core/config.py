"""
Palmlion Configuration
African music analytics platform settings
"""
from functools import lru_cache
from typing import List

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "Palmlion"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    SECRET_KEY: str = Field(default="change-me-in-production")

    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:3001", "https://palmlion.ai"]

    # Database
    DATABASE_URL: PostgresDsn = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/palmlion"
    )

    # Redis
    REDIS_URL: RedisDsn = Field(default="redis://localhost:6379/1")

    # JWT Auth
    JWT_SECRET_KEY: str = Field(default="jwt-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # African Streaming APIs
    BOOMPLAY_API_KEY: str = Field(default="")
    BOOMPLAY_API_SECRET: str = Field(default="")
    AUDIOMACK_API_KEY: str = Field(default="")
    AUDIOMACK_API_SECRET: str = Field(default="")
    MTN_MUSIC_API_KEY: str = Field(default="")

    # Social/Verification
    TELEGRAM_BOT_TOKEN: str = Field(default="")
    WHATSAPP_BUSINESS_TOKEN: str = Field(default="")
    WHATSAPP_PHONE_NUMBER_ID: str = Field(default="")
    AFRICAS_TALKING_API_KEY: str = Field(default="")
    AFRICAS_TALKING_USERNAME: str = Field(default="")

    # Payment Verification
    MTN_MOMO_API_KEY: str = Field(default="")
    MTN_MOMO_SUBSCRIPTION_KEY: str = Field(default="")
    OPAY_API_KEY: str = Field(default="")
    OPAY_MERCHANT_ID: str = Field(default="")

    # Convicta Integration
    CONVICTA_API_URL: str = Field(default="http://localhost:8000")
    CONVICTA_API_KEY: str = Field(default="")
    CONVICTA_WEBHOOK_SECRET: str = Field(default="")

    # Conviction Scoring
    CONVICTION_DECAY_RATE: float = 0.1  # 10% weekly decay
    CONVICTION_LOOKBACK_DAYS: int = 90
    MIN_CONVICTION_THRESHOLD: float = 0.3


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

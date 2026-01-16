"""
Palmlion Conviction Scoring Engine
African superfan conviction calculation and Impact Power
"""
from dataclasses import dataclass
from datetime import datetime, timedelta
from decimal import Decimal
from enum import Enum
from typing import List, Optional

import numpy as np

from app.core.config import settings


class Platform(str, Enum):
    """African streaming platforms"""
    BOOMPLAY = "boomplay"
    AUDIOMACK = "audiomack"
    MTN_MUSIC = "mtn_music"
    YOUTUBE = "youtube"
    TELEGRAM = "telegram"
    WHATSAPP = "whatsapp"
    TWITTER = "twitter"


class ActionType(str, Enum):
    """Types of verifiable fan actions"""
    STREAM = "stream"
    SHARE = "share"
    PURCHASE = "purchase"
    TIP = "tip"
    MISSION = "mission"
    REFERRAL = "referral"
    SOCIAL_PROOF = "social_proof"


# Platform weights - African platforms have higher trust
PLATFORM_WEIGHTS = {
    Platform.BOOMPLAY: 1.2,      # High trust - African-first
    Platform.AUDIOMACK: 1.1,    # Good African presence
    Platform.MTN_MUSIC: 1.3,    # Telco verification = high trust
    Platform.YOUTUBE: 0.9,      # Global, lower weight
    Platform.TELEGRAM: 1.0,     # Neutral
    Platform.WHATSAPP: 1.1,     # High engagement
    Platform.TWITTER: 0.8,      # Bot-heavy, lower weight
}

# Action weights for conviction
ACTION_WEIGHTS = {
    ActionType.STREAM: Decimal("1.0"),
    ActionType.SHARE: Decimal("1.5"),
    ActionType.PURCHASE: Decimal("5.0"),
    ActionType.TIP: Decimal("4.0"),
    ActionType.MISSION: Decimal("2.0"),
    ActionType.REFERRAL: Decimal("3.0"),
    ActionType.SOCIAL_PROOF: Decimal("0.5"),
}


@dataclass
class ConvictionAction:
    """A verified conviction action from African platforms"""
    action_type: ActionType
    platform: Platform
    timestamp: datetime
    verified: bool
    proof_hash: Optional[str] = None
    metadata: Optional[dict] = None


@dataclass
class ConvictionScore:
    """Complete conviction score result"""
    score: float
    impact_power: Decimal
    percentile: float
    tier: str
    action_count: int
    platform_breakdown: dict
    consistency_rating: str
    streak_days: int


def calculate_conviction_score(
    actions: List[ConvictionAction],
    decay_rate: float = settings.CONVICTION_DECAY_RATE,
    lookback_days: int = settings.CONVICTION_LOOKBACK_DAYS,
) -> ConvictionScore:
    """
    Calculate conviction score for an African superfan

    Factors:
    - Verified actions on African platforms (higher weight)
    - Consistency over time (exponential decay)
    - Platform diversity (multiple platforms = higher trust)
    - Action diversity (different action types)

    Returns:
        ConvictionScore with full breakdown
    """
    if not actions:
        return ConvictionScore(
            score=0.0,
            impact_power=Decimal("0"),
            percentile=0.0,
            tier="unranked",
            action_count=0,
            platform_breakdown={},
            consistency_rating="inactive",
            streak_days=0,
        )

    now = datetime.utcnow()
    cutoff = now - timedelta(days=lookback_days)

    # Filter verified actions in lookback period
    recent_actions = [a for a in actions if a.verified and a.timestamp >= cutoff]

    if not recent_actions:
        return ConvictionScore(
            score=0.0,
            impact_power=Decimal("0"),
            percentile=0.0,
            tier="dormant",
            action_count=0,
            platform_breakdown={},
            consistency_rating="inactive",
            streak_days=0,
        )

    # Calculate time-weighted scores per action
    weighted_scores = []
    platform_counts: dict = {}
    action_type_counts: dict = {}

    for action in recent_actions:
        days_ago = (now - action.timestamp).days
        weeks_ago = days_ago / 7

        # Time decay
        time_weight = np.exp(-decay_rate * weeks_ago)

        # Platform weight
        platform_weight = PLATFORM_WEIGHTS.get(action.platform, 1.0)

        # Action weight
        action_weight = float(ACTION_WEIGHTS.get(action.action_type, Decimal("1.0")))

        # Combined score
        score = time_weight * platform_weight * action_weight
        weighted_scores.append(score)

        # Track breakdowns
        platform_counts[action.platform.value] = platform_counts.get(action.platform.value, 0) + 1
        action_type_counts[action.action_type.value] = action_type_counts.get(action.action_type.value, 0) + 1

    # Calculate total score
    total_score = sum(weighted_scores)

    # Calculate Impact Power (normalized)
    impact_power = Decimal(str(total_score * 10))  # Scale factor

    # Platform diversity bonus
    platform_diversity = len(platform_counts) / len(Platform)
    diversity_bonus = 1 + (platform_diversity * 0.2)  # Up to 20% bonus
    total_score *= diversity_bonus

    # Calculate streak
    streak_days = calculate_streak(recent_actions)

    # Determine tier
    tier = determine_conviction_tier(total_score)

    # Estimate percentile
    percentile = estimate_conviction_percentile(total_score)

    # Consistency rating
    consistency_rating = rate_consistency(recent_actions, lookback_days)

    return ConvictionScore(
        score=round(total_score, 2),
        impact_power=impact_power,
        percentile=percentile,
        tier=tier,
        action_count=len(recent_actions),
        platform_breakdown=platform_counts,
        consistency_rating=consistency_rating,
        streak_days=streak_days,
    )


def calculate_streak(actions: List[ConvictionAction]) -> int:
    """Calculate consecutive days with at least one action"""
    if not actions:
        return 0

    # Get unique dates
    dates = sorted(set(a.timestamp.date() for a in actions), reverse=True)
    if not dates:
        return 0

    streak = 1
    for i in range(len(dates) - 1):
        if (dates[i] - dates[i + 1]).days == 1:
            streak += 1
        else:
            break

    return streak


def determine_conviction_tier(score: float) -> str:
    """Determine tier based on conviction score"""
    if score >= 500:
        return "diamond"
    elif score >= 250:
        return "gold"
    elif score >= 100:
        return "silver"
    elif score >= 50:
        return "bronze"
    else:
        return "starter"


def estimate_conviction_percentile(score: float) -> float:
    """Estimate percentile based on score distribution"""
    if score >= 1000:
        return 99.0
    elif score >= 500:
        return 95.0
    elif score >= 250:
        return 85.0
    elif score >= 100:
        return 70.0
    elif score >= 50:
        return 50.0
    else:
        return max(1.0, score / 2)


def rate_consistency(actions: List[ConvictionAction], lookback_days: int) -> str:
    """Rate action consistency"""
    if not actions:
        return "inactive"

    # Calculate action density (actions per day)
    unique_days = len(set(a.timestamp.date() for a in actions))
    density = unique_days / lookback_days

    if density >= 0.7:
        return "legendary"
    elif density >= 0.5:
        return "excellent"
    elif density >= 0.3:
        return "good"
    elif density >= 0.1:
        return "building"
    else:
        return "sporadic"


def export_to_convicta(user_id: str, conviction_score: ConvictionScore) -> dict:
    """
    Format conviction data for export to Convicta

    Convicta uses this data to:
    - Update Impact Power calculations
    - Track African superfan metrics
    - Trigger fractional IP stakes
    """
    return {
        "user_id": user_id,
        "palmlion_conviction": {
            "score": conviction_score.score,
            "impact_power": float(conviction_score.impact_power),
            "tier": conviction_score.tier,
            "percentile": conviction_score.percentile,
            "action_count": conviction_score.action_count,
            "platform_breakdown": conviction_score.platform_breakdown,
            "consistency_rating": conviction_score.consistency_rating,
            "streak_days": conviction_score.streak_days,
        },
        "region": "africa",
        "timestamp": datetime.utcnow().isoformat(),
    }

# Palmlion

**The conviction layer for African music.**

---

## Diagnosis

Western streaming platforms extract billions in value from African music while returning almost nothing. Spotify, Apple Music, and YouTube treat African streams as second-class data—aggregated, anonymized, exported. Artists don't know their real fans. Fans can't prove their dedication. The infrastructure for superfan economies doesn't exist on the continent.

Meanwhile, African-native platforms (Boomplay, Audiomack, MTN Music) have the data but no mechanism to surface conviction—the measurable, verifiable dedication that separates superfans from casual listeners.

## Guiding Policy

Build the conviction scoring engine where African music actually lives. Weight African-first platforms highest. Verify through telco infrastructure. Keep the data sovereign.

## Strategy

1. **Conviction Scoring** — Quantify fan dedication across Boomplay, Audiomack, MTN Music, WhatsApp, and Telegram. African platforms weighted higher than extractive Western APIs. Score = Σ(Action × Platform Weight × Time Decay).

2. **Palmlion Missions** — Distributed challenges via Telegram and WhatsApp that generate verifiable proof-of-fandom: stream targets, social sharing, community engagement. Each completed mission compounds conviction score.

## Divergence

| Competitors | Palmlion |
|-------------|----------|
| Aggregate global streams | Weight African-native platforms highest |
| Anonymous listener counts | Named, verified superfans via telco OTP |
| Data exported to Western APIs | Data stays sovereign, exported only to African artist dashboards |
| Passive analytics | Active missions that reward and verify dedication |
| One global leaderboard | Regional leaderboards (Lagos, Nairobi, Joburg, Accra, Kampala) |

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -e .
cp .env.example .env
uvicorn app.main:app --reload --port 4001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard at http://localhost:3001

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PALMLION                                │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)          │  Backend (FastAPI)              │
│  ├── Conviction Dashboard    │  ├── /api/v1/auth               │
│  ├── Palmlion Missions       │  ├── /api/v1/conviction         │
│  ├── Regional Leaderboards   │  ├── /api/v1/missions           │
│  └── Streaming Proof         │  ├── /api/v1/verify             │
│                              │  └── /api/v1/export             │
├──────────────────────────────┴──────────────────────────────────┤
│                     INTEGRATIONS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   BOOMPLAY   │  │   TELEGRAM   │  │     CONVICTA        │  │
│  │   Streaming  │  │   Bot API    │  │     Export          │  │
│  │   Verify     │  │   Missions   │  │     Webhook         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  AUDIOMACK   │  │  WHATSAPP    │  │     ISSUANCE        │  │
│  │  Plays API   │  │  Business    │  │     Mint Trigger    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conviction Tiers

| Tier | Min Score | Benefits |
|------|-----------|----------|
| Diamond | 500+ | 2x stake multiplier, artist access, exclusive merch |
| Gold | 250+ | 1.5x multiplier, early mission access |
| Silver | 100+ | Base multiplier, leaderboard eligibility |
| Bronze | 50+ | Basic missions |
| Starter | 0+ | Platform access |

---

## Platform Weights

| Platform | Weight | Rationale |
|----------|--------|-----------|
| MTN Music | 1.3x | Telco-verified, highest trust |
| Boomplay | 1.2x | Africa's largest (75M+ users) |
| Audiomack | 1.1x | Strong Nigeria/diaspora presence |
| WhatsApp | 1.1x | High-trust social proof |
| YouTube | 0.9x | Global but extractive |
| Twitter | 0.8x | Bot-heavy, lower signal |

---

## License

MIT

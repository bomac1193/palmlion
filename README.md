# Palmlion

**The conviction layer for African music.**

---

## Diagnosis

African streaming platforms (Boomplay, Audiomack, MTN Music) have 150M+ users but no infrastructure to identify and score superfans. Artists can't distinguish dedicated fans from casual listeners. Fans can't prove their dedication. The data exists but conviction—measurable, verifiable fan commitment—doesn't surface.

## Guiding Policy

Build the conviction scoring engine on African-native platforms. Weight local infrastructure highest. Verify through telco.

## Strategy

1. **Conviction Scoring** — Quantify fan dedication across Boomplay, Audiomack, MTN Music, WhatsApp, and Telegram. Score = Σ(Action × Platform Weight × Time Decay).

2. **Palmlion Missions** — Distributed challenges via Telegram and WhatsApp that generate verifiable proof-of-fandom: stream targets, social sharing, community engagement.

## Divergence

| Existing Tools | Palmlion |
|----------------|----------|
| Aggregate global streams | Weight African-native platforms highest |
| Anonymous listener counts | Named, verified superfans via telco OTP |
| Passive analytics | Active missions that compound conviction |
| Single global leaderboard | Regional leaderboards (Lagos, Nairobi, Joburg, Accra, Kampala) |

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -e . && cp .env.example .env
uvicorn app.main:app --reload --port 4001
```

### Frontend

```bash
cd frontend
npm install && npm run dev
```

Dashboard at http://localhost:3001

---

## Platform Weights

| Platform | Weight |
|----------|--------|
| MTN Music | 1.3x |
| Boomplay | 1.2x |
| Audiomack | 1.1x |
| WhatsApp | 1.1x |
| YouTube | 0.9x |
| Twitter | 0.8x |

---

## License

MIT

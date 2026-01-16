# Palmlion

**The conviction layer for African music.**

---

## Diagnosis

**Global context:** Streaming pays $0.003–0.005 per play. An artist needs 250,000 streams to earn $1,000. The math only works two ways: go viral or build superfans who buy merch, attend shows, and invest directly. Platforms optimize for passive listening—infinite scroll, algorithmic playlists, lean-back consumption. They surface what's popular, not who cares.

**The gap:** No infrastructure exists to identify, score, or activate superfans. Artists see aggregate stream counts but can't distinguish a fan who played their track once from one who played it 500 times and shared it to 50 people. Fans have no way to prove dedication or get recognized for it. The data exists inside platforms but conviction—measurable, verifiable commitment—never surfaces.

**African context:** Boomplay, Audiomack, and MTN Music have 150M+ combined users across Lagos, Nairobi, Joburg, Accra, Kampala. Same problem, different advantage: telco infrastructure enables phone-verified identity that Western platforms lack. Regional fragmentation means superfans are scattered across platforms with no unified score.

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

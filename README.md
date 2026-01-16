# Palmlion

## African Music Analytics & Conviction Scoring Engine

> **Target:** African superfans, music analytics, conviction scoring
> **Markets:** Lagos, Nairobi, Johannesburg, Accra, Kampala
> **Excludes:** Casual listeners, passive Western APIs that extract African streams

---

## Overview

Palmlion is the **African data fortress** - a conviction scoring engine that verifies superfan dedication via African-first streaming platforms, social proof, and telco verification.

### Mission
African data. African sovereignty. We don't let Western platforms extract African streaming value without giving back.

---

## Core Features

### Conviction Scoring
```
Conviction Score = Σ(Action Weight × Platform Weight × Time Decay)
```

**Platform Weights (African-first):**
- Boomplay: 1.2x (Highest trust)
- MTN Music: 1.3x (Telco verification)
- Audiomack: 1.1x
- WhatsApp: 1.1x
- YouTube: 0.9x
- Twitter: 0.8x (Bot-heavy)

### #PalmDash Missions
Distributed via Telegram and WhatsApp:
- Stream challenges
- Social sharing
- Community engagement
- Referral programs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PALMLION                                │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)          │  Backend (FastAPI)              │
│  ├── Conviction Dashboard    │  ├── /api/v1/auth               │
│  ├── #PalmDash Missions      │  ├── /api/v1/conviction         │
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

## Quick Start

### Backend

```bash
cd palmlion/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .

# Copy environment file
cp .env.example .env
# Edit with your API keys

# Run server
uvicorn app.main:app --reload --port 4001
```

### Frontend

```bash
cd palmlion/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3001 for the dashboard.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/phone` | Register with African phone |
| POST | `/api/v1/auth/verify-otp` | Verify OTP |
| POST | `/api/v1/auth/register/telegram` | Register via Telegram |

### Conviction
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/conviction/score` | User's conviction score |
| GET | `/api/v1/conviction/breakdown` | Score components |
| GET | `/api/v1/conviction/leaderboard` | Regional rankings |

### Missions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/missions` | #PalmDash missions |
| POST | `/api/v1/missions/{id}/submit` | Submit proof |
| GET | `/api/v1/missions/{id}/verify` | Check verification |

### Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/verify/boomplay` | Link Boomplay account |
| POST | `/api/v1/verify/audiomack` | Link Audiomack |
| POST | `/api/v1/verify/streams` | Verify stream count |

### Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/export/conviction/{user_id}` | Export to Convicta |
| POST | `/api/v1/export/conviction/{user_id}/push` | Push to Convicta webhook |
| POST | `/api/v1/export/trigger-mint/{user_id}` | Trigger Issuance mint |

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

## African APIs

### Streaming
- **Boomplay Partner API** - Africa's largest, 75M+ users
- **Audiomack Creator API** - Strong in Nigeria, diaspora
- **MTN Music+ API** - Telco-verified streams

### Social/Verification
- **Africa's Talking** - SMS OTP across Africa
- **Telegram Bot API** - #PalmDash distribution
- **WhatsApp Business API** - High-trust engagement

### Payments
- **MTN MoMo** - West/Central Africa mobile money
- **OPay** - Nigeria fintech
- **M-Pesa** - Kenya/East Africa

---

## Design System

### Colors (Pan-African Inspired)
| Name | Hex | Meaning |
|------|-----|---------|
| Palm Gold | `#FFD700` | Achievement, royalty |
| Kente Green | `#228B22` | Growth, prosperity |
| Kente Red | `#DC143C` | Passion, energy |
| Midnight | `#0A0A0A` | Foundation |

### Typography
- **Display**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Metrics**: JetBrains Mono

### Animations
- **Roar**: Achievement celebration
- **Palm Grow**: Streak indicator
- **Conviction Pulse**: Active score

---

## Environment Variables

```env
# App
DEBUG=true
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/palmlion

# African Streaming
BOOMPLAY_API_KEY=
AUDIOMACK_API_KEY=
MTN_MUSIC_API_KEY=

# Social
TELEGRAM_BOT_TOKEN=
WHATSAPP_BUSINESS_TOKEN=
AFRICAS_TALKING_API_KEY=

# Payments
MTN_MOMO_API_KEY=
OPAY_API_KEY=

# Integration
CONVICTA_API_URL=http://localhost:8000
CONVICTA_WEBHOOK_SECRET=
```

---

## Roadmap

### Week 1
- [x] Backend with conviction scoring
- [x] Frontend dashboard
- [ ] Telegram bot for #PalmDash

### Month 1
- [ ] 100 Lagos elites onboarded
- [ ] Boomplay OAuth integration
- [ ] WhatsApp verification

### Month 2-3
- [ ] Kenya/SA expansion
- [ ] 1K active users
- [ ] Proprietary African chart

---

## License

MIT

---

## Links

- **Convicta**: Global elite superfan metrics
- **Issuance**: Fractional IP minting
- **API Docs**: http://localhost:4001/docs

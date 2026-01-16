"""
Palmlion API - Main Application
African Music Analytics & Conviction Scoring Engine

Target: African superfans, music analytics, conviction scoring
Markets: Lagos, Nairobi, Johannesburg, Accra, Kampala
Excludes: Casual listeners, passive Western APIs that extract African data
"""
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🦁 PALMLION - African Music Analytics Engine 🦁           ║
║                                                               ║
║     API:     http://localhost:4001                            ║
║     Docs:    http://localhost:4001/docs                       ║
║     Health:  http://localhost:4001/health                     ║
║                                                               ║
║     Markets: Lagos | Nairobi | Joburg | Accra | Kampala       ║
║                                                               ║
║     African data. African sovereignty.                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    yield
    print("[Palmlion] Shutting down...")


app = FastAPI(
    title="Palmlion API",
    description="""
## Palmlion - African Music Analytics & Conviction Scoring Engine

### Target Audience
- African superfans
- Music analytics platforms
- Labels/artists seeking African market data

### Markets
Lagos, Nairobi, Johannesburg, Accra, Kampala

### Core Features
- **Conviction Scoring**: Measure fan dedication via African platforms
- **Streaming Verification**: Boomplay, Audiomack, MTN Music
- **Social Proof**: Telegram, WhatsApp, Twitter verification
- **Impact Power**: Export to Convicta for elite superfan metrics

### Integrations
- Convicta: Export conviction data
- Issuance: Trigger fractional IP stakes
- #PalmDash: Telegram/WhatsApp missions
    """,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all API requests"""
    start_time = datetime.utcnow()
    response = await call_next(request)
    duration = (datetime.utcnow() - start_time).total_seconds()

    if request.url.path != "/health":
        print(f"[{request.method}] {request.url.path} - {response.status_code} ({duration:.3f}s)")

    return response


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "palmlion",
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - platform info"""
    return {
        "app": "Palmlion",
        "tagline": "African Music Analytics & Conviction Scoring Engine",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1",
    }


# Include API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    print(f"[Error] {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=4001, reload=settings.DEBUG)

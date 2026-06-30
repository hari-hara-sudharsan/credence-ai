from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.wallet import router as wallet_router
from app.api.credit import router as credit_router
from app.api.analysis import router as analysis_router
from app.api.lending import router as lending_router
from app.api.publish import (
    router as publish_router
)
from app.api.oracle import (
    router as oracle_router
)
from app.api.insights import (
    router as insights_router
)
from app.api.report import (
    router as report_router
)
from app.api.history import (
    router as history_router
)
from app.api.compare import (
    router as compare_router
)
from app.api.passport_nft import (
    router as passport_nft_router
)
from app.api.simulator import (
    router as simulator_router
)
from app.api.oracle_public import (
    router as oracle_public_router
)
from app.api.badges import (
    router as badges_router
)
from app.api.segments import (
    router as segments_router
)
from app.api.leaderboard import (
    router as leaderboard_router
)
from app.api.protocol_models import (
    router as protocol_models_router
)
from app.api.marketplace import (
    router as marketplace_router
)

app = FastAPI(
    title="Credence AI",
    version="1.0.0",
    redirect_slashes=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wallet_router)
app.include_router(credit_router)
app.include_router(
    analysis_router
)
app.include_router(
    lending_router
)
app.include_router(
    publish_router
)
app.include_router(
    oracle_router
)
app.include_router(
    insights_router
)
app.include_router(
    report_router
)
app.include_router(
    history_router
)
app.include_router(
    compare_router
)
app.include_router(
    passport_nft_router
)
app.include_router(
    simulator_router
)
app.include_router(
    oracle_public_router
)
app.include_router(
    badges_router
)
app.include_router(
    segments_router
)
app.include_router(
    leaderboard_router
)
app.include_router(
    protocol_models_router
)
app.include_router(
    marketplace_router
)
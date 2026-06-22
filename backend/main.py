from fastapi import FastAPI
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

app = FastAPI(
    title="Credence AI",
    version="1.0.0"
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
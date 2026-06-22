from fastapi import FastAPI
from app.api.wallet import router as wallet_router
from app.api.credit import router as credit_router

app = FastAPI(
    title="Credence AI",
    version="1.0.0"
)

app.include_router(wallet_router)
app.include_router(credit_router)
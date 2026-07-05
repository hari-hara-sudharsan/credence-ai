from fastapi import APIRouter

from app.schemas.wallet_schema import (
    WalletRequest
)

from app.services.oracle_engine import (
    OracleEngine
)

router = APIRouter(
    prefix="/oracle",
    tags=["Oracle"]
)


@router.post("/refresh")
def refresh_wallet(
    request: WalletRequest
):

    oracle = OracleEngine()

    return oracle.refresh_wallet(
        request.wallet
    )
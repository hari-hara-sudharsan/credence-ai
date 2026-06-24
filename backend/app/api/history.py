from fastapi import APIRouter

from app.services.history_service import (
    HistoryService
)

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/{wallet}")
def wallet_history(
    wallet: str
):

    return HistoryService.get_history(
        wallet
    )
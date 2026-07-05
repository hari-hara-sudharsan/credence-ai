from fastapi import APIRouter
from app.schemas.wallet_schema import WalletRequest
from app.services.wallet_analyzer import WalletAnalyzer

router = APIRouter(
    prefix="/wallet",
    tags=["Wallet"]
)

@router.post("/analyze")
def analyze_wallet(request: WalletRequest):

    analyzer = WalletAnalyzer()

    return analyzer.analyze(
        request.wallet
    )
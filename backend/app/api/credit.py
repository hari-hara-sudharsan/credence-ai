from fastapi import APIRouter

from app.schemas.wallet_schema import WalletRequest

from app.services.wallet_analyzer import WalletAnalyzer

from app.services.credit_engine import CreditEngine

router = APIRouter(
    prefix="/credit",
    tags=["Credit"]
)


@router.post("/score")
def score_wallet(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    engine = CreditEngine()

    wallet_data = analyzer.analyze(
        request.wallet
    )

    return engine.calculate(
        wallet_data
    ) 
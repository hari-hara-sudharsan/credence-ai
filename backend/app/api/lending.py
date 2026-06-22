from fastapi import APIRouter

from app.schemas.wallet_schema import WalletRequest

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
# pyrefly: ignore [missing-import]
from app.services.lending_engine import LendingEngine

router = APIRouter(
    prefix="/lending",
    tags=["Lending"]
)


@router.post("/decision")
def lending_decision(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    credit_engine = CreditEngine()

    lending_engine = LendingEngine()

    features = analyzer.analyze(
        request.wallet
    )

    profile = credit_engine.calculate(
        features
    )

    return lending_engine.evaluate(
        profile,
        features
    )
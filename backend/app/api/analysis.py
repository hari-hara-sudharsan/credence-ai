from fastapi import APIRouter

from app.schemas.wallet_schema import WalletRequest

from app.services.wallet_analyzer import WalletAnalyzer

from app.services.credit_engine import CreditEngine

from app.services.credit_analyst import CreditAnalyst

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post("")
def analyze_wallet(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    credit_engine = CreditEngine()

    credit_analyst = CreditAnalyst()

    features = analyzer.analyze(
        request.wallet
    )

    profile = credit_engine.calculate(
        features
    )

    return credit_analyst.analyze(
        features,
        profile
    )
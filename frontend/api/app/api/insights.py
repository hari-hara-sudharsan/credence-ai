from fastapi import APIRouter

from app.schemas.wallet_schema import (
    WalletRequest
)

from app.services.wallet_analyzer import (
    WalletAnalyzer
)

from app.services.credit_engine import (
    CreditEngine
)

from app.services.ai_credit_analyst import (
    AICreditAnalyst
)

router = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)


@router.post("/")
def insights(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    engine = CreditEngine()

    ai = AICreditAnalyst()

    features = analyzer.analyze(
        request.wallet
    )

    profile = engine.calculate(
        features
    )

    return ai.generate(
        request.wallet,
        features,
        profile
    )
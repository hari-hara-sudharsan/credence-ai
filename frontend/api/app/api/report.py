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

from app.services.llm_credit_report import (
    LLMCreditReport
)

router = APIRouter(
    prefix="/report",
    tags=["Credit Report"]
)


@router.post("")
def generate_report(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    engine = CreditEngine()

    llm = LLMCreditReport()

    features = analyzer.analyze(
        request.wallet
    )

    profile = engine.calculate(
        features
    )

    report = llm.generate(
        request.wallet,
        features,
        profile
    )

    return {
        "wallet":
        request.wallet,

        "credit_score":
        profile.credit_score,

        "rating":
        profile.rating,

        "report":
        report
    }
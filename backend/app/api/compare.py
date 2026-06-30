from fastapi import APIRouter
from pydantic import BaseModel

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine


router = APIRouter(
    prefix="/compare",
    tags=["Compare"]
)


class CompareRequest(BaseModel):

    wallet_a: str

    wallet_b: str


@router.post("")
def compare_wallets(
    request: CompareRequest
):

    analyzer = WalletAnalyzer()

    credit_engine = CreditEngine()

    lending_engine = LendingEngine()

    result = {}

    for label, wallet in {

        "wallet_a":
        request.wallet_a,

        "wallet_b":
        request.wallet_b

    }.items():

        features = analyzer.analyze(
            wallet
        )

        profile = credit_engine.calculate(
            features
        )

        lending = (
            lending_engine.evaluate(
                profile,
                features
            )
        )

        result[label] = {

            "wallet":
            wallet,

            "credit_score":
            profile.credit_score,

            "rating":
            profile.rating,

            "probability_of_default":
            profile.probability_of_default,

            "eligible":
            lending.eligible,

            "interest_rate":
            lending.interest_rate,

            "collateral_ratio":
            lending.collateral_ratio
        }

    return result
from fastapi import APIRouter

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.badge_engine import BadgeEngine
from app.services.segment_engine import SegmentEngine
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(
    prefix="/oracle",
    tags=["Oracle"]
)


@router.get("/score/{wallet}")
def get_credit_score(
    wallet: str
):

    analyzer = WalletAnalyzer()

    features = analyzer.analyze(
        wallet
    )

    credit_engine = CreditEngine()

    profile = credit_engine.calculate(
        features
    )

    lending_engine = LendingEngine()

    lending = lending_engine.evaluate(
        profile,
        features
    )

    segment = SegmentEngine.classify(features)
    badges = BadgeEngine.generate(features)

    LeaderboardService.update(
        wallet,
        profile.credit_score,
        segment,
        badges
    )

    return {
        "wallet": wallet,
        "credit_score":
            profile.credit_score,
        "rating":
            profile.rating,
        "collateral_ratio":
            lending.collateral_ratio,
        "interest_rate":
            lending.interest_rate
    }

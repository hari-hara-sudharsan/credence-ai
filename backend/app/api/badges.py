from fastapi import APIRouter
from pydantic import BaseModel

from app.services.wallet_analyzer import (
    WalletAnalyzer
)

from app.services.badge_engine import (
    BadgeEngine
)

from app.services.segment_engine import (
    SegmentEngine
)

router = APIRouter(
    prefix="/badges",
    tags=["Badges"]
)

class BadgeRequest(
    BaseModel
):
    wallet: str


@router.post("/")
def get_badges(
    request: BadgeRequest
):

    analyzer = WalletAnalyzer()

    features = analyzer.analyze(
        request.wallet
    )

    segment = SegmentEngine.classify(
        features
    )

    badges = BadgeEngine.generate(
        features
    )

    return {
        "wallet":
        request.wallet,

        "segment":
        segment,

        "badges":
        badges
    }

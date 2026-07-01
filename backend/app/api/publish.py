from fastapi import APIRouter

from app.schemas.wallet_schema import WalletRequest

from app.services.wallet_analyzer import WalletAnalyzer

from app.services.credit_engine import CreditEngine

from app.services.blockchain_publisher import (
    BlockchainPublisher
)

router = APIRouter(
    prefix="/publish",
    tags=["Publish"]
)


@router.post("/")
def publish_score(
    request: WalletRequest
):

    analyzer = WalletAnalyzer()

    credit_engine = CreditEngine()

    publisher = BlockchainPublisher()

    features = analyzer.analyze(
        request.wallet
    )

    profile = credit_engine.calculate(
        features
    )

    tx_hash = publisher.publish_score(
        request.wallet,
        profile.credit_score,
        profile.rating,
        profile.confidence
    )

    return {
        "wallet": request.wallet,
        "score": profile.credit_score,
        "tx_hash": tx_hash
    }
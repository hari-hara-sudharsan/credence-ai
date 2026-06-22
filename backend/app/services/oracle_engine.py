from app.services.wallet_analyzer import (
    WalletAnalyzer
)

from app.services.credit_engine import (
    CreditEngine
)

from app.services.blockchain_publisher import (
    BlockchainPublisher
)


class OracleEngine:

    def refresh_wallet(
        self,
        wallet: str
    ):

        analyzer = WalletAnalyzer()

        credit_engine = CreditEngine()

        publisher = BlockchainPublisher()

        features = analyzer.analyze(
            wallet
        )

        profile = credit_engine.calculate(
            features
        )

        tx_hash = publisher.publish_score(
            wallet,
            profile.credit_score,
            profile.rating,
            profile.confidence
        )

        return {

            "wallet":
            wallet,

            "credit_score":
            profile.credit_score,

            "rating":
            profile.rating,

            "tx_hash":
            tx_hash
        }
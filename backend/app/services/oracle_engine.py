from app.services.wallet_analyzer import (
    WalletAnalyzer
)

from app.services.credit_engine import (
    CreditEngine
)

from app.services.blockchain_publisher import (
    BlockchainPublisher
)

from app.services.history_service import (
    HistoryService
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

        HistoryService.add_record(
            wallet,
            profile.credit_score,
            profile.rating
        )

        from app.services.leaderboard_service import LeaderboardService
        LeaderboardService.update_for_wallet(wallet)


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
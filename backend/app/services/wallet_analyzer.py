from app.models.wallet_metrics import WalletMetrics
from app.services.wallet_collector import WalletCollector
from app.services.feature_extractor import FeatureExtractor

class WalletAnalyzer:

    def analyze(self, wallet: str):

        collector = WalletCollector()

        raw_data = collector.collect(wallet)

        extractor = FeatureExtractor()

        # Extract features/scores from raw data
        age_score = extractor.wallet_age_score(721)
        tx_score = extractor.tx_activity_score(raw_data.tx_count)

        return WalletMetrics(
            wallet_age_days=721,
            transaction_count=raw_data.tx_count,
            stablecoin_ratio=0.64,
            governance_votes=12,
            staking_score=85,
            defi_protocols_used=7,
            liquidation_events=0
        )
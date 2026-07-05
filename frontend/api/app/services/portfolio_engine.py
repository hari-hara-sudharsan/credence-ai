from web3 import Web3
from app.services.verification_network import VerificationNetwork

class PortfolioEngine:
    def __init__(self):
        pass

    def analyze_wallet_group(self, wallets: list) -> dict:
        """
        Consolidates credit segments, score summaries, and counts.
        """
        vn = VerificationNetwork()
        scores = []
        trusts = []
        
        healthy_count = 0
        watchlist_count = 0
        high_risk_count = 0

        segments = {
            "PRIME": 0,
            "TRUSTED": 0,
            "STANDARD": 0,
            "WATCHLIST": 0,
            "HIGH_RISK": 0
        }

        for w in wallets:
            checksum_w = Web3.to_checksum_address(w)
            val = vn.get_verification_by_wallet(checksum_w)
            if not val:
                val = vn.verify_wallet(checksum_w)

            score = val["credit_score"]
            trust = val["trust_score"]
            risk = val["risk_level"]

            scores.append(score)
            trusts.append(trust)

            # Segment allocation
            if score >= 750:
                segments["PRIME"] += 1
                healthy_count += 1
            elif score >= 650:
                segments["TRUSTED"] += 1
                healthy_count += 1
            elif score >= 550:
                segments["STANDARD"] += 1
                healthy_count += 1
            elif score >= 450:
                segments["WATCHLIST"] += 1
                watchlist_count += 1
            else:
                segments["HIGH_RISK"] += 1
                high_risk_count += 1

        avg_score = int(sum(scores) / len(scores)) if scores else 600

        return {
            "wallet_count": len(wallets),
            "healthy_wallets": healthy_count,
            "watchlist_wallets": watchlist_count,
            "high_risk_wallets": high_risk_count,
            "portfolio_score": avg_score,
            "risk_distribution": segments
        }

    def calculate_portfolio_health(self, wallets: list) -> int:
        res = self.analyze_wallet_group(wallets)
        return res["portfolio_score"]

    def segment_wallets(self, wallets: list) -> dict:
        res = self.analyze_wallet_group(wallets)
        return res["risk_distribution"]

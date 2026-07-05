from app.services.marketplace_engine import MarketplaceEngine

class DiscoveryEngine:
    def __init__(self):
        self.market = MarketplaceEngine()

    def search_wallets(self, query: str) -> list:
        """
        Searches ranked wallets matching address or badge substring.
        """
        all_profiles = self.market.list_verified_borrowers()
        if not query.strip():
            return all_profiles

        q_lower = query.lower()
        results = []
        for p in all_profiles:
            if q_lower in p["wallet"].lower() or q_lower in p["trust_badge"].lower() or q_lower in p["risk_level"].lower():
                results.append(p)
        return results

    def filter_profiles(self, min_score: int = None, max_score: int = None, risk_level: str = None, badge: str = None) -> list:
        """
        Applies filter filters across borrowers population.
        """
        all_profiles = self.market.list_verified_borrowers()
        results = []

        for p in all_profiles:
            if min_score is not None and p["credit_score"] < min_score:
                continue
            if max_score is not None and p["credit_score"] > max_score:
                continue
            if risk_level and p["risk_level"].upper() != risk_level.upper():
                continue
            if badge and p["trust_badge"].upper() != badge.upper():
                continue
            results.append(p)
        return results

    def recommend_matches(self, wallet: str) -> list:
        # Recommends topmost compatible borrowers for a lender wallet (based on top ranks)
        all_profiles = self.market.list_verified_borrowers()
        return all_profiles[:3]

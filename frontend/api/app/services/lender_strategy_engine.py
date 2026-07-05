"""
Lender Strategy Engine — Manages lender risk profiles and allocation strategies.
Persists strategies in lender_strategies.json and provides allocation recommendations.
"""
from typing import Optional
from app.database.persistence import read_json, write_json
from app.services.p2p_lending_engine import P2PLendingEngine

STRATEGIES_DB = "lender_strategies.json"

# Allocation percentages by strategy type → risk tier
STRATEGY_ALLOCATIONS = {
    "SAFE": {
        "PRIME": 80,
        "TRUSTED": 20,
        "STANDARD": 0,
        "WATCHLIST": 0,
        "HIGH_RISK": 0,
    },
    "BALANCED": {
        "PRIME": 50,
        "TRUSTED": 30,
        "STANDARD": 20,
        "WATCHLIST": 0,
        "HIGH_RISK": 0,
    },
    "HIGH_YIELD": {
        "PRIME": 20,
        "TRUSTED": 20,
        "STANDARD": 30,
        "WATCHLIST": 30,
        "HIGH_RISK": 0,
    },
}

# Expected yield ranges by strategy
STRATEGY_YIELDS = {
    "SAFE": {"min": 5.0, "max": 8.0, "target": 6.0},
    "BALANCED": {"min": 7.0, "max": 12.0, "target": 9.0},
    "HIGH_YIELD": {"min": 10.0, "max": 20.0, "target": 14.0},
}


class LenderStrategyEngine:

    def __init__(self):
        self.p2p = P2PLendingEngine()

    def create_strategy(
        self,
        wallet: str,
        capital: float,
        risk_preference: str = "BALANCED",
        duration_days: int = 90,
        target_return: float = 8.0,
    ) -> dict:
        """Create or update a lender's investment strategy."""
        wallet = wallet.lower()

        if risk_preference not in STRATEGY_ALLOCATIONS:
            raise ValueError(f"Invalid risk preference: {risk_preference}")
        if capital <= 0:
            raise ValueError("Capital must be positive")

        allocation = STRATEGY_ALLOCATIONS[risk_preference]
        yields = STRATEGY_YIELDS[risk_preference]

        strategy = {
            "wallet": wallet,
            "capital": capital,
            "risk_preference": risk_preference,
            "duration_days": duration_days,
            "target_return": target_return,
            "allocation": allocation,
            "expected_yield": yields,
            "status": "ACTIVE",
        }

        db = read_json(STRATEGIES_DB, {})
        db[wallet] = strategy
        write_json(STRATEGIES_DB, db)

        return strategy

    def get_strategy(self, wallet: str) -> Optional[dict]:
        """Get a lender's current strategy."""
        db = read_json(STRATEGIES_DB, {})
        return db.get(wallet.lower())

    def recommend_distribution(self, strategy: dict) -> dict:
        """
        Given a strategy, return recommended capital distribution amounts
        across risk tiers based on current open requests.
        """
        capital = strategy["capital"]
        allocation_pct = strategy["allocation"]
        open_requests = self.p2p.get_open_requests()

        # Count open requests per badge tier
        tier_counts = {}
        for req in open_requests:
            badge = req.get("badge", "UNRATED")
            tier_counts[badge] = tier_counts.get(badge, 0) + 1

        # Calculate recommended amounts
        distribution = {}
        for tier, pct in allocation_pct.items():
            amount = capital * (pct / 100)
            available = tier_counts.get(tier, 0)
            distribution[tier] = {
                "target_percentage": pct,
                "target_amount": round(amount, 2),
                "available_requests": available,
                "deployable": amount > 0 and available > 0,
            }

        return distribution

    def rebalance_strategy(self, wallet: str) -> dict:
        """
        Rebalance a strategy based on current portfolio state.
        Returns updated allocation recommendations.
        """
        wallet = wallet.lower()
        strategy = self.get_strategy(wallet)
        if not strategy:
            raise ValueError("No strategy found for this wallet")

        funded = self.p2p.get_lender_funded(wallet)
        remaining_capital = strategy["capital"] - sum(l["amount"] for l in funded)

        distribution = self.recommend_distribution(strategy)

        return {
            "wallet": wallet,
            "original_capital": strategy["capital"],
            "deployed": sum(l["amount"] for l in funded),
            "remaining": max(0, remaining_capital),
            "active_loans": len([l for l in funded if l["status"] == "ACTIVE"]),
            "distribution": distribution,
            "recommendation": self._rebalance_recommendation(remaining_capital, distribution),
        }

    def _rebalance_recommendation(self, remaining: float, distribution: dict) -> str:
        deployable = [t for t, d in distribution.items() if d["deployable"]]
        if remaining <= 0:
            return "Fully deployed. Monitor active loans for repayment before rebalancing."
        if not deployable:
            return "No matching borrowers available. Wait for new loan requests."
        return f"Deploy {remaining:.0f} HSK across {', '.join(deployable)} tier borrowers."

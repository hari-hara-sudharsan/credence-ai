"""
Capital Matching Engine — AI-powered matching between lender strategies
and borrower credit profiles. Recommends, explains, and ranks — never moves funds.
"""
import hashlib
from typing import List, Optional

from app.services.p2p_lending_engine import P2PLendingEngine
from app.services.lender_strategy_engine import LenderStrategyEngine, STRATEGY_ALLOCATIONS


class CapitalMatchingEngine:

    def __init__(self):
        self.p2p = P2PLendingEngine()
        self.strategy_engine = LenderStrategyEngine()

    # ── Core Matching ─────────────────────────────────────────────────

    def match_borrowers(self, lender_wallet: str) -> dict:
        """
        Given a lender's strategy, find and rank the best borrower matches.
        Returns a full CapitalRecommendation.
        """
        lender_wallet = lender_wallet.lower()
        strategy = self.strategy_engine.get_strategy(lender_wallet)

        if not strategy:
            # Default to BALANCED if no strategy set
            strategy = {
                "wallet": lender_wallet,
                "capital": 10000,
                "risk_preference": "BALANCED",
                "duration_days": 90,
                "target_return": 8.0,
                "allocation": STRATEGY_ALLOCATIONS["BALANCED"],
            }

        open_requests = self.p2p.get_open_requests()
        if not open_requests:
            return {
                "lender": lender_wallet,
                "strategy": strategy["risk_preference"],
                "total_capital": strategy["capital"],
                "recommended": [],
                "allocation": strategy["allocation"],
                "summary": "No open loan requests available. Check back when borrowers create new requests.",
            }

        # Score each request against lender's strategy
        scored = []
        for req in open_requests:
            match = self._score_match(req, strategy)
            if match["match_score"] > 0:
                scored.append(match)

        # Sort by match score descending
        scored.sort(key=lambda x: x["match_score"], reverse=True)

        # Calculate allocation
        distribution = self.strategy_engine.recommend_distribution(strategy)

        summary = self._generate_summary(scored, strategy)

        return {
            "lender": lender_wallet,
            "strategy": strategy["risk_preference"],
            "total_capital": strategy["capital"],
            "recommended": scored,
            "allocation": distribution,
            "summary": summary,
        }

    def match_lenders(self, borrower_wallet: str) -> List[dict]:
        """Find lender strategies that would match this borrower."""
        borrower_wallet = borrower_wallet.lower()
        requests = self.p2p.get_borrower_requests(borrower_wallet)
        open_reqs = [r for r in requests if r["status"] == "REQUESTED"]

        if not open_reqs:
            return []

        # Check all lender strategies
        from app.database.persistence import read_json
        strategies = read_json("lender_strategies.json", {})

        matches = []
        for lender_wallet, strategy in strategies.items():
            for req in open_reqs:
                score = self._score_match(req, strategy)
                if score["match_score"] >= 30:
                    matches.append({
                        "lender": lender_wallet,
                        "strategy": strategy["risk_preference"],
                        "capital": strategy["capital"],
                        "match": score,
                    })

        matches.sort(key=lambda x: x["match"]["match_score"], reverse=True)
        return matches

    def rank_opportunities(self, strategy: dict) -> List[dict]:
        """Rank all open requests against a given strategy."""
        open_requests = self.p2p.get_open_requests()
        scored = []
        for req in open_requests:
            match = self._score_match(req, strategy)
            scored.append(match)

        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored

    def explain_match(self, request_id: str, lender_wallet: str) -> dict:
        """Generate a detailed AI explanation for a specific match."""
        lender_wallet = lender_wallet.lower()
        strategy = self.strategy_engine.get_strategy(lender_wallet)
        req = self.p2p.get_request(request_id)

        if not req:
            raise ValueError(f"Request {request_id} not found")

        if not strategy:
            strategy = {
                "risk_preference": "BALANCED",
                "target_return": 8.0,
                "duration_days": 90,
                "allocation": STRATEGY_ALLOCATIONS["BALANCED"],
            }

        match = self._score_match(req, strategy)
        factors = self._build_factors(req, strategy)

        match_id = hashlib.md5(f"{request_id}:{lender_wallet}".encode()).hexdigest()[:12]

        return {
            "match_id": match_id,
            "borrower": req["borrower"],
            "request_id": request_id,
            "overall_score": match["match_score"],
            "confidence": match["ai_confidence"],
            "factors": factors,
            "recommendation": match["explanation"],
        }

    # ── Internal Scoring ──────────────────────────────────────────────

    def _score_match(self, request: dict, strategy: dict) -> dict:
        """
        Score a borrower request against a lender strategy.

        Match Score = Credit Compatibility (30%)
                    + Risk Alignment (25%)
                    + Yield Match (20%)
                    + Trust Strength (25%)
        """
        credit_score = request.get("credit_score", 0)
        risk_level = request.get("risk_level", "UNKNOWN")
        badge = request.get("badge", "UNRATED")
        interest = request.get("interest_rate", 10)
        ai_conf = request.get("ai_confidence", 50)
        risk_pref = strategy.get("risk_preference", "BALANCED")
        target_return = strategy.get("target_return", 8.0)
        allocation = strategy.get("allocation", STRATEGY_ALLOCATIONS["BALANCED"])

        # 1. Credit Compatibility (30%) — how good is the borrower's credit
        credit_norm = min(100, (credit_score / 850) * 100)
        credit_component = credit_norm * 0.30

        # 2. Risk Alignment (25%) — does borrower risk match lender preference
        risk_alignment = self._calculate_risk_alignment(risk_level, badge, risk_pref, allocation)
        risk_component = risk_alignment * 0.25

        # 3. Yield Match (20%) — does interest rate meet lender's target
        yield_diff = interest - target_return
        if yield_diff >= 0:
            yield_score = min(100, 60 + yield_diff * 8)  # above target is good
        else:
            yield_score = max(0, 60 + yield_diff * 15)  # below target penalized
        yield_component = yield_score * 0.20

        # 4. Trust Strength (25%) — AI confidence + passport status
        trust_score = ai_conf
        trust_component = trust_score * 0.25

        total = credit_component + risk_component + yield_component + trust_component
        match_score = int(min(100, max(0, total)))

        # Generate explanation
        explanation = self._generate_explanation(
            credit_score, risk_level, badge, interest, match_score, risk_pref
        )

        expected_return = request["amount"] * (interest / 100)

        return {
            "borrower": request["borrower"],
            "request_id": request["request_id"],
            "credit_score": credit_score,
            "risk": risk_level,
            "badge": badge,
            "amount": request["amount"],
            "interest_rate": interest,
            "expected_return": round(expected_return, 2),
            "match_score": match_score,
            "ai_confidence": round(ai_conf, 1),
            "explanation": explanation,
            "match_factors": {
                "credit_compatibility": round(credit_component / 0.30, 1),
                "risk_alignment": round(risk_alignment, 1),
                "yield_match": round(yield_score, 1),
                "trust_strength": round(trust_score, 1),
            },
        }

    def _calculate_risk_alignment(
        self, risk_level: str, badge: str, risk_pref: str, allocation: dict
    ) -> float:
        """How well does borrower risk align with lender preference."""
        # If this badge tier has allocation > 0, it's aligned
        tier_alloc = allocation.get(badge, 0)

        if tier_alloc >= 50:
            base = 95  # Primary target tier
        elif tier_alloc >= 20:
            base = 75  # Secondary tier
        elif tier_alloc > 0:
            base = 55  # Minor allocation
        else:
            # No allocation for this tier — penalize based on strategy
            if risk_pref == "SAFE":
                # SAFE lender seeing HIGH_RISK = very bad
                penalty_map = {"LOW": 40, "MEDIUM": 25, "HIGH": 10, "CRITICAL": 0}
                base = penalty_map.get(risk_level, 10)
            elif risk_pref == "HIGH_YIELD":
                # HIGH_YIELD lender seeing PRIME = okay but less interesting
                base = 45
            else:
                base = 35

        return base

    def _generate_explanation(
        self, score: int, risk: str, badge: str, interest: float, match: int, pref: str
    ) -> str:
        """Generate human-readable match explanation."""
        parts = []

        if score >= 700:
            parts.append("Excellent credit profile with strong on-chain history")
        elif score >= 500:
            parts.append("Solid credit fundamentals with moderate transaction history")
        elif score >= 300:
            parts.append("Developing credit profile with limited but growing activity")
        else:
            parts.append("Early-stage wallet with minimal credit history")

        if badge == "PRIME" and pref == "SAFE":
            parts.append("matches your conservative risk preference perfectly")
        elif badge == "STANDARD" and pref == "HIGH_YIELD":
            parts.append("aligns with your high-yield strategy for enhanced returns")
        elif risk == "LOW":
            parts.append("with low default probability")
        elif risk == "MEDIUM":
            parts.append("with moderate risk balanced by competitive interest")
        else:
            parts.append("with elevated risk compensated by higher yield")

        return ". ".join(parts) + "."

    def _build_factors(self, request: dict, strategy: dict) -> List[dict]:
        """Build detailed factor list for match explanation."""
        factors = []
        score = request.get("credit_score", 0)
        risk = request.get("risk_level", "UNKNOWN")

        # Wallet history
        if score >= 400:
            factors.append({
                "factor": "Wallet History",
                "status": "positive",
                "detail": f"Credit score of {score} indicates established on-chain presence",
            })
        else:
            factors.append({
                "factor": "Wallet History",
                "status": "neutral",
                "detail": f"Credit score of {score} shows early-stage wallet",
            })

        # Risk assessment
        if risk in ("LOW", "MEDIUM"):
            factors.append({
                "factor": "Risk Assessment",
                "status": "positive",
                "detail": f"{risk} risk level within acceptable parameters",
            })
        else:
            factors.append({
                "factor": "Risk Assessment",
                "status": "warning",
                "detail": f"{risk} risk — enhanced monitoring recommended",
            })

        # Yield analysis
        interest = request.get("interest_rate", 0)
        target = strategy.get("target_return", 8)
        if interest >= target:
            factors.append({
                "factor": "Expected Yield",
                "status": "positive",
                "detail": f"{interest}% exceeds your target of {target}%",
            })
        else:
            factors.append({
                "factor": "Expected Yield",
                "status": "neutral",
                "detail": f"{interest}% below your {target}% target return",
            })

        # AI confidence
        conf = request.get("ai_confidence", 50)
        factors.append({
            "factor": "AI Confidence",
            "status": "positive" if conf >= 60 else "neutral" if conf >= 35 else "warning",
            "detail": f"{conf:.0f}% confidence in successful repayment",
        })

        return factors

    def _generate_summary(self, scored: List[dict], strategy: dict) -> str:
        if not scored:
            return "No borrowers match your current strategy parameters."

        top = scored[0]
        count = len(scored)
        high_quality = sum(1 for s in scored if s["match_score"] >= 70)

        return (
            f"Found {count} matching {'opportunity' if count == 1 else 'opportunities'}. "
            f"{high_quality} {'is' if high_quality == 1 else 'are'} strong matches for your "
            f"{strategy.get('risk_preference', 'BALANCED')} strategy. "
            f"Top match: {top['badge']} borrower at {top['interest_rate']}% interest "
            f"with {top['match_score']}/100 compatibility."
        )

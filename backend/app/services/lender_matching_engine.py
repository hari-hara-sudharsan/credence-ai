"""
Lender Matching Engine — AI-powered ranking of borrower opportunities.
Ranks open loan requests by weighted match score to help lenders discover
the best opportunities.
"""
from typing import List, Optional
from app.services.p2p_lending_engine import P2PLendingEngine


class LenderMatchingEngine:

    def __init__(self):
        self.p2p = P2PLendingEngine()

    def rank_opportunities(
        self,
        min_score: Optional[int] = None,
        max_risk: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
    ) -> List[dict]:
        """
        Rank all open loan requests by match score.
        Returns sorted list (best opportunities first) with match metadata.
        """
        requests = self.p2p.get_open_requests()

        # Apply filters
        filtered = self._apply_filters(requests, min_score, max_risk, min_amount, max_amount)

        # Score and rank
        scored = []
        for req in filtered:
            match_score = self.calculate_match_score(req)
            recommendation = self._generate_recommendation(req, match_score)

            scored.append({
                "request": req,
                "match_score": round(match_score, 1),
                "recommendation": recommendation,
            })

        # Sort by match score descending (best first)
        scored.sort(key=lambda x: x["match_score"], reverse=True)

        return scored

    def calculate_match_score(self, request: dict) -> float:
        """
        Weighted scoring algorithm:
          - Credit Score:        40%
          - Risk Level:          25%
          - AI Confidence:       20%
          - Expected Return:     15%
        """
        score = 0.0

        # 1. Credit score component (0-100, normalized from 0-850)
        credit = request.get("credit_score", 0)
        credit_norm = min(100, (credit / 850) * 100)
        score += credit_norm * 0.40

        # 2. Risk level component (0-100)
        risk_map = {"LOW": 100, "MEDIUM": 65, "HIGH": 30, "CRITICAL": 5, "UNKNOWN": 20}
        risk_score = risk_map.get(request.get("risk_level", "UNKNOWN"), 20)
        score += risk_score * 0.25

        # 3. AI confidence component (already 0-100)
        ai_conf = request.get("ai_confidence", 50)
        score += ai_conf * 0.20

        # 4. Expected return (interest rate, higher = better for lender, capped at 20%)
        interest = request.get("interest_rate", 5)
        return_norm = min(100, (interest / 20) * 100)
        score += return_norm * 0.15

        return score

    def find_borrowers(
        self,
        min_score: Optional[int] = None,
        max_risk: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
    ) -> List[dict]:
        """Search open requests with filters (without ranking)."""
        requests = self.p2p.get_open_requests()
        return self._apply_filters(requests, min_score, max_risk, min_amount, max_amount)

    def _apply_filters(
        self,
        requests: List[dict],
        min_score: Optional[int],
        max_risk: Optional[str],
        min_amount: Optional[float],
        max_amount: Optional[float],
    ) -> List[dict]:
        risk_order = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}

        filtered = requests
        if min_score is not None:
            filtered = [r for r in filtered if r.get("credit_score", 0) >= min_score]
        if max_risk is not None:
            max_rank = risk_order.get(max_risk, 3)
            filtered = [r for r in filtered if risk_order.get(r.get("risk_level", "CRITICAL"), 3) <= max_rank]
        if min_amount is not None:
            filtered = [r for r in filtered if r.get("amount", 0) >= min_amount]
        if max_amount is not None:
            filtered = [r for r in filtered if r.get("amount", 0) <= max_amount]

        return filtered

    def _generate_recommendation(self, request: dict, match_score: float) -> str:
        """Generate human-readable AI recommendation."""
        if match_score >= 80:
            return "Strong Opportunity — High credit quality with excellent repayment probability."
        elif match_score >= 60:
            return "Good Opportunity — Solid fundamentals with moderate risk-reward profile."
        elif match_score >= 40:
            return "Moderate Risk — Consider position sizing. Higher return compensates for elevated risk."
        else:
            return "High Risk — Exercise caution. Enhanced due diligence recommended before funding."

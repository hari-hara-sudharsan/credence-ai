"""
P2P Lending Engine — Core service for peer-to-peer loan lifecycle.
Stores loan requests in p2p_loans.json and manages status transitions.
"""
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from app.database.persistence import read_json, write_json
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.services.credit_analyst import CreditAnalyst

P2P_DB = "p2p_loans.json"


class P2PLendingEngine:

    def __init__(self):
        self.analyzer = WalletAnalyzer()
        self.engine = CreditEngine()
        self.analyst = CreditAnalyst()

    # ── Borrower: Create Request ──────────────────────────────────────

    def create_request(
        self,
        wallet: str,
        amount: float,
        duration_days: int,
        purpose: str,
        interest_rate: Optional[float] = None,
    ) -> dict:
        """
        Create a new P2P loan request.
        Validates: credit score exists, risk calculated, no active defaults.
        """
        wallet = wallet.lower()

        # 1. Fetch real credit data via WalletAnalyzer → CreditEngine → CreditAnalyst
        try:
            features = self.analyzer.analyze(wallet)
            profile = self.engine.calculate(features)
            analysis = self.analyst.analyze(features, profile)
            credit_score = analysis.credit_score
            risk_level = self._score_to_risk(credit_score)
            badge = self._score_to_badge(credit_score)
        except Exception:
            credit_score = 0
            risk_level = "UNKNOWN"
            badge = "UNRATED"

        if credit_score <= 0:
            raise ValueError("Credit score not available. Complete wallet verification first.")

        # 2. Check for active defaults
        db = read_json(P2P_DB, {})
        for req in db.values():
            if req.get("borrower") == wallet and req.get("status") == "DEFAULTED":
                raise ValueError("Cannot create request: wallet has an active default.")

        # 3. Auto-calculate interest if not provided
        if interest_rate is None:
            interest_rate = self._calculate_interest(credit_score, risk_level)

        # 4. AI confidence — how likely the borrower is to repay
        ai_confidence = self._calculate_ai_confidence(credit_score, risk_level)

        # 5. Create the request
        request_id = f"p2p_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc).isoformat()

        request = {
            "request_id": request_id,
            "borrower": wallet,
            "amount": amount,
            "interest_rate": round(interest_rate, 2),
            "duration_days": duration_days,
            "purpose": purpose,
            "credit_score": credit_score,
            "risk_level": risk_level,
            "badge": badge,
            "ai_confidence": round(ai_confidence, 1),
            "status": "REQUESTED",
            "created_at": now,
            "lender": None,
            "funded_at": None,
            "due_date": None,
        }

        db[request_id] = request
        write_json(P2P_DB, db)

        return request

    # ── Lender: Fund Loan ─────────────────────────────────────────────

    def fund_loan(self, request_id: str, lender_wallet: str) -> dict:
        """Mark a loan request as FUNDED by a lender."""
        lender_wallet = lender_wallet.lower()
        db = read_json(P2P_DB, {})

        req = db.get(request_id)
        if not req:
            raise ValueError(f"Request {request_id} not found")
        if req["status"] != "REQUESTED":
            raise ValueError(f"Request is not open (status: {req['status']})")
        if req["borrower"] == lender_wallet:
            raise ValueError("Cannot fund your own request")

        req["lender"] = lender_wallet
        req["status"] = "FUNDED"
        req["funded_at"] = datetime.now(timezone.utc).isoformat()

        # Auto-activate: set due date
        req["status"] = "ACTIVE"
        due = datetime.now(timezone.utc) + timedelta(days=req["duration_days"])
        req["due_date"] = due.isoformat()

        db[request_id] = req
        write_json(P2P_DB, db)

        return req

    # ── Borrower: Repay ───────────────────────────────────────────────

    def repay_loan(self, request_id: str, borrower_wallet: str) -> dict:
        """Mark an active loan as REPAID."""
        borrower_wallet = borrower_wallet.lower()
        db = read_json(P2P_DB, {})

        req = db.get(request_id)
        if not req:
            raise ValueError(f"Request {request_id} not found")
        if req["status"] != "ACTIVE":
            raise ValueError(f"Loan is not active (status: {req['status']})")
        if req["borrower"] != borrower_wallet:
            raise ValueError("Only the borrower can repay")

        req["status"] = "REPAID"
        req["repaid_at"] = datetime.now(timezone.utc).isoformat()

        db[request_id] = req
        write_json(P2P_DB, db)

        return req

    # ── Queries ───────────────────────────────────────────────────────

    def get_open_requests(self) -> List[dict]:
        """All loan requests with REQUESTED status (marketplace feed)."""
        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r["status"] == "REQUESTED"]

    def get_all_requests(self) -> List[dict]:
        """All loan requests regardless of status."""
        db = read_json(P2P_DB, {})
        return list(db.values())

    def get_request(self, request_id: str) -> Optional[dict]:
        db = read_json(P2P_DB, {})
        return db.get(request_id)

    def get_borrower_requests(self, wallet: str) -> List[dict]:
        wallet = wallet.lower()
        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r["borrower"] == wallet]

    def get_lender_funded(self, wallet: str) -> List[dict]:
        wallet = wallet.lower()
        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r.get("lender") == wallet]

    # ── Internal Helpers ──────────────────────────────────────────────

    def _calculate_interest(self, score: int, risk: str) -> float:
        """Auto-calculate interest rate based on credit score and risk."""
        if score >= 750:
            base = 5.0
        elif score >= 600:
            base = 8.0
        elif score >= 400:
            base = 12.0
        else:
            base = 18.0

        risk_premium = {"LOW": 0, "MEDIUM": 1.5, "HIGH": 3.0, "CRITICAL": 5.0}
        return base + risk_premium.get(risk, 2.0)

    def _calculate_ai_confidence(self, score: int, risk: str) -> float:
        """AI confidence that borrower will repay (0-100)."""
        base = min(100, max(20, score / 8.5))
        risk_penalty = {"LOW": 0, "MEDIUM": 8, "HIGH": 18, "CRITICAL": 30}
        return max(10, base - risk_penalty.get(risk, 10))

    def _score_to_risk(self, score: int) -> str:
        if score >= 700:
            return "LOW"
        elif score >= 500:
            return "MEDIUM"
        elif score >= 300:
            return "HIGH"
        return "CRITICAL"

    def _score_to_badge(self, score: int) -> str:
        if score >= 750:
            return "PRIME"
        elif score >= 600:
            return "TRUSTED"
        elif score >= 400:
            return "STANDARD"
        elif score >= 200:
            return "WATCHLIST"
        return "HIGH_RISK"

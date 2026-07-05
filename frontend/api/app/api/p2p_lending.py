"""
P2P Lending API — Peer-to-peer loan marketplace endpoints.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.p2p_lending_engine import P2PLendingEngine
from app.services.lender_matching_engine import LenderMatchingEngine
from app.schemas.p2p_lending import (
    LoanRequestCreate,
    FundLoanRequest,
    RepayLoanRequest,
)

router = APIRouter(
    prefix="/p2p",
    tags=["P2P Lending Marketplace"]
)

# ── Borrower Endpoints ────────────────────────────────────────────────

@router.post("/request")
def create_loan_request(body: LoanRequestCreate):
    """Borrower creates a new loan request in the marketplace."""
    try:
        engine = P2PLendingEngine()
        result = engine.create_request(
            wallet=body.wallet,
            amount=body.amount,
            duration_days=body.duration_days,
            purpose=body.purpose,
            interest_rate=body.interest_rate,
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create request: {str(e)}")


@router.get("/borrower/{wallet}")
def get_borrower_requests(wallet: str):
    """Get all loan requests for a borrower."""
    try:
        engine = P2PLendingEngine()
        requests = engine.get_borrower_requests(wallet)
        total = sum(r["amount"] for r in requests)
        active = sum(1 for r in requests if r["status"] in ("ACTIVE", "FUNDED"))

        return {
            "wallet": wallet.lower(),
            "requests": requests,
            "total_requested": total,
            "active_count": active,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Marketplace (Public) ──────────────────────────────────────────────

@router.get("/requests")
def list_open_requests():
    """List all open loan requests in the marketplace."""
    try:
        engine = P2PLendingEngine()
        return engine.get_open_requests()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/opportunities")
def get_ranked_opportunities(
    min_score: Optional[int] = Query(None, description="Minimum credit score"),
    max_risk: Optional[str] = Query(None, description="Maximum risk level: LOW, MEDIUM, HIGH"),
    min_amount: Optional[float] = Query(None, description="Minimum loan amount"),
    max_amount: Optional[float] = Query(None, description="Maximum loan amount"),
):
    """AI-ranked lending opportunities for lenders."""
    try:
        matcher = LenderMatchingEngine()
        return matcher.rank_opportunities(
            min_score=min_score,
            max_risk=max_risk,
            min_amount=min_amount,
            max_amount=max_amount,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/request/{request_id}")
def get_request_detail(request_id: str):
    """Get details of a specific loan request."""
    try:
        engine = P2PLendingEngine()
        req = engine.get_request(request_id)
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")
        return req
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Lender Endpoints ─────────────────────────────────────────────────

@router.post("/fund/{request_id}")
def fund_loan(request_id: str, body: FundLoanRequest):
    """Lender funds an open loan request."""
    try:
        engine = P2PLendingEngine()
        result = engine.fund_loan(request_id, body.lender_wallet)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fund loan: {str(e)}")


@router.get("/lender/{wallet}")
def get_lender_portfolio(wallet: str):
    """Get lender's funded loans portfolio."""
    try:
        engine = P2PLendingEngine()
        funded = engine.get_lender_funded(wallet)
        total_lent = sum(r["amount"] for r in funded)
        total_interest = sum(
            r["amount"] * r["interest_rate"] / 100
            for r in funded if r["status"] == "REPAID"
        )
        active = sum(1 for r in funded if r["status"] == "ACTIVE")

        return {
            "wallet": wallet.lower(),
            "funded_loans": funded,
            "total_lent": total_lent,
            "total_interest_earned": round(total_interest, 4),
            "active_count": active,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Repayment ─────────────────────────────────────────────────────────

@router.post("/repay/{request_id}")
def repay_loan(request_id: str, body: RepayLoanRequest):
    """Borrower repays an active P2P loan."""
    try:
        engine = P2PLendingEngine()
        result = engine.repay_loan(request_id, body.borrower_wallet)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to repay loan: {str(e)}")

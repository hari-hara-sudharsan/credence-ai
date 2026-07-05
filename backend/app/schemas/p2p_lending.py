from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class P2PLoanStatus(str, Enum):
    REQUESTED = "REQUESTED"
    FUNDED = "FUNDED"
    ACTIVE = "ACTIVE"
    REPAID = "REPAID"
    DEFAULTED = "DEFAULTED"


class LoanRequestCreate(BaseModel):
    wallet: str
    amount: float
    duration_days: int
    purpose: str
    interest_rate: Optional[float] = None  # auto-calculated if omitted


class LoanRequestResponse(BaseModel):
    request_id: str
    borrower: str
    amount: float
    interest_rate: float
    duration_days: int
    purpose: str
    credit_score: int
    risk_level: str
    status: P2PLoanStatus
    created_at: str
    lender: Optional[str] = None
    funded_at: Optional[str] = None
    due_date: Optional[str] = None
    ai_confidence: Optional[float] = None
    badge: Optional[str] = None


class FundLoanRequest(BaseModel):
    lender_wallet: str


class RepayLoanRequest(BaseModel):
    borrower_wallet: str


class LenderPortfolio(BaseModel):
    wallet: str
    funded_loans: List[LoanRequestResponse]
    total_lent: float
    total_interest_earned: float
    active_count: int


class BorrowerRequestList(BaseModel):
    wallet: str
    requests: List[LoanRequestResponse]
    total_requested: float
    active_count: int


class MarketplaceOpportunity(BaseModel):
    request: LoanRequestResponse
    match_score: float
    recommendation: str

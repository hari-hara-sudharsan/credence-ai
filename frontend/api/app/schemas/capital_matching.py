from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class RiskPreference(str, Enum):
    SAFE = "SAFE"
    BALANCED = "BALANCED"
    HIGH_YIELD = "HIGH_YIELD"


class LenderStrategy(BaseModel):
    wallet: str
    capital: float
    risk_preference: RiskPreference = RiskPreference.BALANCED
    duration_days: int = 90
    target_return: float = 8.0  # percentage


class BorrowerMatch(BaseModel):
    borrower: str
    request_id: str
    credit_score: int
    risk: str
    badge: str
    amount: float
    interest_rate: float
    expected_return: float
    match_score: int
    ai_confidence: float
    explanation: str
    match_factors: dict


class CapitalRecommendation(BaseModel):
    lender: str
    strategy: str
    total_capital: float
    recommended: List[BorrowerMatch]
    allocation: dict  # risk tier → percentage
    summary: str


class MatchExplanation(BaseModel):
    match_id: str
    borrower: str
    overall_score: int
    confidence: float
    factors: List[dict]
    recommendation: str

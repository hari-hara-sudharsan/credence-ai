from pydantic import BaseModel
from typing import List, Dict, Any

class InstitutionProfile(BaseModel):
    institution_id: str
    name: str
    connected_wallets: int
    total_exposure: float
    average_credit_score: int
    average_trust_score: int
    risk_level: str

class PortfolioAnalysis(BaseModel):
    wallet_count: int
    healthy_wallets: int
    watchlist_wallets: int
    high_risk_wallets: int
    portfolio_score: int
    risk_distribution: Dict[str, int]

class ExposureReport(BaseModel):
    total_exposure: float
    risk_adjusted_exposure: float
    highest_risk_wallets: List[Dict[str, Any]]
    recommended_actions: List[str]

class StressTestRequest(BaseModel):
    scenario: str # "MARKET_CRASH" | "LIQUIDITY_CRUNCH"
    severity: str # "HIGH" | "MEDIUM" | "LOW"

class StressTestResponse(BaseModel):
    current_health: int
    projected_health: int
    affected_wallets: int
    recommended_actions: List[str]
    reason: str = ""

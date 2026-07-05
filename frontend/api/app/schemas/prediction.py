from pydantic import BaseModel
from typing import List

class FinancialSignal(BaseModel):
    signal: str
    impact: str # "POSITIVE" | "NEGATIVE" | "NEUTRAL"
    severity: str # "HIGH" | "MEDIUM" | "LOW"
    description: str

class RiskPrediction(BaseModel):
    wallet: str
    current_score: int
    predicted_score: int
    score_change: int
    current_risk: str
    predicted_risk: str
    default_probability_now: float
    default_probability_future: float
    confidence: float
    forecast_days: int

class CreditForecast(BaseModel):
    wallet: str
    current_score: int
    predicted_score: int
    trajectory: str # "IMPROVING" | "DECLINING" | "STABLE"
    default_probability_now: float
    default_probability_future: float
    confidence: float
    signals: List[FinancialSignal]
    recommendations: List[str]

class SimulationRequest(BaseModel):
    wallet: str
    scenario: str # "REPAY_LOAN" | "TAKE_NEW_LOAN" | "DEFAULT_LOAN"

class SimulationResult(BaseModel):
    current_score: int
    simulated_score: int
    impact: str
    reason: str

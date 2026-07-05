from fastapi import APIRouter, HTTPException
from app.schemas.prediction import CreditForecast, RiskPrediction, FinancialSignal, SimulationRequest, SimulationResult
from app.services.predictive_engine import PredictiveRiskEngine
from typing import List

router = APIRouter(
    prefix="/intelligence",
    tags=["Predictive Risk Intelligence"]
)

@router.get("/{wallet}", response_model=CreditForecast)
def get_wallet_intelligence(wallet: str):
    """
    Retrieves aggregated forward-looking predictive credit insights and signals.
    """
    try:
        service = PredictiveRiskEngine()
        result = service.forecast_credit(wallet)
        return CreditForecast(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load intelligence details: {str(e)}")

@router.get("/{wallet}/signals", response_model=List[FinancialSignal])
def get_wallet_signals(wallet: str):
    """
    Retrieves positive, negative, and neutral financial risk signals detected.
    """
    try:
        service = PredictiveRiskEngine()
        signals = service.detect_risk_signals(wallet)
        return [FinancialSignal(**s) for s in signals]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detect risk signals: {str(e)}")

@router.get("/{wallet}/forecast", response_model=RiskPrediction)
def get_wallet_forecast(wallet: str):
    """
    Forecasts future credit scores and trajectories over 30-day forecast windows.
    """
    try:
        service = PredictiveRiskEngine()
        prediction = service.predict_wallet(wallet)
        return RiskPrediction(**prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate forecast: {str(e)}")

@router.post("/simulate", response_model=SimulationResult)
def simulate_wallet_scenario(request: SimulationRequest):
    """
    Simulates potential credit score impacts of financial scenarios (REPAY_LOAN, TAKE_NEW_LOAN, DEFAULT_LOAN).
    """
    try:
        service = PredictiveRiskEngine()
        result = service.simulate_scenario(request.wallet, request.scenario)
        return SimulationResult(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scenario simulation failed: {str(e)}")

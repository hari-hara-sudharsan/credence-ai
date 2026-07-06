from fastapi import APIRouter, HTTPException
from app.services.ai.trust_agent import CredenceTrustAgent

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Trust Intelligence"]
)

agent = CredenceTrustAgent()

@router.get("/trust-report/{wallet}")
def get_ai_trust_report(wallet: str):
    """
    Returns complete AI trust analysis report for a given wallet address.
    """
    try:
        report = agent.generate_trust_report(wallet)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/risk/{wallet}")
def get_ai_risk_prediction(wallet: str):
    """
    Returns AI risk prediction details (risk, confidence, trend, reasons).
    """
    try:
        risk = agent.predict_default_risk(wallet)
        return risk
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommend/{wallet}")
def get_ai_financial_recommendation(wallet: str):
    """
    Returns AI risk-adjusted financial recommendations.
    """
    try:
        recommendation = agent.recommend_financial_action(wallet)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException, Path
from app.services.security.trust_defense_engine import TrustDefenseEngine
from app.services.ai_agent_engine import AIFinancialAgent

router = APIRouter(
    prefix="/security",
    tags=["Trust Defense Engine"]
)

@router.get("/trust/{wallet}")
def get_trust_defense(wallet: str = Path(..., description="Wallet address")):
    try:
        engine = TrustDefenseEngine()
        report = engine.generate_defense_report(wallet)
        return {
            "authenticity": report["authenticityScore"],
            "sybilRisk": report["sybilRisk"],
            "trustSafe": report["trustSafe"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report/{wallet}")
def get_ai_defense_report(wallet: str = Path(..., description="Wallet address")):
    try:
        agent = AIFinancialAgent()
        return agent.analyzeTrustAuthenticity(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

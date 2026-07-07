from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ecosystem.trust_marketplace_engine import TrustMarketplaceEngine
from app.services.ai.trust_agent import CredenceTrustAgent

router = APIRouter(
    prefix="/api/v1/ecosystem",
    tags=["Ecosystem Integration"]
)

marketplace = TrustMarketplaceEngine()
agent = CredenceTrustAgent()

class AccessRequest(BaseModel):
    protocol: str

class DecisionResponse(BaseModel):
    approved: bool
    tier: str
    reason: str
    fitScore: int

@router.get("/profile/{wallet}")
def get_ecosystem_profile(wallet: str):
    """
    Retrieves the multi-protocol context-specific trust profile for the wallet.
    """
    try:
        return marketplace.generate_ecosystem_profile(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/access/{wallet}")
def get_ecosystem_access(wallet: str):
    """
    Lists the protocols for which the wallet is currently verified and eligible.
    """
    try:
        matches = marketplace.match_protocols(wallet)
        available = [m["protocol"].upper() for m in matches if m["approved"]]
        
        # Fallback ensuring standard profiles always have at least LENDING verified
        if not available:
            available = ["LENDING"]
            
        return {
            "trustVerified": len(available) > 0,
            "availableProtocols": available
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/access/{wallet}", response_model=DecisionResponse)
def check_protocol_access(wallet: str, request: AccessRequest):
    """
    Evaluates context fit and returns an access decision for a specific protocol.
    """
    try:
        decision = marketplace.generate_access_decision(wallet, request.protocol)
        return DecisionResponse(**decision)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommend/{wallet}")
def get_ecosystem_recommendation(wallet: str):
    """
    Returns AI Trust Agent's recommendations for ecosystem access.
    """
    try:
        return agent.recommend_ecosystem_access(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

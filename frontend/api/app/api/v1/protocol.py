from fastapi import APIRouter, HTTPException, Query, Path, Body
from app.services.ecosystem.protocol_consumer_engine import ProtocolConsumerEngine
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

router = APIRouter(
    tags=["Protocol Composability & Trust API"]
)

@router.get("/v1/protocol/decision")
def get_protocol_decision(
    wallet: str = Query(..., description="Wallet address to evaluate"),
    application: str = Query(..., description="Application protocol category (e.g. LENDING, PAYFI, RWA)")
):
    try:
        engine = ProtocolConsumerEngine()
        result = engine.generateProtocolDecision(wallet=wallet, protocol_type=application)
        return {
            "decision": result["decision"],
            "trustScore": result["trustScore"],
            "terms": result["terms"],
            "proof": result["proof"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/v1/protocol/evaluate")
def evaluate_protocol(
    payload: dict = Body(..., example={"wallet": "0x5bb83E60a7a05A0e1b077B66412a26306e334208", "protocol": "LENDING"})
):
    try:
        wallet = payload.get("wallet")
        protocol_type = payload.get("protocol", "LENDING")
        engine = ProtocolConsumerEngine()
        result = engine.generateProtocolDecision(wallet=wallet, protocol_type=protocol_type)
        
        is_approved = result["decision"] == "APPROVED"
        reason = "Prime Trust Profile" if is_approved else "Emerging/High Risk Profile"
        terms = result["terms"]
        
        return {
            "approved": is_approved,
            "reason": reason,
            "limit": float(terms.get("limit", 1000.0)),
            "interestRate": float(terms.get("interestRate", 15.0)),
            "collateralRatio": float(terms.get("collateralRatio", 80.0))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/v1/trust/{wallet}")
def get_trust_profile(wallet: str = Path(..., description="Wallet address")):
    try:
        fi = FinancialIdentityEngine()
        identity = fi.generate_identity(wallet)
        
        risk = "LOW"
        if identity["tier"] == "WATCHLIST":
            risk = "HIGH"
        elif identity["tier"] == "RETAIL":
            risk = "MEDIUM"
            
        return {
            "trustScore": identity["trustScore"],
            "risk": risk,
            "verified": identity["trustConfidence"] == "VERIFIED",
            "authenticity": identity["authenticityScore"],
            "sybilRisk": identity["sybilRisk"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

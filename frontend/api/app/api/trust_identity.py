from fastapi import APIRouter, HTTPException
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

router = APIRouter(
    prefix="/trust",
    tags=["Universal Trust Identity"]
)

engine = FinancialIdentityEngine()

@router.get("/identity/{wallet}")
def get_trust_identity(wallet: str):
    """
    Returns complete financial identity container for the wallet.
    """
    try:
        return engine.generate_identity(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dna/{wallet}")
def get_trust_dna(wallet: str):
    """
    Returns selective Financial DNA for the wallet.
    """
    try:
        dna = engine.calculate_financial_dna(wallet)
        return {
            "trust": dna["trust"],
            "credit": dna["credit"],
            "risk": dna["risk"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{wallet}")
def get_trust_history(wallet: str):
    """
    Returns wallet events history timeline.
    """
    try:
        return engine.generate_identity_timeline(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from app.services.reputation_engine import ReputationEngine
from web3 import Web3

router = APIRouter(
    prefix="/reputation",
    tags=["Reputation"]
)

@router.get("/{wallet}")
def get_reputation(wallet: str):
    """
    Retrieves the authoritative reputation profile, trust score, rating,
    and history of versioned profiles for a borrower address.
    """
    try:
        checksum_wallet = Web3.to_checksum_address(wallet)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid wallet address format.")
        
    engine = ReputationEngine()
    try:
        profile = engine.generate_reputation_profile(checksum_wallet)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate reputation profile: {str(e)}")

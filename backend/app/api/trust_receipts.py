from fastapi import APIRouter, HTTPException
from app.services.trust.trust_receipt_engine import TrustReceiptEngine

router = APIRouter(
    prefix="/trust",
    tags=["Verifiable Trust Receipts"]
)

engine = TrustReceiptEngine()

def format_event_name(action_type: str) -> str:
    return action_type.replace("_", " ").title()

@router.get("/receipts/{wallet}")
def get_wallet_receipts(wallet: str):
    """
    Retrieves and formats receipts for the wallet timeline view.
    """
    try:
        receipts = engine.get_wallet_receipts(wallet)
        formatted = []
        for r in receipts:
            formatted.append({
                "event": format_event_name(r["type"]),
                "impact": r["impact"],
                "verified": r["verified"],
                "hash": r["proof"],
                "timestamp": r.get("timestamp") or ""
            })
        return formatted
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/receipt/{id}")
def get_receipt_by_id(id: int):
    """
    Retrieves detailed proof of a single trust receipt.
    """
    try:
        return engine.verify_receipt(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

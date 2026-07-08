from fastapi import APIRouter

router = APIRouter(
    prefix="/activity",
    tags=["Activity"]
)

@router.get("/{wallet}")
def wallet_activity(wallet: str):
    # Mock data for activity
    return [
        {"eventType": "HSP_SETTLEMENT", "wallet": wallet},
        {"eventType": "HSP_SETTLEMENT", "wallet": wallet},
        {"eventType": "HSP_SETTLEMENT", "wallet": wallet},
        {"eventType": "LOAN_REPAYMENT", "wallet": wallet},
        {"eventType": "LOAN_REPAYMENT", "wallet": wallet},
        {"eventType": "PROTOCOL_VERIFICATION", "wallet": wallet},
    ]

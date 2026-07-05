from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from web3 import Web3
from datetime import datetime, timezone
from app.services.repayment_engine import RepaymentEngine
from app.contracts.loan_reader import LoanReader

router = APIRouter(
    prefix="/repayment",
    tags=["Repayment"]
)

class RepaymentRequest(BaseModel):
    wallet: str
    loan_id: str

@router.post("")
def repay_loan(request: RepaymentRequest):
    """
    Submits a request to repay an active loan on-chain.
    Returns transaction success details or structured failure.
    """
    engine = RepaymentEngine()
    try:
        result = engine.repay(request.loan_id, request.wallet)
        return result
    except ValueError as val_err:
        return {
            "success": False,
            "message": str(val_err)
        }
    except Exception:
        # Guarantee no stack traces are exposed
        return {
            "success": False,
            "message": "Repayment transaction failed or was reverted on-chain."
        }

@router.get("/history/{wallet}")
def get_repayment_history(wallet: str):
    """
    Reads directly from on-chain event logs to construct an authoritative,
    immutable repayment history for the borrower.
    """
    reader = LoanReader()
    try:
        checksum_wallet = Web3.to_checksum_address(wallet)
        # Fetch borrower loans to verify ownership and match amounts
        borrower_loans = reader.get_loans(checksum_wallet)
        loan_map = {l["loan_id"]: l for l in borrower_loans}
        
        w3 = reader.w3
        contract = reader.contract
        
        # Read the LoanRepaid events from the contract starting near deployment block
        events = contract.events.LoanRepaid.get_logs(from_block=29868000)
        
        history = []
        block_timestamps = {}
        
        for event in events:
            try:
                loan_id = event.args.loanId
                
                # Verify that the loan is owned by the borrower
                if loan_id in loan_map:
                    loan = loan_map[loan_id]
                    block_num = event.blockNumber
                    
                    # Fetch block timestamp and cache it
                    if block_num not in block_timestamps:
                        block = w3.eth.get_block(block_num)
                        block_timestamps[block_num] = block.timestamp
                        
                    timestamp = block_timestamps[block_num]
                    repaid_at = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat().replace("+00:00", "Z")
                    
                    history.append({
                        "loan_id": loan_id,
                        "repaid_at": repaid_at,
                        "transaction_hash": event.transactionHash.hex(),
                        "amount": loan["amount"],
                        "status": "REPAID"
                    })
            except Exception:
                continue
                
        # Sort history by repayment date descending
        history.sort(key=lambda x: x["repaid_at"], reverse=True)
        return history
    except Exception:
        return []

from fastapi import APIRouter, HTTPException
from app.schemas.wallet_schema import WalletRequest
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.offer_engine import LoanOfferEngine
from app.contracts.loan_manager import LoanManagerClient

router = APIRouter(
    prefix="/protocol",
    tags=["Loan Protocol"]
)

@router.post("/create-loan")
def create_on_chain_loan(request: WalletRequest):
    analyzer = WalletAnalyzer()
    credit_engine = CreditEngine()
    lending_engine = LendingEngine()
    offer_engine = LoanOfferEngine()

    try:
        # Step 1: Analyze wallet
        features = analyzer.analyze(request.wallet)
        
        # Step 2: Generate credit profile
        profile = credit_engine.calculate(features)
        
        # Step 3: Generate lending decision
        lending_profile = lending_engine.evaluate(profile, features)
        
        # Step 4: Generate loan offer
        offer = offer_engine.generate_offer(
            wallet=request.wallet,
            credit_profile=profile,
            lending_profile=lending_profile,
            balance=features.get("balance")
        )
    except Exception as e:
        # Internal processing error (not a smart contract failure)
        raise HTTPException(status_code=500, detail=f"Internal processing error: {str(e)}")

    # Step 5: If not approved, return response without blockchain interaction
    if not offer.approved:
        return {
            "approved": False,
            "reason": offer.reason
        }

    # Step 6: If approved, submit to LoanManager contract on-chain
    try:
        client = LoanManagerClient()
        tx_hash = client.create_loan(
            borrower=request.wallet,
            amount=offer.approved_amount,
            interest=offer.interest_rate,
            collateral_ratio=offer.collateral_ratio,
            duration=offer.duration_days,
            offer_id=offer.offer_id,
            offer_hash=offer.offer_hash
        )
        # Update reputation profile after loan creation
        try:
            from app.services.reputation_engine import ReputationEngine
            reputation_engine = ReputationEngine()
            reputation_engine.update_after_loan(
                wallet=request.wallet,
                loan_id=offer.offer_id,
                credit_score=profile.credit_score
            )
        except Exception as rep_err:
            print(f"Failed to update reputation: {rep_err}")

        return {
            "approved": True,
            "loan_created": True,
            "loan_id": offer.offer_id,
            "transaction_hash": tx_hash,
            "offer": offer
        }
    except Exception as contract_err:
        # Return structured error on smart contract failure, never expose stack traces
        return {
            "approved": True,
            "loan_created": False,
            "error": "Transaction reverted"
        }

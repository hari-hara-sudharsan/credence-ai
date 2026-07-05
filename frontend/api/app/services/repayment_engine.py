from web3 import Web3
from app.contracts.loan_reader import LoanReader
from app.contracts.repayment_client import RepaymentClient

class RepaymentEngine:
    def __init__(self):
        self.reader = LoanReader()
        self.client = RepaymentClient()

    def repay(self, loan_id: str, borrower: str) -> dict:
        """
        Validates borrower ownership and active status of the loan, 
        and triggers the on-chain repayment transaction.
        """
        checksum_borrower = Web3.to_checksum_address(borrower)
        
        # 1. Fetch loans for the borrower
        loans = self.reader.get_loans(checksum_borrower)
        
        # 2. Locate the specific loan
        target_loan = None
        for loan in loans:
            if loan["loan_id"] == loan_id:
                target_loan = loan
                break
                
        if not target_loan:
            raise ValueError("Loan does not exist or borrower does not own this loan.")
            
        # 3. Validate status is ACTIVE (status_val == 1)
        status_val = target_loan["status_val"]
        if status_val == 2:
            raise ValueError("Loan is already repaid.")
        elif status_val == 3:
            raise ValueError("Loan has been cancelled.")
        elif status_val == 0:
            raise ValueError("Loan is pending and cannot be repaid yet.")
        elif status_val != 1:
            raise ValueError(f"Loan is in invalid status state: {status_val}")
            
        # 4. Trigger on-chain repayment
        tx_hash = self.client.repay_loan(loan_id)
        
        # 5. Update reputation profile after repayment
        try:
            from app.services.reputation_engine import ReputationEngine
            rep_engine = ReputationEngine()
            
            from app.services.wallet_analyzer import WalletAnalyzer
            from app.services.credit_engine import CreditEngine
            analyzer = WalletAnalyzer()
            credit_engine = CreditEngine()
            features = analyzer.analyze(borrower)
            profile = credit_engine.calculate(features)
            current_credit_score = profile.credit_score
            
            import time
            is_on_time = int(time.time()) <= target_loan["due_date_timestamp"]
            
            rep_engine.update_after_repayment(
                wallet=borrower,
                loan_id=loan_id,
                credit_score=current_credit_score,
                is_on_time=is_on_time
            )
        except Exception as rep_err:
            print(f"Failed to update reputation: {rep_err}")
            
        return {
            "success": True,
            "loan_id": loan_id,
            "status": "REPAID",
            "transaction_hash": tx_hash,
            "message": "Loan successfully repaid."
        }

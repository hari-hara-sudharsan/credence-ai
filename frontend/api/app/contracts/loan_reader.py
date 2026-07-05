import os
from web3 import Web3
from dotenv import load_dotenv
from app.contracts.loan_manager import LOAN_MANAGER_ABI

load_dotenv()

class LoanReader:
    def __init__(self):
        hsk_rpc = os.getenv('HSK_RPC')
        if not hsk_rpc:
            raise ValueError('HSK_RPC environment variable is required')
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)
        
        contract_address = os.getenv('LOAN_MANAGER_ADDRESS') or os.getenv('LOAN_MANAGER')
        if not contract_address:
            raise ValueError('LOAN_MANAGER_ADDRESS or LOAN_MANAGER environment variable is required')
        self.contract_address = Web3.to_checksum_address(contract_address)
        
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=LOAN_MANAGER_ABI
        )

    def get_loans(self, wallet: str) -> list:
        """
        Retrieves all loans for a borrower and converts them into Python dictionaries.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        try:
            loan_ids = self.contract.functions.getBorrowerLoans(checksum_wallet).call()
        except Exception:
            return []
            
        loans_list = []
        for loan_id in loan_ids:
            try:
                # getLoan returns a tuple:
                # 0: loanId (string)
                # 1: borrower (address)
                # 2: approvedAmount (uint256)
                # 3: interestRate (uint256)
                # 4: collateralRatio (uint256)
                # 5: duration (uint256)
                # 6: creationTime (uint256)
                # 7: dueDate (uint256)
                # 8: status (uint8)
                # 9: offerHash (bytes32)
                # 10: offerId (string)
                raw_loan = self.contract.functions.getLoan(loan_id).call()
                
                loans_list.append({
                    "loan_id": raw_loan[0],
                    "borrower": raw_loan[1],
                    "amount": float(raw_loan[2]) / (10 ** 18),
                    "interest_rate": float(raw_loan[3]),
                    "collateral_ratio": float(raw_loan[4]),
                    "duration": int(raw_loan[5]) // (24 * 60 * 60) if raw_loan[5] > 0 else 0,
                    "created_at_timestamp": int(raw_loan[6]),
                    "due_date_timestamp": int(raw_loan[7]),
                    "status_val": int(raw_loan[8]), # LoanStatus enum: PENDING, ACTIVE, REPAID, CANCELLED
                    "offer_hash": raw_loan[9].hex() if isinstance(raw_loan[9], bytes) else str(raw_loan[9]),
                    "offer_id": raw_loan[10]
                })
            except Exception:
                continue
                
        return loans_list

    def get_active_loans(self, wallet: str) -> list:
        """
        Retrieves only active loans for a borrower.
        Active corresponds to enum value 1 (ACTIVE).
        """
        all_loans = self.get_loans(wallet)
        return [l for l in all_loans if l["status_val"] == 1]

    def get_completed_loans(self, wallet: str) -> list:
        """
        Retrieves only completed/repaid loans for a borrower.
        Repaid corresponds to enum value 2 (REPAID).
        """
        all_loans = self.get_loans(wallet)
        return [l for l in all_loans if l["status_val"] == 2]

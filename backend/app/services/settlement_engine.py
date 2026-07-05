import time
from datetime import datetime, timezone
from app.services.hsp_client import HSPClient
from app.services.verification_network import VerificationNetwork
from app.contracts.loan_manager import LoanManagerClient
from app.database.persistence import read_json, write_json
from web3 import Web3

DB_FILENAME = "settlements.json"

class SettlementEngine:
    def __init__(self):
        self.hsp = HSPClient()
        self.vn = VerificationNetwork()
        self.lm = LoanManagerClient()

    def execute_loan_settlement(
        self,
        loan_id: str,
        borrower: str,
        amount: float,
        asset: str,
        attestation_id: str
    ) -> dict:
        """
        Coordinates full verification checks and stablecoin settlement transfer.
        """
        borrower_checksum = Web3.to_checksum_address(borrower)
        zero_address = "0x" + "0" * 40

        # 1. Check if loan already exists on-chain
        loan_exists = False
        try:
            loan_data = self.lm.contract.functions.loans(loan_id).call()
            # loan_data[1] is borrower address — zero address means loan doesn't exist
            loan_borrower = loan_data[1]
            if isinstance(loan_borrower, str):
                loan_exists = loan_borrower.lower() != zero_address.lower()
            else:
                loan_exists = loan_borrower != bytes.fromhex("0" * 40)
            
            if loan_exists:
                # Loan exists — check it's in PENDING status (status=0)
                if loan_data[8] != 0:
                    raise ValueError("Loan is already active, repaid, or cancelled")
        except ValueError:
            raise  # Re-raise validation errors
        except Exception as read_err:
            # Network/SSL error reading loan — not a validation error
            loan_exists = False

        # 2. If loan doesn't exist on-chain, auto-create it
        if not loan_exists:
            try:
                self.lm.create_loan(
                    borrower=borrower_checksum,
                    amount=amount,
                    interest=5.0,
                    collateral_ratio=150.0,
                    duration=30,
                    offer_id=loan_id,
                    offer_hash="0x" + "0" * 64
                )
            except Exception as create_err:
                raise ValueError(f"On-chain loan creation failed: {create_err}")

        # 2. Verify Oracle Attestation valid & not expired
        verify_record = self.vn.get_verification_by_wallet(borrower_checksum)
        if not verify_record:
            verify_record = self.vn.verify_wallet(borrower_checksum)

        if not verify_record.get("oracle_verified"):
            raise ValueError("Oracle attestation signature is not verified")

        # Verify not expired
        expires_at_str = verify_record.get("expires_at")
        if expires_at_str:
            # Parse datetime string
            expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
            if expires_at < datetime.now(timezone.utc):
                raise ValueError("Oracle attestation credentials have expired")

        # 3. Verify Policy passed
        # Credit policy floor check — the AI lending decision already evaluates full eligibility.
        # This is a safety floor to prevent clearly fraudulent settlements.
        credit_score = verify_record.get("credit_score", 0)
        if credit_score < 200:
            raise ValueError(f"Credit policy check failed: credit score {credit_score} is below minimum safety threshold")

        # 4. Check double settlement
        db = read_json(DB_FILENAME, {})
        if loan_id in db:
            raise ValueError("Loan has already been settled")

        # 5. Execute HSP Transfer
        transfer = self.hsp.create_transfer(
            sender=self.lm.account.address,
            receiver=borrower_checksum,
            amount=amount,
            reference_id=loan_id
        )

        # 6. Update smart contract status
        try:
            contract_tx = self.lm.mark_settled(loan_id, transfer["tx_hash"])
        except Exception as e:
            raise RuntimeError(f"Failed to submit markSettled contract transaction: {e}")

        # 7. Cache settlement record
        record = {
            "settlement_id": transfer["settlement_id"],
            "loan_id": loan_id,
            "borrower": borrower_checksum.lower(),
            "amount": amount,
            "status": "SETTLED",
            "tx_hash": contract_tx,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        db[loan_id] = record
        write_json(DB_FILENAME, db)

        return record

    def verify_settlement(self, settlement_id: str) -> bool:
        return self.hsp.verify_transfer(settlement_id)

    def track_settlement(self, tx_hash: str) -> str:
        return self.hsp.get_transaction_status(tx_hash)

import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()


class HSPClient:
    """
    Real on-chain HSK transfer client. Sends native HSK tokens from the
    protocol wallet to the borrower's address on HashKey Chain.
    """

    def __init__(self):
        hsk_rpc = os.getenv("HSK_RPC")
        if not hsk_rpc:
            raise ValueError("HSK_RPC environment variable is required")

        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)

        private_key = os.getenv("PRIVATE_KEY")
        if not private_key:
            raise ValueError("PRIVATE_KEY environment variable is required")

        key = private_key if private_key.startswith("0x") else "0x" + private_key
        self.account = self.w3.eth.account.from_key(key)

    # Nominal amount (in HSK) sent on-chain as a settlement proof.
    # The actual loan value is recorded off-chain; this is just the
    # on-chain attestation transfer to prove settlement occurred.
    SETTLEMENT_PROOF_AMOUNT_HSK = 0.0001

    def create_transfer(self, sender: str, receiver: str, amount: float, reference_id: str) -> dict:
        """
        Executes a real native HSK transfer from the protocol wallet to the receiver.
        Sends a small nominal amount as an on-chain settlement proof.
        Returns settlement_id and actual transaction hash.
        """
        receiver_checksum = Web3.to_checksum_address(receiver)
        # Use a tiny nominal amount for the on-chain proof instead of the
        # full loan value — the wallet doesn't hold the full loan amount
        # in native HSK, and the real disbursement would go through a
        # stablecoin / lending-pool contract in production.
        proof_wei = self.w3.to_wei(self.SETTLEMENT_PROOF_AMOUNT_HSK, "ether")

        nonce = self.w3.eth.get_transaction_count(self.account.address)

        tx = {
            "from": self.account.address,
            "to": receiver_checksum,
            "value": proof_wei,
            "nonce": nonce,
            "gas": 21000,
            "gasPrice": self.w3.eth.gas_price,
            "chainId": 177,
        }

        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        tx_hash_hex = "0x" + tx_hash.hex().removeprefix("0x")
        settlement_id = "hsp_" + tx_hash_hex[2:26]

        return {
            "settlement_id": settlement_id,
            "status": "CONFIRMED" if receipt.status == 1 else "FAILED",
            "tx_hash": tx_hash_hex,
        }

    def verify_transfer(self, settlement_id: str) -> bool:
        """
        Verifies that a settlement transaction exists on-chain by checking the tx receipt.
        """
        if not settlement_id.startswith("hsp_"):
            return False
        try:
            tx_hash_hex = "0x" + settlement_id[4:]
            receipt = self.w3.eth.get_transaction_receipt(tx_hash_hex)
            return receipt is not None and receipt.status == 1
        except Exception:
            return False

    def get_transaction_status(self, tx_hash: str) -> str:
        """
        Queries the real transaction status from the blockchain.
        """
        try:
            if not tx_hash.startswith("0x"):
                tx_hash = "0x" + tx_hash
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            if receipt is None:
                return "PENDING"
            return "SUCCESS" if receipt.status == 1 else "FAILED"
        except Exception:
            return "UNKNOWN"

    def estimate_settlement(self, amount: float, asset: str) -> float:
        """
        Estimates gas cost for the settlement transfer.
        """
        try:
            gas_price = self.w3.eth.gas_price
            gas_cost_wei = gas_price * 21000
            gas_cost_hsk = float(self.w3.from_wei(gas_cost_wei, "ether"))
            return round(gas_cost_hsk, 6)
        except Exception:
            # Fallback estimate
            return round(amount * 0.001, 4)

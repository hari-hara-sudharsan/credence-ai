import os
import uuid
from eth_account import Account
from eth_account.messages import encode_typed_data
from hexbytes import HexBytes

from web3 import Web3

class SignatureEngine:
    def __init__(self):
        # Oracle private key
        self.private_key = os.getenv("PRIVATE_KEY")
        if not self.private_key:
            raise ValueError("PRIVATE_KEY environment variable is required")
        
        # Ensure it has 0x prefix for Account.from_key
        key = self.private_key
        if not key.startswith("0x"):
            key = "0x" + key
            
        self.account = Account.from_key(key)
        self.oracle_address = self.account.address
        self.chain_id = 177  # HashKey Chain Mainnet ID
        
        # Verifying contract address (dynamic fallback to LoanManager address)
        self.verifying_contract = os.getenv("LOAN_MANAGER_ADDRESS") or "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80"

    def sign_underwriting_offer(
        self,
        wallet: str,
        offer_hash: str,
        credit_score: int,
        approved_amount: float,
        interest_rate: float,
        collateral_ratio: float,
        duration_days: int,
        expiry: int
    ) -> str:
        """
        Signs the underwriting offer using EIP-712 standard.
        """
        approved_amount_wei = int(approved_amount * (10 ** 18))
        interest_rate_uint = int(interest_rate)
        collateral_ratio_uint = int(collateral_ratio)
        duration_seconds = int(duration_days) * 24 * 60 * 60

        if isinstance(offer_hash, str):
            if offer_hash.startswith("0x"):
                offer_hash_bytes = HexBytes(offer_hash)
            else:
                offer_hash_bytes = HexBytes("0x" + offer_hash)
        else:
            offer_hash_bytes = HexBytes(offer_hash)

        # Structure matching SignatureVerifier.sol exactly
        structured_data = {
            "types": {
                "EIP712Domain": [
                    {"name": "name", "type": "string"},
                    {"name": "version", "type": "string"},
                    {"name": "chainId", "type": "uint256"},
                    {"name": "verifyingContract", "type": "address"}
                ],
                "UnderwritingOffer": [
                    {"name": "wallet", "type": "address"},
                    {"name": "offerHash", "type": "bytes32"},
                    {"name": "creditScore", "type": "uint256"},
                    {"name": "approvedAmount", "type": "uint256"},
                    {"name": "interestRate", "type": "uint256"},
                    {"name": "collateralRatio", "type": "uint256"},
                    {"name": "duration", "type": "uint256"},
                    {"name": "expiry", "type": "uint256"}
                ]
            },
            "primaryType": "UnderwritingOffer",
            "domain": {
                "name": "Credence AI",
                "version": "1",
                "chainId": self.chain_id,
                "verifyingContract": Web3.to_checksum_address(self.verifying_contract)
            },
            "message": {
                "wallet": Web3.to_checksum_address(wallet),
                "offerHash": offer_hash_bytes,
                "creditScore": int(credit_score),
                "approvedAmount": approved_amount_wei,
                "interestRate": interest_rate_uint,
                "collateralRatio": collateral_ratio_uint,
                "duration": duration_seconds,
                "expiry": int(expiry)
            }
        }

        signable_message = encode_typed_data(full_message=structured_data)
        signed_message = self.account.sign_message(signable_message)
        return signed_message.signature.hex()

    def verify_underwriting_offer(
        self,
        wallet: str,
        offer_hash: str,
        credit_score: int,
        approved_amount: float,
        interest_rate: float,
        collateral_ratio: float,
        duration_days: int,
        expiry: int,
        signature: str
    ) -> bool:
        """
        Verifies the underwriting offer signature against the oracle's address.
        """
        approved_amount_wei = int(approved_amount * (10 ** 18))
        interest_rate_uint = int(interest_rate)
        collateral_ratio_uint = int(collateral_ratio)
        duration_seconds = int(duration_days) * 24 * 60 * 60

        if isinstance(offer_hash, str):
            if offer_hash.startswith("0x"):
                offer_hash_bytes = HexBytes(offer_hash)
            else:
                offer_hash_bytes = HexBytes("0x" + offer_hash)
        else:
            offer_hash_bytes = HexBytes(offer_hash)

        structured_data = {
            "types": {
                "EIP712Domain": [
                    {"name": "name", "type": "string"},
                    {"name": "version", "type": "string"},
                    {"name": "chainId", "type": "uint256"},
                    {"name": "verifyingContract", "type": "address"}
                ],
                "UnderwritingOffer": [
                    {"name": "wallet", "type": "address"},
                    {"name": "offerHash", "type": "bytes32"},
                    {"name": "creditScore", "type": "uint256"},
                    {"name": "approvedAmount", "type": "uint256"},
                    {"name": "interestRate", "type": "uint256"},
                    {"name": "collateralRatio", "type": "uint256"},
                    {"name": "duration", "type": "uint256"},
                    {"name": "expiry", "type": "uint256"}
                ]
            },
            "primaryType": "UnderwritingOffer",
            "domain": {
                "name": "Credence AI",
                "version": "1",
                "chainId": self.chain_id,
                "verifyingContract": Web3.to_checksum_address(self.verifying_contract)
            },
            "message": {
                "wallet": Web3.to_checksum_address(wallet),
                "offerHash": offer_hash_bytes,
                "creditScore": int(credit_score),
                "approvedAmount": approved_amount_wei,
                "interestRate": interest_rate_uint,
                "collateralRatio": collateral_ratio_uint,
                "duration": duration_seconds,
                "expiry": int(expiry)
            }
        }

        signable_message = encode_typed_data(full_message=structured_data)
        try:
            # signature can be HexBytes or hex string
            sig_bytes = HexBytes(signature) if isinstance(signature, str) else signature
            recovered_address = Account.recover_message(signable_message, signature=sig_bytes)
            return recovered_address.lower() == self.oracle_address.lower()
        except Exception:
            return False

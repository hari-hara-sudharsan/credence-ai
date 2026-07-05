import os
import json
import uuid
from datetime import datetime, timezone, timedelta
from eth_account.messages import encode_defunct
from hexbytes import HexBytes
from web3 import Web3
from app.database.persistence import read_json, write_json
from app.services.passport_v2_service import PassportV2Service
from app.services.oracle_attestation_service import OracleAttestationService

VERIFICATION_REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "verificationHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "passportHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "attestationHash", "type": "bytes32"},
            {"internalType": "address", "name": "wallet", "type": "address"}
        ],
        "name": "publishVerification",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "verificationHash", "type": "bytes32"}
        ],
        "name": "verify",
        "outputs": [
            {"internalType": "bool", "name": "exists", "type": "bool"},
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

DB_FILENAME = "verifications.json"

class VerificationNetwork:
    def __init__(self):
        hsk_rpc = os.getenv("HSK_RPC")
        if not hsk_rpc:
            raise ValueError("HSK_RPC environment variable is required")
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)

        private_key = os.getenv("PRIVATE_KEY")
        if not private_key:
            raise ValueError("PRIVATE_KEY environment variable is required")
            
        key = private_key
        if not key.startswith("0x"):
            key = "0x" + key

        self.account = self.w3.eth.account.from_key(key)
        self.oracle_address = self.account.address

        # Load contract address
        contract_address = os.getenv("VERIFICATION_REGISTRY_ADDRESS")
        if not contract_address:
            # Fallback
            contract_address = "0xFc8cd61D26aF1A419B23F3bA08BE68aF3D9e827a"

        self.contract_address = Web3.to_checksum_address(contract_address)
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=VERIFICATION_REGISTRY_ABI
        )

    def generate_trust_seal(self, credit_score: int, trust_score: int, oracle_verified: bool, passport_status: str) -> str:
        """
        Determines the Trust Seal level based on deterministic criteria:
        - INSTITUTIONAL_VERIFIED: Credit >= 700, Trust >= 75, Oracle Verified, Passport Active.
        - GOLD: Credit >= 650, Trust >= 60, Passport Active.
        - SILVER: Credit >= 550, Trust >= 45.
        - BRONZE: Default fallback.
        """
        is_active = (passport_status == "ACTIVE")
        
        if credit_score >= 700 and trust_score >= 75 and oracle_verified and is_active:
            return "INSTITUTIONAL_VERIFIED"
        elif credit_score >= 650 and trust_score >= 60 and is_active:
            return "GOLD"
        elif credit_score >= 550 and trust_score >= 45:
            return "SILVER"
        else:
            return "BRONZE"

    def verify_wallet(self, wallet: str) -> dict:
        """
        Aggregates passport, attestation, and adapted profiles,
        publishes verified metadata proof on-chain, and caches the result.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        
        # 1. Fetch passport (or auto-generate if missing)
        passport_service = PassportV2Service()
        passport = passport_service.get_passport_by_wallet(wallet_checksum)
        if not passport:
            passport = passport_service.generate_passport(wallet_checksum)

        is_revoked = passport["passport_status"] == "REVOKED"
        is_expired = new_expires = datetime.fromisoformat(passport["expires_at"].replace("Z", "+00:00")).replace(tzinfo=timezone.utc) < datetime.now(timezone.utc)
        passport_valid = not is_revoked and not is_expired

        # 2. Determine seal
        trust_seal = self.generate_trust_seal(
            credit_score=passport["credit_score"],
            trust_score=passport["trust_score"],
            oracle_verified=passport["oracle_verified"],
            passport_status=passport["passport_status"]
        )

        verification_id = "vf_" + str(uuid.uuid4()).replace("-", "")[:12]
        verified_at = datetime.now(timezone.utc)
        expires_at = verified_at + timedelta(days=30)

        # 3. Build verification record structure
        verification_record = {
            "wallet": wallet_checksum,
            "verification_id": verification_id,
            "passport_valid": passport_valid,
            "oracle_verified": passport["oracle_verified"],
            "credit_score": passport["credit_score"],
            "trust_score": passport["trust_score"],
            "risk_level": passport["risk_level"],
            "protocol_profiles": passport["protocol_profiles"],
            "attestation_id": passport["oracle_attestation_id"],
            "passport_id": passport["passport_id"],
            "verified_at": verified_at.isoformat().replace("+00:00", "Z"),
            "expires_at": expires_at.isoformat().replace("+00:00", "Z"),
            "network_version": "1.0.0",
            "trust_seal": trust_seal
        }

        # 4. Generate Verification Hash (Keccak256 of JSON string representation)
        serialized = json.dumps(verification_record, sort_keys=True)
        verification_hash_bytes = Web3.keccak(text=serialized)
        verification_hash = "0x" + verification_hash_bytes.hex()

        # Sign verification hash using Oracle key
        message = encode_defunct(verification_hash_bytes)
        oracle_signature = self.account.sign_message(message).signature.hex()
        if not oracle_signature.startswith("0x"):
            oracle_signature = "0x" + oracle_signature

        # 5. Publish Verification hash to VerificationRegistry on-chain
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx_func = self.contract.functions.publishVerification(
            HexBytes(verification_hash),
            HexBytes(passport["passport_hash"]),
            HexBytes(passport["attestation_hash"]),
            wallet_checksum
        )

        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 500000

        tx = tx_func.build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 177
        })

        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt.status != 1:
            raise RuntimeError("publishVerification transaction reverted on-chain")

        # Save details locally
        cached_record = {
            **verification_record,
            "verification_hash": verification_hash,
            "passport_hash": passport["passport_hash"],
            "attestation_hash": passport["attestation_hash"],
            "oracle_signature": oracle_signature,
            "registry_tx": "0x" + tx_hash.hex() if not tx_hash.hex().startswith("0x") else tx_hash.hex()
        }

        data = read_json(DB_FILENAME, {})
        data[wallet_checksum.lower()] = cached_record
        write_json(DB_FILENAME, data)

        return cached_record

    def get_verification_by_wallet(self, wallet: str) -> dict or None:
        wallet_checksum = Web3.to_checksum_address(wallet)
        data = read_json(DB_FILENAME, {})
        return data.get(wallet_checksum.lower())

    def verify_passport(self, passport_id: str) -> dict:
        """
        Searches database for passport ID and returns corresponding verification record.
        """
        data = read_json(DB_FILENAME, {})
        for record in data.values():
            if record["passport_id"] == passport_id:
                return record
        raise ValueError("Verification for passport ID not found")

    def verify_attestation(self, attestation_id: str) -> dict:
        """
        Searches database for attestation ID and returns corresponding verification record.
        """
        data = read_json(DB_FILENAME, {})
        for record in data.values():
            if record["attestation_id"] == attestation_id:
                return record
        raise ValueError("Verification for attestation ID not found")

    def verify_protocol_profile(self, wallet: str, protocol: str) -> dict:
        """
        Inspects only the adapted profile for a given protocol domain.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        record = self.get_verification_by_wallet(wallet_checksum)
        if not record:
            record = self.verify_wallet(wallet_checksum)

        for profile in record["protocol_profiles"]:
            if profile["protocol"].upper() == protocol.upper():
                return profile
        raise ValueError(f"Profile for protocol type '{protocol}' not found")

    def generate_proof_bundle(self, wallet: str) -> dict:
        """
        Compiles the Machine-Readable Proof Bundle for ecosystems ingestion.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        record = self.get_verification_by_wallet(wallet_checksum)
        if not record:
            record = self.verify_wallet(wallet_checksum)

        return {
            "verification_version": record["network_version"],
            "wallet": record["wallet"],
            "passport_hash": record["passport_hash"],
            "attestation_hash": record["attestation_hash"],
            "verification_hash": record["verification_hash"],
            "oracle_signature": record["oracle_signature"],
            "trust_seal": record["trust_seal"],
            "issued_at": record["verified_at"],
            "expires_at": record["expires_at"]
        }

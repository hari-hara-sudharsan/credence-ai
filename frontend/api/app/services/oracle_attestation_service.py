import os
import time
from datetime import datetime, timezone
from eth_account import Account
from eth_account.messages import encode_defunct
from hexbytes import HexBytes
from web3 import Web3
from app.database.attestation_store import AttestationStore
from app.services.signature_engine import SignatureEngine

ORACLE_REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "attestationHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "offerHash", "type": "bytes32"},
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "uint256", "name": "expiry", "type": "uint256"},
            {"internalType": "bytes[]", "name": "signatures", "type": "bytes[]"}
        ],
        "name": "publishAttestation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "attestationHash", "type": "bytes32"},
            {"internalType": "bytes[]", "name": "signatures", "type": "bytes[]"}
        ],
        "name": "revokeAttestation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "attestationHash", "type": "bytes32"}
        ],
        "name": "verifyAttestation",
        "outputs": [
            {"internalType": "bool", "name": "exists", "type": "bool"},
            {"internalType": "bool", "name": "verified", "type": "bool"},
            {"internalType": "bool", "name": "revoked", "type": "bool"},
            {"internalType": "bool", "name": "expired", "type": "bool"},
            {"internalType": "address", "name": "oracle", "type": "address"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class OracleAttestationService:
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
        self.chain_id = 177
        
        # Load registry address
        contract_address = os.getenv("ORACLE_REGISTRY_ADDRESS")
        if not contract_address:
            raise ValueError("ORACLE_REGISTRY_ADDRESS environment variable is required")
            
        self.contract_address = Web3.to_checksum_address(contract_address)
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=ORACLE_REGISTRY_ABI
        )
        self.store = AttestationStore()

    def publish(
        self,
        attestation_id: str,
        wallet: str,
        offer_id: str,
        offer_hash: str,
        credit_score: int,
        risk_level: str,
        approved_amount: float,
        interest_rate: float,
        collateral_ratio: float,
        duration_days: int,
        issued_at: datetime,
        expires_at: datetime,
        signature: str,
        oracle_version: str = "CredenceOracle/1.0.0"
    ) -> dict:
        """
        Validates EIP-712 underwriting signature, generates attestation hash,
        obtains consensus signature, publishes to OracleRegistry on-chain,
        and saves in local store.
        """
        # 1. Verify standard EIP-712 underwriting signature
        sig_engine = SignatureEngine()
        expiry_timestamp = int(expires_at.timestamp())
        
        is_valid = sig_engine.verify_underwriting_offer(
            wallet=wallet,
            offer_hash=offer_hash,
            credit_score=credit_score,
            approved_amount=approved_amount,
            interest_rate=interest_rate,
            collateral_ratio=collateral_ratio,
            duration_days=duration_days,
            expiry=expiry_timestamp,
            signature=signature
        )
        
        if not is_valid:
            raise ValueError("Underwriting attestation EIP-712 signature verification failed")

        # 2. Generate immutable attestation hash (Keccak256 of EIP-712 signature)
        attestation_hash_bytes = Web3.keccak(hexstr=signature)
        attestation_hash = attestation_hash_bytes.hex()
        if not attestation_hash.startswith("0x"):
            attestation_hash = "0x" + attestation_hash

        # 3. Generate consensus signature on attestation_hash (for 1-of-N threshold check)
        message = encode_defunct(attestation_hash_bytes)
        signed_message = self.account.sign_message(message)
        consensus_sig = signed_message.signature.hex()

        # 4. Prepare smart contract parameters
        offer_hash_bytes = HexBytes(offer_hash)
        wallet_checksum = Web3.to_checksum_address(wallet)
        
        # Submit transaction on-chain
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx_func = self.contract.functions.publishAttestation(
            attestation_hash_bytes,
            offer_hash_bytes,
            wallet_checksum,
            expiry_timestamp,
            [Web3.to_bytes(hexstr=consensus_sig)]
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
        self.w3.eth.wait_for_transaction_receipt(tx_hash)

        # 5. Build dynamic record to store in database
        attestation_record = {
            "attestation_id": attestation_id,
            "wallet": wallet_checksum,
            "offer_id": offer_id,
            "offer_hash": offer_hash,
            "attestation_hash": attestation_hash,
            "oracle_address": self.oracle_address,
            "credit_score": int(credit_score),
            "risk_level": risk_level,
            "approved_amount": float(approved_amount),
            "interest_rate": float(interest_rate),
            "collateral_ratio": float(collateral_ratio),
            "duration_days": int(duration_days),
            "issued_at": issued_at.isoformat() if isinstance(issued_at, datetime) else issued_at,
            "expires_at": expires_at.isoformat() if isinstance(expires_at, datetime) else expires_at,
            "signature": signature,
            "verified": True,
            "oracle_version": oracle_version,
            "chain_id": self.chain_id,
            "revoked": False,
            "registry_tx": "0x" + tx_hash.hex() if not tx_hash.hex().startswith("0x") else tx_hash.hex()
        }

        self.store.save(attestation_record)
        return attestation_record

    def verify(self, attestation_hash: str) -> dict:
        """
        Queries on-chain registry verification flags.
        Falls back to local DB if on-chain is unavailable or hash not found.
        """
        att_hash_bytes = HexBytes(attestation_hash)
        
        exists = False
        verified = False
        revoked = False
        expired = False
        oracle = "0x0000000000000000000000000000000000000000"
        timestamp = 0

        # 1. Try on-chain lookup
        try:
            exists, verified, revoked, expired, oracle, timestamp = self.contract.functions.verifyAttestation(
                att_hash_bytes
            ).call()
        except Exception:
            pass  # On-chain lookup failed (SSL/RPC) — fall through to local DB

        # 2. If on-chain says not found, check local attestation store
        local_rec = self.store.get_by_attestation_hash(attestation_hash)
        
        if not exists and local_rec:
            # Attestation was published and stored locally but may not be on-chain yet
            # (e.g., contract not deployed, or published to different chain)
            exists = True
            verified = True
            revoked = local_rec.get("revoked", False)
            oracle = local_rec.get("oracle_address", oracle)
            
            # Check expiry from local record
            expires_at_str = local_rec.get("expires_at", "")
            if expires_at_str:
                try:
                    exp_dt = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
                    expired = exp_dt < datetime.now(timezone.utc)
                except Exception:
                    pass

        # 3. Build issued_at string
        issued_at_str = ""
        if exists and timestamp > 0:
            issued_at_str = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat().replace("+00:00", "Z")
        elif local_rec:
            issued_at_str = local_rec.get("issued_at", "")

        return {
            "exists": bool(exists),
            "verified": bool(verified),
            "revoked": bool(revoked),
            "expired": bool(expired),
            "oracle": oracle,
            "issued_at": issued_at_str
        }

    def revoke(self, attestation_hash: str) -> dict:
        """
        Generates consensus revocation signature, updates the Registry contract,
        and invalidates local cache database record.
        """
        att_hash_bytes = HexBytes(attestation_hash)
        
        # 1. Sign revocation digest: keccak256("REVOKE:", attestation_hash)
        revocation_msg = Web3.solidity_keccak(
            ['string', 'bytes32'],
            ["REVOKE:", att_hash_bytes]
        )
        message = encode_defunct(revocation_msg)
        signed_message = self.account.sign_message(message)
        consensus_sig = signed_message.signature.hex()

        # 2. Submit transaction on-chain
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx_func = self.contract.functions.revokeAttestation(
            att_hash_bytes,
            [Web3.to_bytes(hexstr=consensus_sig)]
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
        self.w3.eth.wait_for_transaction_receipt(tx_hash)

        # 3. Update local DB
        local_rec = self.store.get_by_attestation_hash(attestation_hash)
        if local_rec:
            self.store.revoke(local_rec["attestation_id"])

        return {
            "revoked": True,
            "attestation_hash": attestation_hash,
            "registry_tx": "0x" + tx_hash.hex() if not tx_hash.hex().startswith("0x") else tx_hash.hex()
        }

    def get_attestation(self, attestation_id: str) -> dict or None:
        return self.store.get(attestation_id)

    def list_attestations(self) -> list:
        return self.store.list_all()

    def get_by_wallet(self, wallet: str) -> list:
        return self.store.get_by_wallet(wallet)

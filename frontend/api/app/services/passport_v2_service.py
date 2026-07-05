import os
import json
import uuid
import time
from datetime import datetime, timezone, timedelta
from eth_account import Account
from eth_account.messages import encode_defunct
from hexbytes import HexBytes
from web3 import Web3
from app.database.persistence import read_json, write_json
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.reputation_engine import ReputationEngine
from app.services.badge_engine import BadgeEngine
from app.services.segment_engine import SegmentEngine
from app.adapters.factory import ProtocolProfileEngine, AdapterFactory
from app.services.oracle_attestation_service import OracleAttestationService

CREDIT_PASSPORT_V2_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "passportHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "attestationHash", "type": "bytes32"},
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "string", "name": "metadataURI", "type": "string"},
            {"internalType": "uint256", "name": "expiresAt", "type": "uint256"}
        ],
        "name": "mintPassport",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "oldPassportHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "newPassportHash", "type": "bytes32"},
            {"internalType": "string", "name": "newMetadataURI", "type": "string"},
            {"internalType": "uint256", "name": "newExpiresAt", "type": "uint256"}
        ],
        "name": "refreshPassport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "passportHash", "type": "bytes32"}
        ],
        "name": "verifyPassport",
        "outputs": [
            {"internalType": "bool", "name": "exists", "type": "bool"},
            {"internalType": "bool", "name": "verified", "type": "bool"},
            {"internalType": "bool", "name": "revoked", "type": "bool"},
            {"internalType": "bool", "name": "expired", "type": "bool"},
            {"internalType": "string", "name": "metadataURI", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

DB_FILENAME = "passports_v2.json"

class PassportV2Service:
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
        self.chain_id = 133

        contract_address = os.getenv("CREDIT_PASSPORT_V2_ADDRESS")
        if not contract_address:
            contract_address = "0xFc8cd61D26aF1A419B23F3bA08BE68aF3D9e827a"

        self.contract_address = Web3.to_checksum_address(contract_address)
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=CREDIT_PASSPORT_V2_ABI
        )

    def _build_passport_record(self, wallet_checksum: str) -> dict:
        """
        Runs analysis and compiles the passport metadata without executing transactions.
        """
        # 1. Run credit engines
        analyzer = WalletAnalyzer()
        credit_engine = CreditEngine()
        lending_engine = LendingEngine()
        reputation_engine = ReputationEngine()

        features = analyzer.analyze(wallet_checksum)
        credit_profile = credit_engine.calculate(features)
        lending_profile = lending_engine.evaluate(credit_profile, features)
        
        trust_score = reputation_engine.calculate_trust_score(wallet_checksum)
        badges = BadgeEngine.generate(features)
        segment = SegmentEngine.classify(features)

        # 2. Protocol Profiles
        profile_context = ProtocolProfileEngine.get_protocol_profile(wallet_checksum)
        protocol_profiles = []
        for protocol_type in AdapterFactory.get_supported_protocols():
            adapter = AdapterFactory.get_adapter(protocol_type)
            protocol_profiles.append({
                "protocol": protocol_type,
                "data": adapter.adapt(profile_context)
            })

        # 3. Find/Publish Oracle Underwriting Attestation
        oracle_service = OracleAttestationService()
        attestations = oracle_service.get_by_wallet(wallet_checksum)
        
        if attestations:
            latest_att = attestations[0]
        else:
            from app.services.offer_engine import LoanOfferEngine
            from app.services.signature_engine import SignatureEngine
            offer_engine = LoanOfferEngine()
            sig_engine = SignatureEngine()

            offer = offer_engine.generate_offer(wallet_checksum, credit_profile, lending_profile, features.get("balance"))
            expiry_timestamp = int(offer.expires_at.timestamp())
            
            sig = sig_engine.sign_underwriting_offer(
                wallet=offer.wallet,
                offer_hash=offer.offer_hash,
                credit_score=offer.credit_score,
                approved_amount=offer.approved_amount,
                interest_rate=offer.interest_rate,
                collateral_ratio=offer.collateral_ratio,
                duration_days=offer.duration_days,
                expiry=expiry_timestamp
            )

            att_id = "att_" + str(uuid.uuid4()).replace("-", "")[:16]
            latest_att = oracle_service.publish(
                attestation_id=att_id,
                wallet=offer.wallet,
                offer_id=offer.offer_id,
                offer_hash=offer.offer_hash,
                credit_score=offer.credit_score,
                risk_level=offer.risk_level,
                approved_amount=offer.approved_amount,
                interest_rate=offer.interest_rate,
                collateral_ratio=offer.collateral_ratio,
                duration_days=offer.duration_days,
                issued_at=datetime.now(timezone.utc),
                expires_at=offer.expires_at,
                signature=sig
            )

        oracle_attestation_id = latest_att["attestation_id"]
        attestation_hash = latest_att["attestation_hash"]

        # 4. Generate Metadata identifiers
        passport_id = "cp_v2_" + str(uuid.uuid4()).replace("-", "")[:12]
        issued_at = datetime.now(timezone.utc)
        expires_at = issued_at + timedelta(days=90)

        # Construct raw credential document
        credential_doc = {
            "passport_id": passport_id,
            "wallet": wallet_checksum,
            "credit_score": int(credit_profile.credit_score),
            "trust_score": int(trust_score),
            "risk_level": lending_profile.risk_level,
            "oracle_attestation_id": oracle_attestation_id,
            "issuer": "Credence AI",
            "issued_at": issued_at.isoformat().replace("+00:00", "Z"),
            "expires_at": expires_at.isoformat().replace("+00:00", "Z"),
            "version": "2.0.0"
        }

        # Deterministic passport hash
        serialized_doc = json.dumps(credential_doc, sort_keys=True)
        passport_hash_bytes = Web3.keccak(text=serialized_doc)
        passport_hash = "0x" + passport_hash_bytes.hex()

        # Sign the passport hash to produce the digital verifiable credential signature
        message = encode_defunct(passport_hash_bytes)
        digital_signature = self.account.sign_message(message).signature.hex()
        if not digital_signature.startswith("0x"):
            digital_signature = "0x" + digital_signature

        # Construct metadata URI (dynamic backend endpoint)
        metadata_uri = f"/passport/v2/{wallet_checksum}/credential"

        return {
            "passport_id": passport_id,
            "wallet": wallet_checksum,
            "passport_version": "2.0.0",
            "passport_status": "ACTIVE",
            "credit_score": int(credit_profile.credit_score),
            "trust_score": int(trust_score),
            "risk_level": lending_profile.risk_level,
            "protocol_profiles": protocol_profiles,
            "badges": badges,
            "segments": [segment],
            "oracle_attestation_id": oracle_attestation_id,
            "oracle_verified": True,
            "passport_hash": passport_hash,
            "issued_at": issued_at.isoformat().replace("+00:00", "Z"),
            "expires_at": expires_at.isoformat().replace("+00:00", "Z"),
            "metadata_uri": metadata_uri,
            "signature": digital_signature,
            "attestation_hash": attestation_hash
        }

    def generate_passport(self, wallet: str) -> dict:
        """
        Builds, mints, and saves the new passport registry record.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        record = self._build_passport_record(wallet_checksum)
        
        expires_at_dt = datetime.fromisoformat(record["expires_at"].replace("Z", "+00:00"))
        expires_at_timestamp = int(expires_at_dt.timestamp())

        # Mint standard ERC-721 token reference on-chain
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx_func = self.contract.functions.mintPassport(
            HexBytes(record["passport_hash"]),
            HexBytes(record["attestation_hash"]),
            wallet_checksum,
            record["metadata_uri"],
            expires_at_timestamp
        )

        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 600000

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
            raise RuntimeError("mintPassport transaction reverted on-chain")

        record["mint_tx"] = "0x" + tx_hash.hex() if not tx_hash.hex().startswith("0x") else tx_hash.hex()

        # Save in local database
        data = read_json(DB_FILENAME, {})
        data[wallet_checksum.lower()] = record
        write_json(DB_FILENAME, data)

        return record

    def refresh_passport(self, wallet: str) -> dict:
        """
        Builds new metadata context and updates the active mapping on-chain.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        data = read_json(DB_FILENAME, {})
        old_record = data.get(wallet_checksum.lower())
        if not old_record:
            raise ValueError("Passport not found for this wallet. Generate one first.")

        # Re-generate new record metadata
        new_record = self._build_passport_record(wallet_checksum)

        # Update reference on-chain
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        expires_at_dt = datetime.fromisoformat(new_record["expires_at"].replace("Z", "+00:00"))
        new_expires_timestamp = int(expires_at_dt.timestamp())

        tx_func = self.contract.functions.refreshPassport(
            HexBytes(old_record["passport_hash"]),
            HexBytes(new_record["passport_hash"]),
            new_record["metadata_uri"],
            new_expires_timestamp
        )

        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 600000

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
            raise RuntimeError("refreshPassport transaction reverted on-chain")

        new_record["refresh_tx"] = "0x" + tx_hash.hex() if not tx_hash.hex().startswith("0x") else tx_hash.hex()
        
        # Save updated data
        data[wallet_checksum.lower()] = new_record
        write_json(DB_FILENAME, data)

        return new_record

    def verify_passport(self, passport_hash: str) -> dict:
        """
        Queries verify checks on-chain.
        """
        try:
            exists, verified, revoked, expired, metadata_uri = self.contract.functions.verifyPassport(
                HexBytes(passport_hash)
            ).call()
        except Exception:
            exists, verified, revoked, expired, metadata_uri = False, False, False, False, ""

        return {
            "exists": bool(exists),
            "verified": bool(verified),
            "revoked": bool(revoked),
            "expired": bool(expired),
            "metadata_uri": metadata_uri
        }

    def get_passport_by_wallet(self, wallet: str) -> dict or None:
        wallet_checksum = Web3.to_checksum_address(wallet)
        data = read_json(DB_FILENAME, {})
        return data.get(wallet_checksum.lower())

    def export_credential(self, wallet: str) -> dict:
        """
        Returns a standards-inspired portable Verifiable Credential document (JSON) for ingestion.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        record = self.get_passport_by_wallet(wallet_checksum)
        if not record:
            raise ValueError("Credential passport not found")

        return {
            "context": ["https://www.w3.org/2018/credentials/v1"],
            "type": ["VerifiableCredential", "CreditPassportCredential"],
            "id": record["passport_id"],
            "issuer": "Credence AI",
            "issuanceDate": record["issued_at"],
            "expirationDate": record["expires_at"],
            "credentialSubject": {
                "id": f"did:ethr:{wallet_checksum}",
                "wallet": wallet_checksum,
                "creditScore": record["credit_score"],
                "trustScore": record["trust_score"],
                "riskLevel": record["risk_level"],
                "oracleAttestationId": record["oracle_attestation_id"],
                "passportHash": record["passport_hash"],
                "badges": record["badges"],
                "segments": record["segments"]
            },
            "proof": {
                "type": "JsonWebSignature2020",
                "created": record["issued_at"],
                "proofPurpose": "assertionMethod",
                "verificationMethod": f"did:ethr:{self.oracle_address}",
                "jws": record["signature"]
            }
        }

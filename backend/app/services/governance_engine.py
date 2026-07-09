import os
import json
import uuid
from datetime import datetime, timezone
from web3 import Web3
from app.services.rbac_service import RBACService
from app.services.audit_engine import AuditEngine
from app.database.persistence import read_json, write_json

PROPOSALS_DB = "proposals.json"
ORACLES_DB = "oracles_governance.json"

GOVERNANCE_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "actionHash", "type": "bytes32"},
            {"internalType": "string", "name": "actionType", "type": "string"}
        ],
        "name": "recordAction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class GovernanceEngine:
    def __init__(self):
        self.rbac = RBACService()
        self.audit = AuditEngine()

        # Connect web3
        hsk_rpc = os.getenv("HSK_RPC")
        if not hsk_rpc:
            raise ValueError("HSK_RPC environment variable is required")
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)
        
        pk = os.getenv("PRIVATE_KEY")
        if not pk:
            raise ValueError("PRIVATE_KEY environment variable is required")
        if not pk.startswith("0x"):
            pk = "0x" + pk
        self.account = self.w3.eth.account.from_key(pk)

        gov_address = os.getenv("GOVERNANCE_REGISTRY_ADDRESS")
        self.contract = None
        if gov_address:
            self.gov_address = Web3.to_checksum_address(gov_address)
            self.contract = self.w3.eth.contract(address=self.gov_address, abi=GOVERNANCE_ABI)

    def _record_proof_onchain(self, action_hash_hex: str, action_type: str):
        if not self.contract:
            return None
        try:
            action_hash = Web3.to_bytes(hexstr=action_hash_hex)
            
            # Verify the contract exists on-chain before attempting tx
            code = self.w3.eth.get_code(self.gov_address)
            if code == b'' or code == b'\x00':
                # Contract not deployed at this address on mainnet
                return None
            
            # Send transaction
            tx = self.contract.functions.recordAction(action_hash, action_type).build_transaction({
                "from": self.account.address,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
                "gas": 200000,
                "gasPrice": self.w3.eth.gas_price,
                "chainId": 177
            })

            signed = self.w3.eth.account.sign_transaction(tx, private_key=self.account.key)
            tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
            return "0x" + tx_hash.hex()
        except Exception as e:
            # Don't block governance actions if on-chain proof fails
            print(f"[GovernanceEngine] On-chain proof recording failed (non-blocking): {e}")
            return None

    def approve_oracle(self, actor: str, oracle_address: str) -> dict:
        if not self.rbac.has_permission(actor, "APPROVE_ORACLE"):
            raise PermissionError("Unauthorized to approve oracle")

        # Save to database
        db = read_json(ORACLES_DB, {})
        db[oracle_address.lower()] = "ACTIVE"
        write_json(ORACLES_DB, db)

        # Audit
        action_hash = Web3.keccak(text=f"{oracle_address}_ACTIVE").hex()
        tx = self._record_proof_onchain(action_hash, "ORACLE_APPROVAL")
        
        self.audit.record_event(
            action="APPROVE_ORACLE",
            performed_by=actor,
            resource=oracle_address,
            result=f"Oracle set to ACTIVE. Proof TX: {tx}"
        )

        return {"oracle": oracle_address, "status": "ACTIVE", "tx_hash": tx}

    def revoke_oracle(self, actor: str, oracle_address: str) -> dict:
        if not self.rbac.has_permission(actor, "REVOKE_ORACLE"):
            raise PermissionError("Unauthorized to revoke oracle")

        db = read_json(ORACLES_DB, {})
        db[oracle_address.lower()] = "REVOKED"
        write_json(ORACLES_DB, db)

        action_hash = Web3.keccak(text=f"{oracle_address}_REVOKED").hex()
        tx = self._record_proof_onchain(action_hash, "ORACLE_REVOCATION")

        self.audit.record_event(
            action="REVOKE_ORACLE",
            performed_by=actor,
            resource=oracle_address,
            result=f"Oracle set to REVOKED. Proof TX: {tx}"
        )

        return {"oracle": oracle_address, "status": "REVOKED", "tx_hash": tx}

    # Proposals Lifecycle Workflows
    def create_proposal(self, actor: str, title: str, type: str) -> dict:
        prop_id = f"gov_{uuid.uuid4().hex[:12]}"
        proposal = {
            "proposal_id": prop_id,
            "title": title,
            "type": type,
            "status": "UNDER_REVIEW",
            "submitted_by": actor,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        data = read_json(PROPOSALS_DB, [])
        data.append(proposal)
        write_json(PROPOSALS_DB, data)

        self.audit.record_event(
            action="CREATE_PROPOSAL",
            performed_by=actor,
            resource=prop_id,
            result="Proposal submitted and status set to UNDER_REVIEW"
        )
        return proposal

    def list_proposals(self) -> list:
        return read_json(PROPOSALS_DB, [])

    def approve_proposal(self, actor: str, proposal_id: str) -> dict:
        data = read_json(PROPOSALS_DB, [])
        found = False
        for p in data:
            if p["proposal_id"] == proposal_id:
                p["status"] = "APPROVED"
                found = True
                break

        if found:
            write_json(PROPOSALS_DB, data)

        self.audit.record_event(
            action="APPROVE_PROPOSAL",
            performed_by=actor,
            resource=proposal_id,
            result="Proposal marked as APPROVED"
        )
        return {"proposal_id": proposal_id, "status": "APPROVED"}

    def execute_proposal(self, actor: str, proposal_id: str) -> dict:
        data = read_json(PROPOSALS_DB, [])
        found = False
        for p in data:
            if p["proposal_id"] == proposal_id:
                p["status"] = "EXECUTED"
                found = True
                
                # Verify protocol consumer application if proposal is PROTOCOL type
                if p.get("type") == "PROTOCOL":
                    import re
                    match = re.search(r"Authorize protocol consumer application: (.+) \(", p["title"])
                    if match:
                        protocol_name = match.group(1)
                        protocols_db = read_json("registered_protocols.json", {})
                        key = protocol_name.lower().replace(" ", "_")
                        if key in protocols_db:
                            protocols_db[key]["verified"] = True
                            write_json("registered_protocols.json", protocols_db)
                            
                break

        if found:
            write_json(PROPOSALS_DB, data)

        self.audit.record_event(
            action="EXECUTE_PROPOSAL",
            performed_by=actor,
            resource=proposal_id,
            result="Proposal marked as EXECUTED"
        )
        return {"proposal_id": proposal_id, "status": "EXECUTED"}

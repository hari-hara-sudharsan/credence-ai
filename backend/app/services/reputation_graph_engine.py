from web3 import Web3
from datetime import datetime, timezone
from app.services.verification_network import VerificationNetwork
from app.services.passport_v2_service import PassportV2Service
from app.services.oracle_attestation_service import OracleAttestationService

class ReputationGraphEngine:
    def __init__(self):
        pass

    def build_graph(self, wallet: str) -> dict:
        """
        Gathers nodes and edges associated with a wallet's reputation context.
        """
        checksum_w = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        val = vn.get_verification_by_wallet(checksum_w)
        if not val:
            val = vn.verify_wallet(checksum_w)

        score = val["credit_score"]
        trust = val["trust_score"]

        # 1. Base Nodes
        nodes = [
            {
                "node_id": checksum_w.lower(),
                "node_type": "WALLET",
                "label": f"Wallet ({checksum_w[:6]}...{checksum_w[-4:]})",
                "trust_score": trust,
                "metadata": {"credit_score": score, "risk": val["risk_level"]}
            },
            {
                "node_id": "protocol_hashkey_lending",
                "node_type": "PROTOCOL",
                "label": "HashKey Lending",
                "trust_score": 95,
                "metadata": {"type": "MoneyMarket"}
            }
        ]

        edges = [
            {
                "source": checksum_w.lower(),
                "target": "protocol_hashkey_lending",
                "relationship": "USED_PROTOCOL",
                "strength": int(trust * 0.95),
                "created_at": datetime.now(timezone.utc)
            }
        ]

        # 2. Add Passport Node
        passport_id = val.get("passport_id")
        if passport_id:
            passport_node_id = f"passport_{passport_id}"
            nodes.append({
                "node_id": passport_node_id,
                "node_type": "PASSPORT",
                "label": f"Passport V2 ({passport_id[:8]})",
                "trust_score": trust,
                "metadata": {"seal": val.get("badge", "BRONZE")}
            })
            edges.append({
                "source": checksum_w.lower(),
                "target": passport_node_id,
                "relationship": "OWNS_PASSPORT",
                "strength": 100,
                "created_at": datetime.now(timezone.utc)
            })

        # 3. Add Attestation Node
        att_id = val.get("attestation_id")
        if att_id:
            att_node_id = f"att_{att_id}"
            nodes.append({
                "node_id": att_node_id,
                "node_type": "ATTESTATION",
                "label": "EIP-712 Attestation",
                "trust_score": 90,
                "metadata": {"attestation_id": att_id}
            })
            edges.append({
                "source": checksum_w.lower(),
                "target": att_node_id,
                "relationship": "HAS_ATTESTATION",
                "strength": 90,
                "created_at": datetime.now(timezone.utc)
            })

        # 4. Add real active loans from on-chain LoanManager
        try:
            from app.contracts.loan_reader import LoanReader
            reader = LoanReader()
            active_loans = reader.get_active_loans(checksum_w)
            for i, loan in enumerate(active_loans):
                loan_node_id = f"loan_{loan['loan_id']}"
                nodes.append({
                    "node_id": loan_node_id,
                    "node_type": "LOAN",
                    "label": f"Loan ({loan['loan_id'][:8]}...)",
                    "trust_score": int(trust * 0.90),
                    "metadata": {"principal": loan["amount"], "status": "ACTIVE", "loan_id": loan["loan_id"]}
                })
                edges.append({
                    "source": checksum_w.lower(),
                    "target": loan_node_id,
                    "relationship": "BORROWED_FROM",
                    "strength": 85,
                    "created_at": datetime.now(timezone.utc)
                })

            # Also add repaid loans as positive reputation indicators
            completed_loans = reader.get_completed_loans(checksum_w)
            for loan in completed_loans:
                loan_node_id = f"loan_{loan['loan_id']}_repaid"
                nodes.append({
                    "node_id": loan_node_id,
                    "node_type": "REPAID_LOAN",
                    "label": f"Repaid ({loan['loan_id'][:8]}...)",
                    "trust_score": int(trust * 0.98),
                    "metadata": {"principal": loan["amount"], "status": "REPAID", "loan_id": loan["loan_id"]}
                })
                edges.append({
                    "source": checksum_w.lower(),
                    "target": loan_node_id,
                    "relationship": "SUCCESSFULLY_REPAID",
                    "strength": 95,
                    "created_at": datetime.now(timezone.utc)
                })
        except Exception:
            pass  # LoanReader not available — skip loan nodes

        # calculate network score
        net_score = self.calculate_network_score(wallet, trust, len(edges))

        return {
            "wallet": checksum_w,
            "nodes": nodes,
            "edges": edges,
            "network_score": net_score
        }

    def add_relationship(self, source: str, target: str, relationship: str, strength: int):
        pass

    def get_wallet_network(self, wallet: str) -> dict:
        return self.build_graph(wallet)

    def calculate_network_score(self, wallet: str, trust_score: int, edge_count: int) -> int:
        """
        Formulates network score propagation based on trust index,
        number of interaction edges, and clean repayment records.
        """
        base = trust_score
        # Increment score based on connections count
        bonus = min(edge_count * 3, 10)
        return min(base + bonus, 100)
ZOOM_OFFSET = 1.2

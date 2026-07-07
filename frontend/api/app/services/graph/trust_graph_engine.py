import time
import json
from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.trust.trust_receipt_engine import TrustReceiptEngine
from app.database.persistence import read_json

class HashKeyTrustGraph:
    def __init__(self):
        self.identity_engine = FinancialIdentityEngine()
        self.receipts_engine = TrustReceiptEngine()

    def build_graph(self, wallet: str) -> dict:
        """
        Builds the trust graph model including node classes and edge relations.
        """
        wallet = wallet.lower()
        identity = self.identity_engine.generate_identity(wallet)
        dna = identity.get("financialDNA", {})
        trust_score = dna.get("trust", 600)
        entity_type = identity.get("type", "HUMAN")
        
        # Node Type Classification
        node_type = "WALLET"
        if entity_type == "AI_AGENT":
            node_type = "AI_AGENT"
        elif entity_type == "DAO":
            node_type = "DAO"
        elif entity_type == "BUSINESS":
            node_type = "BUSINESS"
        elif entity_type == "INSTITUTION":
            node_type = "INSTITUTION"

        # Center node
        nodes = [{
            "id": wallet,
            "type": node_type,
            "trustScore": trust_score,
            "connections": 0
        }]
        edges = []

        # Connect active verified receipts
        receipts = self.receipts_engine.get_wallet_receipts(wallet)
        for r in receipts:
            action = r.get("actionType", "")
            impact = r.get("trustImpact", "+0")
            
            edge_type = "TRUST_VERIFIED"
            target_node = "EcosystemRegistry"
            
            if action == "LOAN_REPAID":
                edge_type = "LOAN_REPAID"
                target_node = "LendingProtocol"
            elif action == "LOAN_DEFAULTED":
                edge_type = "LOAN_DEFAULTED"
                target_node = "ReputationManager"
            elif action == "HSP_SETTLEMENT":
                edge_type = "HSP_SETTLED"
                target_node = "SettlementPool"
            elif action == "PASSPORT_CREATED":
                edge_type = "TRUST_VERIFIED"
                target_node = "IdentityRegistry"
                
            if not any(n["id"] == target_node for n in nodes):
                nodes.append({
                    "id": target_node,
                    "type": "PROTOCOL" if "Protocol" in target_node or "Pool" in target_node else "INSTITUTION",
                    "trustScore": 950,
                    "connections": 100
                })
                
            edges.append({
                "from": wallet,
                "to": target_node,
                "type": edge_type,
                "trustImpact": str(impact)
            })

        # Connect active P2P loans
        try:
            loans = read_json("p2p_loans.json", {})
            for loan_id, l in loans.items():
                if l.get("borrower") == wallet:
                    lender = l.get("lender")
                    target = lender.lower() if lender else "LendingProtocol"
                    
                    if target != "LendingProtocol" and not any(n["id"] == target for n in nodes):
                        nodes.append({
                            "id": target,
                            "type": "LENDER" if lender else "PROTOCOL",
                            "trustScore": 750,
                            "connections": 15
                        })
                        
                    edges.append({
                        "from": wallet,
                        "to": target,
                        "type": "LOAN_CREATED" if l.get("status") == "REQUESTED" else "CAPITAL_PROVIDED",
                        "trustImpact": "+10"
                    })
        except Exception:
            pass

        # Update node connections count
        for n in nodes:
            n_id = n["id"]
            conn_count = sum(1 for e in edges if e["from"] == n_id or e["to"] == n_id)
            n["connections"] = conn_count

        return {
            "nodes": nodes,
            "edges": edges,
            "trustScore": trust_score
        }

    def analyze_relationship(self, from_node: str, to_node: str) -> dict:
        """
        Determines direct trust relationship parameters between two nodes.
        """
        from_node = from_node.lower()
        to_node = to_node.lower()
        graph = self.build_graph(from_node)
        
        edges = [e for e in graph["edges"] if (e["from"] == from_node and e["to"] == to_node) or (e["from"] == to_node and e["to"] == from_node)]
        if edges:
            return {
                "connected": True,
                "relationship": edges[0]["type"],
                "trustImpact": edges[0]["trustImpact"]
            }
            
        return {
            "connected": False,
            "relationship": "NONE",
            "trustImpact": "0"
        }

    def calculate_network_trust(self, wallet: str) -> int:
        """
        Computes aggregated trust score across active connections.
        """
        wallet = wallet.lower()
        graph = self.build_graph(wallet)
        scores = [n["trustScore"] for n in graph["nodes"]]
        if not scores:
            return 600
        return int(sum(scores) / len(scores))

    def detect_trust_clusters(self, wallet: str) -> list:
        """
        Identifies density grouping of trust nodes by category type.
        """
        wallet = wallet.lower()
        graph = self.build_graph(wallet)
        clusters = {}
        for n in graph["nodes"]:
            t = n["type"]
            clusters[t] = clusters.get(t, 0) + 1
        return [{"type": k, "count": v} for k, v in clusters.items()]

    def detect_risk_propagation(self, wallet: str) -> dict:
        """
        Scans graph for low trust nodes and traces risk propagation.
        """
        wallet = wallet.lower()
        graph = self.build_graph(wallet)
        risky = []
        for n in graph["nodes"]:
            if n["id"] != wallet and n["trustScore"] < 500:
                risky.append(n["id"])
                
        risk_level = "LOW"
        reason = "All connected nodes maintain high trust ratings."
        rec = "Maintain standard capital exposure."
        
        if risky:
            risk_level = "MEDIUM" if len(risky) < 3 else "HIGH"
            reason = f"Connected wallet {risky[0]} has defaults or low trust score."
            rec = "Increase collateral requirements and lower lending caps."
            
        return {
            "risk": risk_level,
            "reason": reason,
            "recommendation": rec,
            "affectedNodes": risky
        }

    def generate_graph_insights(self, wallet: str) -> dict:
        """
        Compiles rank standing, risk analysis, and opportunities.
        """
        wallet = wallet.lower()
        net_trust = self.calculate_network_trust(wallet)
        risk = self.detect_risk_propagation(wallet)
        
        rank = "Top 10% Trusted"
        if net_trust >= 800:
            rank = "Top 3% Trusted"
        elif net_trust < 500:
            rank = "Watchlist / High Risk"
            
        opps = []
        if net_trust >= 600:
            opps.append("Prime Lending")
            opps.append("RWA Access")
        else:
            opps.append("Collateralized Pool Loans")
            
        return {
            "rank": rank,
            "opportunities": opps,
            "networkTrustIndex": net_trust,
            "riskPropagation": risk
        }

    def calculate_trust_propagation(self, wallet: str, action: str) -> dict:
        """
        Computes direct vs network propagation trust impact.
        """
        wallet = wallet.lower()
        direct = "+50"
        network_val = "+15"
        
        if action == "REPAYMENT":
            direct = "+80"
            network_val = "+25"
        elif action == "DEFAULT":
            direct = "-150"
            network_val = "-50"
            
        return {
            "event": action,
            "directImpact": direct,
            "networkImpact": network_val
        }

    def detect_network_risk(self, wallet: str) -> dict:
        """
        Alias for risk propagation interface.
        """
        return self.detect_risk_propagation(wallet)

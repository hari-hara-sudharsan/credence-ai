"""
TrustGraph Engine — Programmable Trust Network Analysis for HashKey Ecosystem.
Analyzes relationships, default risks, and multi-protocol scores dynamically.
"""
from typing import List, Dict, Any
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.reputation_engine import ReputationEngine
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

class TrustGraphEngine:
    def __init__(self):
        self.analyzer = WalletAnalyzer()
        self.underwriting_engine = TransparentUnderwritingEngine()
        self.reputation_engine = ReputationEngine()

    def generate_trust_graph(self, wallet: str) -> dict:
        """
        Generates nodes and edges representing the participant's Trust Graph inside the HashKey Ecosystem.
        """
        report = self.underwriting_engine.generate_credit_report(wallet)
        score = report.credit_score
        
        # Calculate relationships health
        lending_health = min(int(score * 0.12), 100)
        payments_health = min(int(score * 0.11), 100)
        rwa_health = min(int(score * 0.115), 100)
        dao_health = min(int(score * 0.10), 100)

        nodes = [
            {"id": "Wallet", "label": wallet[:8] + "...", "type": "wallet", "score": score},
            {"id": "Passport", "label": "Financial Passport", "type": "passport", "status": "ACTIVE"},
            {"id": "Lending", "label": "Lending Pool", "type": "protocol", "health": lending_health},
            {"id": "HSP", "label": "HSP Settlements", "type": "settlement", "health": payments_health},
            {"id": "RWA", "label": "RWA Tokenization", "type": "protocol", "health": rwa_health},
            {"id": "DAO", "label": "DAO Treasury", "type": "protocol", "health": dao_health}
        ]

        edges = [
            {"source": "Wallet", "target": "Passport", "relationship": "owns"},
            {"source": "Passport", "target": "Lending", "relationship": "interacts"},
            {"source": "Passport", "target": "HSP", "relationship": "settles"},
            {"source": "Passport", "target": "RWA", "relationship": "collateralizes"},
            {"source": "Passport", "target": "DAO", "relationship": "votes"}
        ]

        return {
            "entity": wallet,
            "trust_score": score,
            "identity": self.generate_financial_identity(score),
            "nodes": nodes,
            "edges": edges,
            "relationships": [
                {"protocol": "Lending", "health": lending_health},
                {"protocol": "Payments", "health": payments_health},
                {"protocol": "RWA", "health": rwa_health},
                {"protocol": "DAO", "health": dao_health}
            ],
            "opportunities": self._get_opportunities(score)
        }

    def calculate_network_reputation(self, wallet: str) -> dict:
        """
        Calculates aggregated network-wide reputation metrics.
        """
        report = self.underwriting_engine.generate_credit_report(wallet)
        score = report.credit_score
        
        return {
            "score": score,
            "repayments": 15 if score > 700 else 5 if score > 500 else 1,
            "defaults": 0 if score > 450 else 1,
            "history": "EXCELLENT" if score > 750 else "GOOD" if score > 600 else "FAIR" if score > 450 else "POOR"
        }

    def analyze_protocol_relationship(self, wallet: str, protocol: str) -> dict:
        """
        Analyzes relationship metrics between a wallet and a specific protocol.
        """
        report = self.underwriting_engine.generate_credit_report(wallet)
        score = report.credit_score
        health = min(int(score * 0.11), 100)
        return {
            "wallet": wallet,
            "protocol": protocol,
            "health_index": health,
            "status": "STRONG" if health > 80 else "STABLE" if health > 50 else "VULNERABLE"
        }

    def generate_financial_identity(self, score: int) -> str:
        """
        Classifies the financial participant identity.
        """
        if score >= 800:
            return "Institutional Trust Participant"
        elif score >= 700:
            return "Prime Participant"
        elif score >= 600:
            return "Trusted Protocol User"
        elif score >= 450:
            return "Retail Participant"
        else:
            return "Watchlist / High Risk User"

    def _get_opportunities(self, score: int) -> List[str]:
        if score >= 800:
            return ["Lower interest lending", "Institutional access", "Zero-collateral borrowing"]
        elif score >= 650:
            return ["Lower interest lending", "Standard DeFi access"]
        else:
            return ["DeFi collateraled access only", "Build score via HSP settlements"]

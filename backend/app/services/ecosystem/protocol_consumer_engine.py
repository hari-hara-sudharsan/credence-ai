import time
from app.services.reputation_engine import ReputationEngine
from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.signature_engine import SignatureEngine
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine
from web3 import Web3

class ProtocolConsumerEngine:
    def __init__(self):
        self.rep_engine = ReputationEngine()
        self.identity_engine = FinancialIdentityEngine()
        self.signature_engine = SignatureEngine()
        self.underwriting = TransparentUnderwritingEngine()

    def verifyTrustForProtocol(self, wallet: str, protocol_type: str) -> dict:
        """
        Verifies general trust for a protocol.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        report = self.underwriting.generate_credit_report(wallet_checksum)
        score = int(report.credit_score) if report and report.credit_score else 600
        
        tier = self.calculateAccessLevel(wallet_checksum, score)
        approved = score >= 450
        reason = "Verified trust history" if approved else "Insufficient trust score standing"
        
        return {
            "approved": approved,
            "score": score,
            "tier": tier,
            "reason": reason
        }

    def generateProtocolDecision(self, wallet: str, protocol_type: str) -> dict:
        """
        Generates protocol decision with risk-adjusted terms and oracle signature proof.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        report = self.underwriting.generate_credit_report(wallet_checksum)
        score = int(report.credit_score) if report and report.credit_score else 600
            
        # Access evaluation rules
        if score >= 700:
            decision = "APPROVED"
            limit = 10000 if protocol_type.upper() == "LENDING" else 5000
            interest = 5.0
            collateral = 20.0
        elif score >= 450:
            decision = "ADJUST_TERMS"
            limit = 1000 if protocol_type.upper() == "LENDING" else 1000
            interest = 15.0
            collateral = 80.0
        else:
            decision = "REJECTED"
            limit = 0 if protocol_type.upper() == "LENDING" else 100
            interest = 25.0
            collateral = 150.0

        timestamp = int(time.time())
        
        # Oracle Signature Generation for On-chain verification
        signature = self.signature_engine.sign_protocol_decision(
            wallet=wallet_checksum,
            application=protocol_type.upper(),
            trust_score=score,
            limit=limit,
            timestamp=timestamp
        )

        return {
            "decision": decision,
            "trustScore": score,
            "terms": {
                "limit": limit,
                "interest": interest,
                "collateral": collateral
            },
            "proof": {
                "decisionHash": Web3.solidity_keccak(
                    ["address", "string", "uint256", "uint256", "uint256"],
                    [wallet_checksum, protocol_type.upper(), score, limit, timestamp]
                ).hex(),
                "timestamp": timestamp,
                "signature": signature
            }
        }

    def calculateAccessLevel(self, wallet: str, score: int) -> str:
        """
        Calculates user tier based on score.
        """
        if score >= 700:
            return "PRIME"
        elif score >= 450:
            return "STANDARD"
        else:
            return "SUBPRIME"

    def simulateProtocolUsage(self, wallet: str, protocol_type: str, action: str) -> bool:
        """
        Simulates custom usage events.
        """
        return True

    # Python aliases
    verify_trust_for_protocol = verifyTrustForProtocol
    generate_protocol_decision = generateProtocolDecision
    calculate_access_level = calculateAccessLevel
    simulate_protocol_usage = simulateProtocolUsage

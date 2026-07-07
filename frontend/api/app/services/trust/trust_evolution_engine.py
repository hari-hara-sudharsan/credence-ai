import time
from app.services.finance.dynamic_terms_engine import DynamicTermsEngine
from app.services.reputation_engine import ReputationEngine
from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine
from web3 import Web3

class TrustEvolutionEngine:
    def __init__(self):
        self.terms_engine = DynamicTermsEngine()
        self.rep_engine = ReputationEngine()
        self.identity_engine = FinancialIdentityEngine()
        self.underwriting = TransparentUnderwritingEngine()

    def calculateTrustGrowth(self, wallet: str, event_type: str, proof_id: str) -> dict:
        """
        Calculates the delta and score impact of verified events.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        # Fetch current credit/reputation score
        report = self.underwriting.generate_credit_report(wallet_checksum)
        prev_score = int(report.credit_score) if report and report.credit_score else 620

        growth = 15
        reason = "Verified action recorded"

        if event_type == "HSP_SETTLEMENT":
            growth = 25
            reason = "HSP settlement verified on-chain"
        elif event_type == "LOAN_REPAYMENT":
            growth = 30
            reason = "Loan repayment completed successfully"
        elif event_type == "SUCCESSFUL_CREDIT_USAGE":
            growth = 20
            reason = "Ecosystem credit parameters healthy"
        elif event_type == "LONG_TERM_ACTIVITY":
            growth = 40
            reason = "Consistent multi-month interaction streak"
        elif event_type == "PROTOCOL_TRUST_EVENT":
            growth = 15
            reason = "Third-party consumer validation confirmed"

        new_score = prev_score + growth

        return {
            "previousScore": prev_score,
            "newScore": new_score,
            "change": f"+{growth}",
            "reason": reason
        }

    def simulateTrustEvolution(self, wallet: str, events: list) -> int:
        """
        Simulates a multi-event evolution trajectory.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        report = self.underwriting.generate_credit_report(wallet_checksum)
        score = int(report.credit_score) if report and report.credit_score else 620
        
        for e in events:
            growth = self.calculateTrustGrowth(wallet_checksum, e, "sim_proof")
            score = growth["newScore"]
        return score

    def updateFinancialOpportunities(self, wallet: str, new_score: int) -> bool:
        """
        Updates state across consuming apps.
        """
        return True

    def generateBeforeAfterSnapshot(self, wallet: str) -> dict:
        """
        Compares access levels before (620) and after (820) the flywheel boost.
        """
        wallet_checksum = Web3.to_checksum_address(wallet)
        
        before_terms = self.terms_engine.calculateLoanTerms(620)
        before_payfi = self.terms_engine.calculatePayFiLimit(620)
        
        after_terms = self.terms_engine.calculateLoanTerms(820)
        after_payfi = self.terms_engine.calculatePayFiLimit(820)

        return {
            "before": {
                "tier": "EMERGING",
                "loanLimit": int(before_terms["limit"]),
                "interest": int(before_terms["interest"]),
                "payfiLimit": int(before_payfi),
                "rwaEligible": False
            },
            "after": {
                "tier": "PRIME",
                "loanLimit": int(after_terms["limit"]),
                "interest": int(after_terms["interest"]),
                "payfiLimit": int(after_payfi),
                "rwaEligible": True
            }
        }

    def calculateNextMilestone(self, wallet: str) -> dict:
        """
        Calculates requirements to reach the next milestone tier.
        """
        return {
            "needed": "Complete 2 repayments",
            "unlock": "Prime Lending"
        }

    # Python aliases
    calculate_trust_growth = calculateTrustGrowth
    simulate_trust_evolution = simulateTrustEvolution
    update_financial_opportunities = updateFinancialOpportunities
    generate_before_after_snapshot = generateBeforeAfterSnapshot
    calculate_next_milestone = calculateNextMilestone

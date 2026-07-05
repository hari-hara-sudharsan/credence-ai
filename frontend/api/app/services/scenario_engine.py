import time
from app.services.wallet_collector import WalletCollector
from app.services.credit_engine import CreditEngine
from app.services.verification_network import VerificationNetwork
from app.services.policy_engine import PolicyEngine
from app.services.wallet_analyzer import WalletAnalyzer
from app.models.lending_engine import LendingEngine
from app.services.offer_engine import LoanOfferEngine
from app.services.ai_agent_engine import AIFinancialAgent
from app.services.optimization_engine import CreditOptimizationEngine


class ScenarioEngine:
    def __init__(self):
        self.collector = WalletCollector()
        self.credit = CreditEngine()
        self.uvn = VerificationNetwork()
        self.policy = PolicyEngine()
        self.agent = AIFinancialAgent()
        self.optimizer = CreditOptimizationEngine()
        self.loan = LoanOfferEngine()
        self.analyzer = WalletAnalyzer()
        self.lending = LendingEngine()

        # Self-heal register default policy
        try:
            from app.database.persistence import read_json, write_json
            data = read_json("policies.json", {})
            data["prime_borrower_check"] = {
                "policy_id": "prime_borrower_check",
                "policy_name": "Prime Borrower Eligibility",
                "protocol": "LENDING",
                "version": "1.0.0",
                "rules": [
                    {"field": "credit_score", "operator": "GREATER_THAN", "value": 600}
                ],
                "created_at": "2026-07-01T00:00:00Z"
            }
            write_json("policies.json", data)
        except Exception:
            pass






    def borrower_flow(self, wallet: str) -> list:
        steps = []
        wallet_lower = wallet.lower()

        # Step 1: Connect Wallet
        start = time.time()
        steps.append({
            "step_id": "b_1",
            "service": "Wallet Connector",
            "input": {"wallet": wallet_lower},
            "output": {"connected": True, "address": wallet_lower},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 2: Analyze Wallet
        start = time.time()
        raw_wallet = self.collector.collect(wallet_lower)
        info = {
            "wallet": raw_wallet.wallet,
            "balance": raw_wallet.balance,
            "tx_count": raw_wallet.tx_count,
            "first_tx_timestamp": raw_wallet.first_tx_timestamp
        }
        steps.append({
            "step_id": "b_2",
            "service": "Wallet Collector",
            "input": {"wallet": wallet_lower},
            "output": info,
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })


        # Step 3: Generate Score
        start = time.time()
        features = self.analyzer.analyze(wallet_lower)
        profile = self.credit.calculate(features)
        score = profile.credit_score
        steps.append({
            "step_id": "b_3",
            "service": "Credit Engine",
            "input": {"wallet": wallet_lower},
            "output": {"credit_score": score},

            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 4: Create Passport
        start = time.time()
        passport = self.uvn.verify_wallet(wallet_lower)

        steps.append({
            "step_id": "b_4",
            "service": "Universal Verification Network",
            "input": {"wallet": wallet_lower},
            "output": passport,
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 5: Receive Loan Offer
        start = time.time()
        features = self.analyzer.analyze(wallet_lower)
        profile = self.credit.calculate(features)
        lending_profile = self.lending.evaluate(profile, features)
        offer = self.loan.generate_offer(
            wallet=wallet_lower,
            credit_profile=profile,
            lending_profile=lending_profile,
            balance=features.get("balance")
        )
        steps.append({
            "step_id": "b_5",
            "service": "Loan Offer Engine",
            "input": {"wallet": wallet_lower},
            "output": {"offer_hash": offer.offer_hash, "approved": offer.approved, "approved_amount": offer.approved_amount},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })


        # Step 6: AI Recommendation
        start = time.time()
        decision = self.agent.answer(wallet_lower, "BORROWER", "What is my credit standing?")
        steps.append({
            "step_id": "b_6",
            "service": "AI Agent Network",
            "input": {"wallet": wallet_lower},
            "output": decision,
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })


        # Step 7: Improve Reputation
        start = time.time()
        plan = self.optimizer.generate_plan(wallet_lower)
        steps.append({
            "step_id": "b_7",
            "service": "Credit Optimization Engine",
            "input": {"wallet": wallet_lower},
            "output": {"checklist": plan.get("actions", [])},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })


        return steps

    def protocol_flow(self, wallet: str) -> list:
        steps = []
        wallet_lower = wallet.lower()

        # Step 1: Protocol Requests Verification
        start = time.time()
        steps.append({
            "step_id": "p_1",
            "service": "Protocol Interface",
            "input": {"wallet": wallet_lower, "protocol": "AaveV3"},
            "output": {"requested": True},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 2: Credence API Called
        start = time.time()
        steps.append({
            "step_id": "p_2",
            "service": "Verification Gate",
            "input": {"wallet": wallet_lower},
            "output": {"status": "CALLING_ORACLES"},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 3: Oracle Verified
        start = time.time()
        verified = self.uvn.verify_wallet(wallet_lower)
        steps.append({
            "step_id": "p_3",
            "service": "Oracle Verification Network",
            "input": {"wallet": wallet_lower},
            "output": {"verified": True, "attestation_id": verified.get("verification_id") or verified.get("verification_hash")},

            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 4: Policy Executed
        start = time.time()
        decision = self.policy.evaluate_policy(wallet_lower, "prime_borrower_check")
        steps.append({
            "step_id": "p_4",
            "service": "Policy Engine",
            "input": {"wallet": wallet_lower, "policy_id": "prime_borrower_check"},
            "output": decision,
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        return steps

    def institution_flow(self, wallet: str) -> list:
        steps = []
        wallet_lower = wallet.lower()

        # Step 1: Portfolio Imported
        start = time.time()
        steps.append({
            "step_id": "i_1",
            "service": "Institutional Portal",
            "input": {"portfolio_wallets": [wallet_lower]},
            "output": {"imported_count": 1, "wallets": [wallet_lower]},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 2: Risk Analysis
        start = time.time()
        features = self.analyzer.analyze(wallet_lower)
        profile = self.credit.calculate(features)
        score = profile.credit_score
        segment = "STANDARD"
        if score > 750:
            segment = "PRIME"
        elif score > 680:
            segment = "TRUSTED"
        elif score < 500:
            segment = "HIGH_RISK"


        steps.append({
            "step_id": "i_2",
            "service": "Risk Intelligence Engine",
            "input": {"wallet": wallet_lower},
            "output": {"risk_segment": segment, "score": score},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 3: Exposure Check
        start = time.time()
        steps.append({
            "step_id": "i_3",
            "service": "Exposure Intelligence Engine",
            "input": {"wallet": wallet_lower},
            "output": {"exposure_limit": 500000.0, "current_borrowed": 125000.0, "exposure_safe": True},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })

        # Step 4: AI Report
        start = time.time()
        decision = self.agent.answer(wallet_lower, "LENDER", "Generate portfolio risk evaluation report.")
        steps.append({
            "step_id": "i_4",
            "service": "Institutional AI Agent",
            "input": {"wallet": wallet_lower},
            "output": {"report": decision.get("explanation") or decision.get("message")},
            "success": True,
            "execution_time": round((time.time() - start) * 1000, 2)
        })


        return steps

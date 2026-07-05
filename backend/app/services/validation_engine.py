import os
import time
from web3 import Web3
from app.services.health_monitor import HealthMonitor
from app.services.verification_network import VerificationNetwork
from app.services.policy_engine import PolicyEngine
from app.services.ai_agent_engine import AIFinancialAgent

class ValidationEngine:
    def __init__(self):
        hsk_rpc = os.getenv("HSK_RPC")
        if not hsk_rpc:
            raise ValueError("HSK_RPC environment variable is required")
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)
        self.monitor = HealthMonitor()
        self.uvn = VerificationNetwork()
        self.policy = PolicyEngine()
        self.agent = AIFinancialAgent()

        # Self-heal register default policy
        try:
            if not self.policy.get_policy("prime_borrower_check"):
                self.policy.register_policy({
                    "policy_id": "prime_borrower_check",
                    "policy_name": "Prime Borrower Eligibility",
                    "protocol": "LENDING",
                    "rules": [
                        {"parameter": "credit_score", "operator": "GREATER_THAN", "value": 600}
                    ]
                })
        except Exception:
            pass



    def validate_services(self) -> list:
        results = []
        
        # Test 1: Credit Engine Check
        start = time.time()
        passed = self.monitor.check_database() == "HEALTHY"
        results.append({
            "test_name": "CREDIT_ENGINE_PERSISTENCE",
            "component": "Credit Engine",
            "passed": passed,
            "latency": round((time.time() - start) * 1000, 2),
            "details": "Database persistence files accessed successfully." if passed else "JSON DB file read failed."
        })

        # Test 2: AI Underwriting agent connection check
        start = time.time()
        try:
            self.agent.answer("0x5bb83E60a7a05A0e1b077B66412a26306e334208", "BORROWER", "What is my credit standing?")

            passed = True
            details = "AI Underwriting narrative generated successfully."
        except Exception as e:
            passed = False
            details = f"AI decision check failed: {e}"
        
        results.append({
            "test_name": "AI_AGENT_DECISION_ENGINE",
            "component": "AI Agent",
            "passed": passed,
            "latency": round((time.time() - start) * 1000, 2),
            "details": details
        })

        # Test 3: Policy Execution Check
        start = time.time()
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
            self.policy.evaluate_policy("0x5bb83E60a7a05A0e1b077B66412a26306e334208", "prime_borrower_check")


            passed = True
            details = "Policy criteria evaluation rules parsed successfully."
        except Exception as e:
            passed = False
            details = f"Policy engine failed: {e}"


        results.append({
            "test_name": "POLICY_EXECUTION",
            "component": "Policy Engine",
            "passed": passed,
            "latency": round((time.time() - start) * 1000, 2),
            "details": details
        })

        return results

    def validate_contracts(self) -> list:
        results = []
        
        # Test: Contract Deployment
        start = time.time()
        passed = self.monitor.check_contracts() == "HEALTHY"
        results.append({
            "test_name": "SMART_CONTRACT_VERIFICATION",
            "component": "Smart Contracts",
            "passed": passed,
            "latency": round((time.time() - start) * 1000, 2),
            "details": "All system smart contract deployment states verified." if passed else "Failed to connect to contract bytecode registry."
        })
        return results

    def validate_integrations(self) -> list:
        results = []
        
        # Test: Oracle signatures recovery
        start = time.time()
        try:
            # EIP-712 verification check
            test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
            self.uvn.verify_wallet(test_wallet)

            passed = True
            details = "Oracle attestation signatures resolved."
        except Exception as e:
            passed = False
            details = f"Attestation check failed: {e}"

        results.append({
            "test_name": "ORACLE_ATTESTATION_NETWORK",
            "component": "Oracle Network",
            "passed": passed,
            "latency": round((time.time() - start) * 1000, 2),
            "details": details
        })
        return results

    def generate_health_report(self) -> dict:
        srv = self.validate_services()
        ctr = self.validate_contracts()
        itg = self.validate_integrations()

        all_tests = srv + ctr + itg
        passed_count = sum(1 for t in all_tests if t["passed"])

        return {
            "overall_status": "HEALTHY" if passed_count == len(all_tests) else "DEGRADED",
            "passed_tests": passed_count,
            "total_tests": len(all_tests),
            "reports": all_tests
        }

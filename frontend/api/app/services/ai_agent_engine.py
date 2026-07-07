import os
import json
from datetime import datetime, timezone
from groq import Groq
from dotenv import load_dotenv
from web3 import Web3
from app.services.verification_network import VerificationNetwork
from app.services.predictive_engine import PredictiveRiskEngine
from app.services.policy_engine import PolicyEngine
from app.services.ecosystem_engine import EcosystemEngine
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine

load_dotenv()

class AIFinancialAgent:
    def __init__(self):
        self.client = None
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            try:
                self.client = Groq(api_key=api_key)
            except Exception as e:
                print(f"Failed to initialize Groq client: {e}")

    def answer(self, wallet: str, agent_type: str, question: str) -> dict:
        """
        Retrieves live credit context, routes request to Groq reasoning LLM,
        and constructs an explainable grounded response carrying decision traces.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        agent_type_upper = agent_type.upper()
        
        # 1. Decision Trace tracking
        trace = ["Initializing AI agent network session"]

        # 2. Retrieve Credence Context
        trace.append("Retrieving live on-chain credentials & verification states")
        vn = VerificationNetwork()
        verify_record = vn.get_verification_by_wallet(checksum_wallet)
        if not verify_record:
            verify_record = vn.verify_wallet(checksum_wallet)

        trace.append("Loading credit score and risk profiling metrics")
        analyzer = WalletAnalyzer()
        credit_engine = CreditEngine()
        features = analyzer.analyze(checksum_wallet)
        credit_profile = credit_engine.calculate(features)

        trace.append("Computing forward-looking predictive risk trajectories")
        predictive = PredictiveRiskEngine()
        forecast = predictive.forecast_credit(checksum_wallet)

        trace.append("Scanning ecosystem registries and policies mapping")
        policy_eng = PolicyEngine()
        policies_list = policy_eng.list_policies()

        eco_eng = EcosystemEngine()
        health = eco_eng.calculate_network_health()

        # Build context dictionary
        context = {
            "wallet": checksum_wallet,
            "credit_score": verify_record["credit_score"],
            "trust_score": verify_record["trust_score"],
            "risk_level": verify_record["risk_level"],
            "passport_valid": verify_record["passport_valid"],
            "oracle_verified": verify_record["oracle_verified"],
            "predicted_score": forecast["predicted_score"],
            "trajectory": forecast["trajectory"],
            "default_probability_now": forecast["default_probability_now"],
            "default_probability_future": forecast["default_probability_future"],
            "active_signals": forecast["signals"],
            "protocol_profiles": verify_record["protocol_profiles"],
            "policies": policies_list,
            "ecosystem_health_score": health["health_score"]
        }

        # 3. Formulate Prompt based on Agent Role
        trace.append("Routing reasoning context to LLM neural pipeline")
        
        if agent_type_upper == "BORROWER_AGENT":
            role_instructions = (
                "You are the BORROWER ADVISOR agent.\n"
                "Explain why the borrower has their current score and risk level.\n"
                "Give concrete steps to increase score and reduce risk based on their predictive trajectory.\n"
                "Ground your answer in their actual features (e.g. balance, activity)."
            )
        elif agent_type_upper == "LENDER_AGENT":
            role_instructions = (
                "You are the LENDER ADVISOR agent.\n"
                "Evaluate if the lender should allocate capital to this borrower.\n"
                "Explain the risks (default probability changes, leverage ratio) and security indicators (oracle signature, verified passport)."
            )
        else: # PROTOCOL_AGENT
            role_instructions = (
                "You are the PROTOCOL ADVISOR agent.\n"
                "Advise what policy thresholds should apply to this wallet.\n"
                "Review the active policies in the context and match them against the borrower's scores and segment."
            )

        prompt = f"""
        Role: {role_instructions}
        
        Wallet Context:
        {json.dumps(context, indent=2)}
        
        User Question:
        "{question}"
        
        Respond in structured JSON format with these exact keys:
        {{
            "answer": "Grounded natural language response explaining details...",
            "confidence": 95.0,
            "recommendations": ["Recommendation item 1", "Recommendation item 2"]
        }}
        """

        # 4. Invoke LLM or fallback
        response_json = None
        if self.client:
            try:
                completion = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are an expert Credence AI Financial Agent. Return JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.3
                )
                response_json = json.loads(completion.choices[0].message.content)
            except Exception as llm_err:
                trace.append(f"LLM call failed: {llm_err}. Initializing deterministic fallback reasoning.")

        if not response_json:
            # Deterministic fallback reasoning
            response_json = self._deterministic_fallback(agent_type_upper, context, question)

        trace.append("Generated grounded advice report and decision trace")

        return {
            "wallet": checksum_wallet,
            "agent_type": agent_type_upper,
            "answer": response_json["answer"],
            "confidence": response_json.get("confidence", 85.0),
            "recommendations": response_json.get("recommendations", []),
            "sources": ["CreditRegistry", "PassportRegistry", "OracleSignatureEngine", "PredictiveRiskEngine"],
            "generated_at": datetime.now(timezone.utc),
            "decision_trace": trace
        }

    def _deterministic_fallback(self, agent_type: str, context: dict, question: str) -> dict:
        """
        Fallback generator providing realistic structured guidance in case of LLM service disruptions.
        """
        score = context["credit_score"]
        risk = context["risk_level"]
        traj = context["trajectory"]
        
        if agent_type == "BORROWER_AGENT":
            ans = f"Your current credit score stands at {score} with a {risk} risk rating. The trajectory forecast is projected as {traj}."
            recs = [
                "Maintain high transaction activity velocity.",
                "Repay active loan allocations before outstanding limits.",
                "Each trust score increase automatically unlocks higher borrow limits on Lending and larger credit lines on PayFi."
            ]
        elif agent_type == "LENDER_AGENT":
            ans = f"Borrower holds a {risk} risk rating with an estimated default probability of {context['default_probability_now']}%."
            recs = [
                "Recommend capital allocation with appropriate interest rates based on score." if risk != "HIGH" else "Decline allocation due to high default probability.",
                "Ensure EIP-712 oracle signatures are validated before release."
            ]
        else:
            ans = f"Wallet parameters match verification status (Passport: {context['passport_valid']}). Consuming protocols (Lending, PayFi, RWA) will dynamically synchronize terms."
            recs = [
                "Apply Lending policy evaluations for credit limit approvals.",
                "Review adapter ratings to adjust margin parameters.",
                "Verify EIP-712 oracle signature proofs on-chain inside consumer apps."
            ]

        return {
            "answer": ans,
            "confidence": 85.0,
            "recommendations": recs
        }

    def analyzeSettlementReliability(self, wallet: str) -> dict:
        """
        Analyzes the HSP settlement history of a wallet and outputs reliability metrics.
        """
        from app.database.persistence import read_json
        db = read_json("hsp_settlements.json", {})
        wallet_lower = wallet.lower()
        
        settlements = [r for r in db.values() if r.get("borrower", "").lower() == wallet_lower]
        total = len(settlements)
        verified = sum(1 for r in settlements if r.get("verified", False))
        failed = total - verified
        
        amounts = [r.get("amount", 0.0) for r in settlements]
        total_amount = sum(amounts)
        avg_amount = total_amount / total if total > 0 else 0.0
        
        ratio = int((verified * 100) / total) if total > 0 else 100
        
        if total > 0:
            analysis = f"This wallet completed {verified} verified HashKey settlements with {ratio}% reliability."
            if failed > 0:
                analysis += f" Identified {failed} pending/failed settlements in execution history."
            else:
                analysis += " Demonstrates flawless transactional execution velocity."
        else:
            analysis = "No previous on-chain HSP settlement history detected. Baseline reliability rating applied."
            
        recs = []
        if ratio < 90:
            recs.append("Improve settlement ratio by ensuring sufficient liquidity prior to due dates.")
        if total < 5:
            recs.append("Execute additional low-value HSP settlements to build history track record.")
        else:
            recs.append("Maintain high repayment consistency to preserve Prime tier terms.")
            
        return {
            "wallet": wallet_lower,
            "total_settlements": total,
            "verified_settlements": verified,
            "failed_settlements": failed,
            "reliability_ratio": ratio,
            "total_amount": total_amount,
            "average_amount": avg_amount,
            "analysis_report": analysis,
            "recommendations": recs
        }

    def analyzeTrustAuthenticity(self, wallet: str) -> dict:
        """
        AI-driven explanation of wallet authenticity, farming behavior, and risk signals.
        """
        from app.services.security.trust_defense_engine import TrustDefenseEngine
        defense = TrustDefenseEngine()
        report = defense.generate_defense_report(wallet)
        
        if not report["trustSafe"]:
            msg = "Warning: Possible artificial reputation farming detected."
        else:
            msg = (
                "This wallet's reputation appears authentic. "
                "Signals: \u2713 Diverse counterparties, \u2713 Real settlement history, "
                "\u2713 Natural activity pattern, \u2713 No Sybil links."
            )
            
        return {
            "wallet": wallet.lower(),
            "authenticityScore": report["authenticityScore"],
            "sybilRisk": report["sybilRisk"],
            "trustSafe": report["trustSafe"],
            "analysis": msg
        }

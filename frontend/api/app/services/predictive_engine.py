import time
from web3 import Web3
from typing import List, Dict, Any
from app.services.verification_network import VerificationNetwork
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.contracts.loan_reader import LoanReader

class PredictiveRiskEngine:
    def __init__(self):
        self.reader = LoanReader()

    def predict_wallet(self, wallet: str, forecast_days: int = 30) -> dict:
        """
        Runs the full predictive forecasting analysis over the wallet.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        
        # 1. Fetch live metrics
        vn = VerificationNetwork()
        record = vn.get_verification_by_wallet(checksum_wallet)
        if not record:
            record = vn.verify_wallet(checksum_wallet)

        current_score = record["credit_score"]
        current_risk = record["risk_level"]

        # Run forecasting details
        forecast = self.forecast_credit(checksum_wallet)
        
        # Determine risks
        predicted_score = forecast["predicted_score"]
        predicted_risk = "LOW" if predicted_score >= 700 else "MEDIUM" if predicted_score >= 550 else "HIGH"

        return {
            "wallet": checksum_wallet,
            "current_score": current_score,
            "predicted_score": predicted_score,
            "score_change": predicted_score - current_score,
            "current_risk": current_risk,
            "predicted_risk": predicted_risk,
            "default_probability_now": forecast["default_probability_now"],
            "default_probability_future": forecast["default_probability_future"],
            "confidence": forecast["confidence"],
            "forecast_days": forecast_days
        }

    def forecast_credit(self, wallet: str) -> dict:
        """
        Calculates credit trajectory index, future scores, and risk parameters.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)

        # Base calculations
        vn = VerificationNetwork()
        record = vn.get_verification_by_wallet(checksum_wallet)
        if not record:
            record = vn.verify_wallet(checksum_wallet)

        current_score = record["credit_score"]
        
        # Detect active signals
        signals = self.detect_risk_signals(checksum_wallet)
        
        # Base confidence at 50%
        confidence = 50.0
        predicted_score = current_score

        for s in signals:
            if s["impact"] == "POSITIVE":
                confidence += 15.0 if s["severity"] == "HIGH" else 10.0
                predicted_score += 25 if s["severity"] == "HIGH" else 15
            elif s["impact"] == "NEGATIVE":
                confidence += 10.0
                predicted_score -= 25 if s["severity"] == "HIGH" else 15

        # Bound calculations
        confidence = min(max(confidence, 10.0), 99.0)
        predicted_score = min(max(predicted_score, 300), 850)

        # Default Probability calculations
        default_probability_now = round(min(max((850 - current_score) / 550 * 100, 1.0), 99.0), 1)
        default_probability_future = round(min(max((850 - predicted_score) / 550 * 100, 1.0), 99.0), 1)

        trajectory = "IMPROVING" if predicted_score > current_score else "DECLINING" if predicted_score < current_score else "STABLE"

        recommendations = self.generate_recommendations(checksum_wallet, trajectory)

        return {
            "wallet": checksum_wallet,
            "current_score": current_score,
            "predicted_score": predicted_score,
            "trajectory": trajectory,
            "default_probability_now": default_probability_now,
            "default_probability_future": default_probability_future,
            "confidence": confidence,
            "signals": signals,
            "recommendations": recommendations
        }

    def detect_risk_signals(self, wallet: str) -> List[Dict[str, Any]]:
        """
        Analyzes features and historical logs to identify credit events.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        signals = []

        # Analyze features
        analyzer = WalletAnalyzer()
        features = analyzer.analyze(checksum_wallet)

        tx_count = features.get("tx_count", 0)
        balance_eth = features.get("balance_eth", 0.0)

        # Activity Check
        if tx_count > 50:
            signals.append({
                "signal": "High Transaction Velocity",
                "impact": "POSITIVE",
                "severity": "MEDIUM",
                "description": f"Wallet has active historical presence with {tx_count} txs."
            })
        elif tx_count < 5:
            signals.append({
                "signal": "Declining Wallet Activity",
                "impact": "NEGATIVE",
                "severity": "MEDIUM",
                "description": "Low historical transaction presence indicates potential dormancy risks."
            })

        # Asset holds Check
        if balance_eth >= 2.0:
            signals.append({
                "signal": "Strong Liquidity Profile",
                "impact": "POSITIVE",
                "severity": "MEDIUM",
                "description": f"Baseline asset holding of {balance_eth:.2f} ETH reduces liquidity stress risk."
            })
        else:
            signals.append({
                "signal": "Low Balance Reserves",
                "impact": "NEUTRAL",
                "severity": "LOW",
                "description": f"Current balance holds stand at {balance_eth:.2f} ETH."
            })

        # Check completed / active loan items
        try:
            all_loans = self.reader.get_loans(checksum_wallet)
            active_loans = [l for l in all_loans if l["status_val"] == 1]
            repaid_loans = [l for l in all_loans if l["status_val"] == 2]

            if len(repaid_loans) > 0:
                signals.append({
                    "signal": "Successful Repayments",
                    "impact": "POSITIVE",
                    "severity": "HIGH",
                    "description": f"Successfully completed and repaid {len(repaid_loans)} loan offers on-time."
                })

            if len(active_loans) > 0:
                # Check for overdue
                overdue = False
                now = int(time.time())
                for loan in active_loans:
                    if now > loan["due_date_timestamp"]:
                        overdue = True
                        break
                
                if overdue:
                    signals.append({
                        "signal": "Active Overdue Exposure",
                        "impact": "NEGATIVE",
                        "severity": "HIGH",
                        "description": "One or more active loan agreements have exceeded their payment due dates."
                    })
                else:
                    signals.append({
                        "signal": "Increasing Leverage Exposure",
                        "impact": "NEUTRAL",
                        "severity": "MEDIUM",
                        "description": f"Currently managing {len(active_loans)} active credit loan agreement exposure."
                    })
        except Exception:
            pass

        return signals

    def generate_recommendations(self, wallet: str, trajectory: str) -> List[str]:
        """
        Creates actionable recommendations to improve future credit trajectories.
        """
        recommendations = []
        if trajectory == "IMPROVING":
            recommendations.append("Maintain consistent loan repayment habits on-time.")
            recommendations.append("Gradually expand interface interactions to establish credit profile diversity.")
        elif trajectory == "DECLINING":
            recommendations.append("Promptly settle overdue or pending active loan exposures.")
            recommendations.append("Fund wallet reserves with steady assets to lower leverage stress indicators.")
        else:
            recommendations.append("Optimize balance hold reserves to scale up credit limits.")
            recommendations.append("Establish initial active repayments records with money market adapters.")
        
        return recommendations

    def simulate_scenario(self, wallet: str, scenario: str) -> dict:
        """
        Evaluates potential credit score impact given a simulation scenario.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        
        # Get baseline score
        vn = VerificationNetwork()
        record = vn.get_verification_by_wallet(checksum_wallet)
        if not record:
            record = vn.verify_wallet(checksum_wallet)

        current_score = record["credit_score"]

        if scenario == "REPAY_LOAN":
            simulated_score = min(current_score + 48, 850)
            impact = "+48"
            reason = "Settle active debt reduces outstanding liability leverage and rebuilds scoring trust."
        elif scenario == "TAKE_NEW_LOAN":
            simulated_score = max(current_score - 35, 300)
            impact = "-35"
            reason = "Applying for new loan terms elevates default risk indicators and debt burden."
        elif scenario == "DEFAULT_LOAN":
            simulated_score = max(current_score - 150, 300)
            impact = "-150"
            reason = "Severe default occurrences collapse credit reliability and reputational standing."
        else:
            raise ValueError(f"Unknown simulation scenario: {scenario}")

        return {
            "current_score": current_score,
            "simulated_score": simulated_score,
            "impact": impact,
            "reason": reason
        }

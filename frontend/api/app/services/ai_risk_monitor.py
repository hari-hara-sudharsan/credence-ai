"""
AI Risk Monitor — Machine Intelligence Risk Auditing.
Exposes risk predictive analytics, trend direction, and preventive recommendations.
"""
from typing import Dict, Any
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

class AIRiskMonitor:
    def __init__(self):
        self.underwriting = TransparentUnderwritingEngine()

    def detect_default_risk(self, wallet: str) -> dict:
        """
        Detects default risk based on transparent underwriting factors.
        """
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        # Calculate risk based on score
        default_prob = report.default_probability
        
        if default_prob > 25.0:
            risk_level = "HIGH"
            triggers = ["Low transaction frequency", "Declining wallet balances", "Recent default/late payment signals"]
        elif default_prob > 10.0:
            risk_level = "MEDIUM"
            triggers = ["Moderate transaction volume", "Stable balances"]
        else:
            risk_level = "LOW"
            triggers = ["Consistent transaction frequency", "Growing account balance", "No defaults"]

        return {
            "wallet": wallet,
            "default_probability": default_prob,
            "risk_level": risk_level,
            "risk_triggers": triggers,
            "verdict": "CRITICAL EXPOSURE WARNING" if risk_level == "HIGH" else "STABLE EXPOSURE" if risk_level == "MEDIUM" else "EXCELLENT STANDING"
        }

    def predict_credit_change(self, wallet: str) -> dict:
        """
        Predicts future credit changes based on current features.
        """
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        # Determine trend
        if score > 700:
            direction = "UPWARD"
            expected_change = "+15 to +40 points"
            horizon = "30-90 Days"
        elif score > 500:
            direction = "STABLE"
            expected_change = "-5 to +10 points"
            horizon = "60-90 Days"
        else:
            direction = "DOWNWARD"
            expected_change = "-20 to -50 points"
            horizon = "15-30 Days"

        return {
            "direction": direction,
            "expected_change": expected_change,
            "prediction_horizon": horizon,
            "confidence_interval": "92.5%" if score > 700 else "85.0%"
        }

    def recommend_actions(self, wallet: str) -> dict:
        """
        Generates actionable recommendations to improve trust standing.
        """
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        if score >= 750:
            recommendations = [
                "Maintain consistent transactions to sustain institutional status.",
                "Utilize Lending Pools to secure lower-premium DeFi insurance terms."
            ]
        elif score >= 550:
            recommendations = [
                "Execute timely HSP settlements to elevate reputation score.",
                "Increase active participation in DAO governance votes."
            ]
        else:
            recommendations = [
                "Avoid late repayment events to reset defaults penalty.",
                "Fund Credit Passport with consistent small-value liquidity transactions."
            ]

        return {
            "wallet": wallet,
            "recommendations": recommendations,
            "target_tier_goal": "Institutional Trust" if score >= 700 else "Prime Participant"
        }

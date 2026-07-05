class DynamicInterestEngine:
    def calculate_rate(
        self,
        credit_score: int,
        risk_level: str,
        default_probability: float,
        pool_utilization: float
    ) -> dict:
        """
        Dynamically adjusts borrow rate base parameters based on wallet intelligence features.
        """
        # Base borrow rate
        rate = 5.0
        risk_adjustment = 0.0

        # Adjust for Credit Score / Rating
        if credit_score >= 700:
            rate -= 2.0
            reason = "Strong credit profile reduced borrowing cost."
        elif credit_score < 550:
            rate += 5.0
            risk_adjustment += 3.0
            reason = "Subprime credit rating increases default risk adjustments."
        else:
            reason = "Standard market conditions interest rate calculation."

        # Adjust for Risk Level
        risk_lower = risk_level.lower()
        if "high" in risk_lower:
            rate += 3.0
            risk_adjustment += 5.0
        elif "low" in risk_lower:
            rate -= 0.5

        # Adjust for Pool Utilization
        # Utilization in range [0, 1.0]. If > 80% (0.8), add utilization premium
        if pool_utilization > 0.8:
            rate += 3.0
            reason += " High utilization rate increases premium parameters."
        elif pool_utilization > 0.5:
            rate += 1.5

        # Bound rate between 1.0% and 25.0%
        rate = max(1.0, min(25.0, rate))

        return {
            "borrow_rate": round(rate, 2),
            "risk_adjustment": round(risk_adjustment, 2),
            "reason": reason
        }

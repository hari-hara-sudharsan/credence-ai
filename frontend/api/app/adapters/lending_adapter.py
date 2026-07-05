from app.adapters.base_adapter import ProtocolAdapter

class LendingAdapter(ProtocolAdapter):
    def get_protocol_name(self) -> str:
        return "LENDING"

    def get_supported_features(self) -> list:
        return ["max_ltv", "interest_rate", "max_loan", "eligible"]

    def adapt(self, profile: dict) -> dict:
        credit_score = profile.get("credit_score", 600)
        trust_score = profile.get("trust_score", 50)
        late_payments = profile.get("late_payments", 0)
        
        # 1. Eligibility Check
        eligible = credit_score >= 500 and trust_score >= 40 and late_payments == 0
        
        # 2. Compute Max LTV (Loan-to-Value in %)
        # Baseline LTV is 50%, high credit/trust score boosts it up to 85%
        score_bonus = (credit_score - 500) / 10 if credit_score > 500 else 0
        trust_bonus = (trust_score - 40) / 2 if trust_score > 40 else 0
        max_ltv = min(85, max(30, int(50 + score_bonus + trust_bonus)))
        
        # 3. Compute Interest Rate (APR in %)
        # Baseline APR is 18%. Good reputation reduces APR down to 4%.
        score_discount = (credit_score - 500) / 40 if credit_score > 500 else 0
        trust_discount = (trust_score - 40) / 10 if trust_score > 40 else 0
        interest_rate = min(24, max(4, int(18 - score_discount - trust_discount)))
        
        # 4. Compute Max Loan Limit (HSK equivalent)
        max_loan = min(1500, max(100, int(credit_score * 1.2 + trust_score * 3.5)))
        
        # If not eligible, clamp terms
        if not eligible:
            max_ltv = 0
            interest_rate = 24
            max_loan = 0
            
        return {
            "protocol": self.get_protocol_name(),
            "max_ltv": max_ltv,
            "interest_rate": interest_rate,
            "max_loan": max_loan,
            "eligible": eligible
        }

from app.adapters.base_adapter import ProtocolAdapter

class InsuranceAdapter(ProtocolAdapter):
    def get_protocol_name(self) -> str:
        return "INSURANCE"

    def get_supported_features(self) -> list:
        return ["risk_class", "coverage_limit", "premium_discount"]

    def adapt(self, profile: dict) -> dict:
        trust_score = profile.get("trust_score", 50)
        asset_stability = profile.get("asset_stability_score", 50.0)
        successful_loans = profile.get("successful_loans", 0)
        late_payments = profile.get("late_payments", 0)
        
        # 1. Determine Risk Class
        if trust_score >= 80 and late_payments == 0:
            risk_class = "LOW"
        elif trust_score >= 50:
            risk_class = "MEDIUM"
        else:
            risk_class = "HIGH"
            
        # 2. Compute Coverage Limit (HSK equivalent)
        # Baseline limit is 1000, capped at 10,000 HSK
        coverage_limit = min(10000, max(500, int(1000 + trust_score * 50 + asset_stability * 40)))
        
        # 3. Compute Premium Discount (%)
        # Baseline is 0%, max discount is 30%
        discount = int(trust_score / 4 + successful_loans * 2 - late_payments * 8)
        premium_discount = min(30, max(0, discount))
        
        # If risk is extremely high, reduce coverage and cancel discounts
        if risk_class == "HIGH":
            coverage_limit = min(coverage_limit, 2000)
            premium_discount = 0
            
        return {
            "protocol": self.get_protocol_name(),
            "risk_class": risk_class,
            "coverage_limit": coverage_limit,
            "premium_discount": premium_discount
        }

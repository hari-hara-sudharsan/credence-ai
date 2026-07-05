from app.adapters.base_adapter import ProtocolAdapter

class InstitutionalAdapter(ProtocolAdapter):
    def get_protocol_name(self) -> str:
        return "INSTITUTIONAL"

    def get_supported_features(self) -> list:
        return ["approved", "confidence", "risk"]

    def adapt(self, profile: dict) -> dict:
        credit_score = profile.get("credit_score", 600)
        trust_score = profile.get("trust_score", 50)
        reliability = profile.get("financial_reliability_score", 50.0)
        
        # 1. Determine Approval Status
        approved = credit_score >= 700 and trust_score >= 75
        
        # 2. Determine Institutional Risk Tier
        if credit_score >= 720 and trust_score >= 75:
            risk = "LOW"
        elif credit_score >= 600 and trust_score >= 50:
            risk = "MEDIUM"
        else:
            risk = "HIGH"
            
        # 3. Compute Confidence Index (%)
        confidence = min(100, max(40, int(reliability * 0.7 + trust_score * 0.3)))
        
        return {
            "protocol": self.get_protocol_name(),
            "approved": approved,
            "confidence": confidence,
            "risk": risk
        }

from app.adapters.base_adapter import ProtocolAdapter

class RwaAdapter(ProtocolAdapter):
    def get_protocol_name(self) -> str:
        return "RWA"

    def get_supported_features(self) -> list:
        return ["asset_limit", "risk", "institutional_grade"]

    def adapt(self, profile: dict) -> dict:
        credit_score = profile.get("credit_score", 600)
        trust_score = profile.get("trust_score", 50)
        
        # 1. Determine Risk Tier
        if credit_score >= 700 and trust_score >= 70:
            risk = "LOW"
        elif credit_score >= 550 and trust_score >= 45:
            risk = "MEDIUM"
        else:
            risk = "HIGH"
            
        # 2. Determine Institutional Grade
        institutional_grade = credit_score >= 700 and trust_score >= 75
        
        # 3. Compute Asset Limit (RWA Purchase capacity)
        # Bounded between 500 and 20,000 HSK
        base_capacity = credit_score * 15 + trust_score * 40
        asset_limit = min(20000, max(500, int(base_capacity)))
        
        # Clamp RWA buying capacity for high risk accounts
        if risk == "HIGH":
            asset_limit = min(asset_limit, 1000)
            
        return {
            "protocol": self.get_protocol_name(),
            "asset_limit": asset_limit,
            "risk": risk,
            "institutional_grade": institutional_grade
        }

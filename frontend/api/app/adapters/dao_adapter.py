from app.adapters.base_adapter import ProtocolAdapter

class DaoAdapter(ProtocolAdapter):
    def get_protocol_name(self) -> str:
        return "DAO"

    def get_supported_features(self) -> list:
        return ["voting_weight", "delegate_recommended"]

    def adapt(self, profile: dict) -> dict:
        trust_score = profile.get("trust_score", 50)
        reputation_rating = profile.get("reputation_rating", "Developing")
        
        # 1. Determine Voting Weight
        if trust_score >= 80 or reputation_rating in ("Institutional", "Trusted"):
            voting_weight = "HIGH"
        elif trust_score >= 50:
            voting_weight = "MEDIUM"
        else:
            voting_weight = "LOW"
            
        # 2. Determine Delegate Recommendation
        delegate_recommended = trust_score >= 70
        
        return {
            "protocol": self.get_protocol_name(),
            "voting_weight": voting_weight,
            "delegate_recommended": delegate_recommended
        }

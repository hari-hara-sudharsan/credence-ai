from app.services.ecosystem.protocol_profiles import ProtocolProfiles
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

class TrustMarketplaceEngine:
    def __init__(self):
        self.profiles_gen = ProtocolProfiles()
        self.identity_engine = FinancialIdentityEngine()

    def generate_ecosystem_profile(self, wallet: str) -> dict:
        """
        Consolidates all protocol-specific profiles for a given wallet address.
        """
        return self.profiles_gen.generate_profiles(wallet)

    def calculate_protocol_fit(self, wallet: str, protocol: str) -> int:
        """
        Computes a percentage-based compatibility fit (0-100) for a protocol.
        """
        wallet = wallet.lower()
        profiles = self.profiles_gen.generate_profiles(wallet)["profiles"]
        p_lower = protocol.lower()
        
        if p_lower in ("lending", "loans"):
            score = profiles["lending"]["score"]
        elif p_lower in ("payment", "payfi", "payments"):
            score = profiles["payment"]["score"]
        elif p_lower == "insurance":
            score = profiles["insurance"]["score"]
        elif p_lower == "rwa":
            score = profiles["rwa"]["score"]
        elif p_lower == "dao":
            score = profiles["dao"]["score"]
        elif p_lower in ("agent", "ai_agent"):
            score = profiles["agent"]["score"]
        else:
            score = 500
            
        return int((score / 1000.0) * 100)

    def generate_access_decision(self, wallet: str, protocol: str) -> dict:
        """
        Decides whether a wallet gets approved access to a protocol, including tier and reasoning.
        """
        wallet = wallet.lower()
        fit = self.calculate_protocol_fit(wallet, protocol)
        approved = fit >= 55
        
        if fit >= 80:
            tier = "PRIME"
            reason = f"Excellent trust credentials match the requirements for {protocol}."
        elif fit >= 55:
            tier = "STANDARD"
            reason = f"Standard tier validation complete. Access granted for {protocol}."
        else:
            tier = "RESTRICTED"
            reason = f"Insufficient trust rating to authorize {protocol} access."
            
        return {
            "approved": approved,
            "tier": tier,
            "reason": reason,
            "fitScore": fit
        }

    def match_protocols(self, wallet: str) -> list:
        """
        Scans all protocols and returns list of matches with eligibility scores.
        """
        wallet = wallet.lower()
        protocols = ["Lending", "Insurance", "RWA", "DAO", "AI Agents", "PayFi"]
        matches = []
        
        for p in protocols:
            decision = self.generate_access_decision(wallet, p)
            matches.append({
                "protocol": p,
                "eligibility": decision["fitScore"],
                "offer": "Prime Access" if decision["tier"] == "PRIME" else ("Reduced Premium" if p == "Insurance" else "Standard Terms"),
                "approved": decision["approved"],
                "reason": decision["reason"]
            })
            
        return matches

    def discover_opportunities(self, wallet: str) -> list:
        """
        Helper interface mapping matches.
        """
        return self.match_protocols(wallet)

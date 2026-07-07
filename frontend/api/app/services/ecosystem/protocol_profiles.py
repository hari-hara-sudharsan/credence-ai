from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

class ProtocolProfiles:
    def __init__(self):
        self.identity_engine = FinancialIdentityEngine()
        self.underwriting = TransparentUnderwritingEngine()

    def generate_profiles(self, wallet: str) -> dict:
        """
        Generates context-aware trust profiles tailored to different financial applications.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        dna = self.identity_engine.calculate_financial_dna(wallet)
        
        credit_score = report.credit_score
        reliability = dna.get("reliability", 500)
        activity = dna.get("activity", 500)
        risk_val = dna.get("risk", 100)
        
        # 1. Lending Trust (standard defaults and credit scores)
        lending_score = int(credit_score)
        lending_risk = report.risk_level
        
        # 2. Payment Trust (frequency and repayment habits)
        payment_score = int((reliability * 0.6) + (activity * 0.4))
        payment_risk = "LOW" if payment_score >= 700 else ("MEDIUM" if payment_score >= 450 else "HIGH")
        frequency = "HIGH" if activity >= 750 else ("MEDIUM" if activity >= 350 else "LOW")
        
        # 3. Insurance Trust (premium discount metrics based on lack of defaults)
        insurance_score = int(1000 - (risk_val * 0.8) + (reliability * 0.2))
        insurance_score = max(300, min(1000, insurance_score))
        premium_risk = "LOW" if insurance_score >= 800 else ("MEDIUM" if insurance_score >= 500 else "HIGH")
        
        # 4. RWA Trust (compliance, credit limits, physical assets verification)
        rwa_score = int((credit_score * 0.7) + (reliability * 0.3))
        verified = credit_score >= 550
        limit = int((rwa_score / 1000.0) * 100000)
        
        # 5. DAO Trust (governance voting consistency and participant status)
        dao_score = int((reliability * 0.8) + (activity * 0.2))
        participation_rate = int(activity / 10)
        standing = "EXCELLENT" if dao_score >= 750 else ("GOOD" if dao_score >= 500 else "WATCHLIST")
        
        # 6. Agent Trust (autonomy caps and credentials for automated bots)
        agent_score = int((reliability * 0.5) + (activity * 0.5))
        autonomy_limit = int((agent_score / 1000.0) * 5000)
        agent_verified = report.credit_score >= 600
        
        return {
            "wallet": wallet,
            "profiles": {
                "lending": {
                    "score": lending_score,
                    "risk": lending_risk
                },
                "payment": {
                    "score": payment_score,
                    "risk": payment_risk,
                    "frequency": frequency
                },
                "insurance": {
                    "score": insurance_score,
                    "premiumRisk": premium_risk
                },
                "rwa": {
                    "score": rwa_score,
                    "verified": verified,
                    "limit": limit
                },
                "dao": {
                    "score": dao_score,
                    "participationRate": participation_rate,
                    "standing": standing
                },
                "agent": {
                    "score": agent_score,
                    "autonomyLimit": autonomy_limit,
                    "validation": agent_verified
                }
            }
        }

import time
from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.trust.trust_receipt_engine import TrustReceiptEngine
from app.services.reputation_engine import ReputationEngine
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

class CredenceTrustAgent:
    def __init__(self):
        self.identity_engine = FinancialIdentityEngine()
        self.receipt_engine = TrustReceiptEngine()
        self.reputation_engine = ReputationEngine()
        self.underwriting = TransparentUnderwritingEngine()

    def analyze_entity(self, wallet: str) -> dict:
        """
        Runs complete predictive trust analysis on the wallet address.
        """
        wallet = wallet.lower()
        identity = self.identity_engine.generate_identity(wallet)
        risk = self.predict_default_risk(wallet)
        change = self.detect_behavior_change(wallet)
        rec = self.recommend_financial_action(wallet)
        health = self.monitor_trust_health(wallet)
        reliability = self.analyzeSettlementReliability(wallet)
        
        return {
            "wallet": wallet,
            "identity": identity,
            "risk_analysis": risk,
            "behavior_change": change,
            "recommendation": rec,
            "health_monitor": health,
            "settlement_reliability": reliability,
            "timestamp": int(time.time())
        }

    def predict_default_risk(self, wallet: str) -> dict:
        """
        Predicts potential default risk metrics.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        dna = self.identity_engine.calculate_financial_dna(wallet)
        
        default_risk = report.default_probability
        
        # Calculate confidence based on credit score
        confidence = 90
        if report.credit_score >= 750:
            confidence = 94
        elif report.credit_score < 400:
            confidence = 85
            
        repayments = dna.get("positiveEvents", 0)
        defaults = dna.get("negativeEvents", 0)
        
        if defaults > 0:
            trend = "INCREASING"
        elif repayments > 3:
            trend = "DECREASING"
        else:
            trend = "STABLE"
            
        reasons = []
        if repayments > 0:
            reasons.append(f"{repayments} successful repayments")
        else:
            reasons.append("No active repayment history")
            
        if defaults == 0:
            reasons.append("No failed settlements")
        else:
            reasons.append(f"{defaults} defaulted events recorded")
            
        if dna.get("activity", 50) > 75:
            reasons.append("Increasing activity")
        elif dna.get("activity", 50) < 30:
            reasons.append("Decreased wallet activity")
        else:
            reasons.append("Stable transaction activity")
            
        return {
            "wallet": wallet,
            "defaultRisk": float(default_risk),
            "confidence": int(confidence),
            "riskTrend": trend,
            "reasons": reasons
        }

    def detect_behavior_change(self, wallet: str) -> dict:
        """
        Compares the current trust score against a simulated baseline to check for variations.
        """
        wallet = wallet.lower()
        dna = self.identity_engine.calculate_financial_dna(wallet)
        
        current_prediction = dna.get("trust", 600)
        
        repayments = dna.get("positiveEvents", 0)
        defaults = dna.get("negativeEvents", 0)
        
        # Compute baseline
        previous_trust = current_prediction
        if repayments > 0 or defaults > 0:
            previous_trust = current_prediction - (repayments * 15) + (defaults * 50)
            
        previous_trust = max(300, min(1000, previous_trust))
        delta = current_prediction - previous_trust
        
        change_str = f"+{delta}" if delta >= 0 else str(delta)
        
        if delta > 30:
            reason = "Improved repayment consistency"
        elif delta < -30:
            reason = "Default or late activity detected"
        else:
            reason = "Stable behavior pattern"
            
        return {
            "previousTrust": int(previous_trust),
            "currentPrediction": int(current_prediction),
            "change": change_str,
            "reason": reason
        }

    def recommend_financial_action(self, wallet: str) -> dict:
        """
        Provides risk-adjusted suggestions for borrowing and lending limits.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        limit = int((score / 1000.0) * 15000)
        interest = round(12.0 - (score / 1000.0) * 8.0, 1)
        interest_str = f"{max(interest, 2.5)}%"
        
        if score >= 700:
            decision = "APPROVE"
            reason = "Prime trust profile detected"
        elif score >= 450:
            decision = "ADJUST_TERMS"
            reason = "Standard tier, require additional collateral"
        else:
            decision = "REJECT"
            reason = "Watchlist or high risk tier profile"
            
        return {
            "decision": decision,
            "recommendedLoan": limit,
            "interest": interest_str,
            "reason": reason
        }

    def monitor_trust_health(self, wallet: str) -> dict:
        """
        Retrieves live status alerts for target entities.
        """
        wallet = wallet.lower()
        dna = self.identity_engine.calculate_financial_dna(wallet)
        
        defaults = dna.get("negativeEvents", 0)
        if defaults > 0:
            status = "CRITICAL"
            alerts = ["Default recorded on-chain"]
        elif dna.get("trust", 600) < 450:
            status = "WARNING"
            alerts = ["Low trust score standing"]
        else:
            status = "HEALTHY"
            alerts = []
            
        return {
            "wallet": wallet,
            "status": status,
            "alerts": alerts,
            "lastChecked": int(time.time())
        }

    def generate_trust_report(self, wallet: str) -> dict:
        """
        Produces the standard summarized report JSON.
        """
        wallet = wallet.lower()
        identity = self.identity_engine.generate_identity(wallet)
        dna = identity.get("financialDNA", {})
        risk = self.predict_default_risk(wallet)
        
        return {
            "identity": identity.get("tier", "RETAIL"),
            "trustScore": int(dna.get("trust", 600)),
            "defaultPrediction": float(risk.get("defaultRisk", 5.0)),
            "recommendation": identity.get("recommendation", "Standard rate applies"),
            "confidence": int(risk.get("confidence", 90))
        }

    def recommend_ecosystem_access(self, wallet: str) -> dict:
        """
        AI Ecosystem Recommendation logic to evaluate matching protocols.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        dna = self.identity_engine.calculate_financial_dna(wallet)
        receipts = self.receipt_engine.get_wallet_receipts(wallet)
        receipts_count = len(receipts)
        
        score = report.credit_score
        qualifications = []
        
        if score >= 700:
            qualifications.append("Prime Lending")
        else:
            qualifications.append("Standard Lending")
            
        if score >= 600:
            qualifications.append("Low-risk Insurance")
        else:
            qualifications.append("Standard Premium Insurance")
            
        if receipts_count > 0:
            qualifications.append("Business Credit")
            
        if dna.get("reliability", 500) >= 700:
            qualifications.append("DAO Governance Board")
            
        if receipts_count >= 1:
            reason = f"Wallet qualifies for: {', '.join(qualifications)} because of {receipts_count} verified trust receipts"
        else:
            reason = f"Wallet qualifies for: {', '.join(qualifications)} based on stable transaction reliability profile"
            
        return {
            "wallet": wallet,
            "qualifications": qualifications,
            "receiptsCount": receipts_count,
            "recommendation": reason
        }

    def analyze_network_position(self, wallet: str) -> dict:
        """
        AI evaluation of the entity's relative position in the trust network graph.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        rank = "Top 10%"
        if score >= 750:
            rank = "Top 3%"
        elif score < 450:
            rank = "Bottom 25%"
            
        return {
            "wallet": wallet,
            "rank": rank,
            "networkRank": int((score / 1000.0) * 100),
            "summary": f"This wallet is in the {rank} of trusted financial participants."
        }

    def predict_future_trust(self, wallet: str) -> dict:
        """
        Predicts future trust score trajectories.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        predicted = min(1000, score + 80)
        return {
            "wallet": wallet,
            "currentScore": score,
            "predictedScore": predicted,
            "confidence": 92,
            "timeframeDays": 60
        }

    def recommend_growth_path(self, wallet: str) -> dict:
        """
        Recommends specific actions to optimize trust standings and unlock premium limits.
        """
        wallet = wallet.lower()
        report = self.underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        if score >= 700:
            path = "Completing two more repayments can unlock institutional credit."
        else:
            path = "Create a credit passport, generate two trust receipts, and maintain zero default status."
            
        return {
            "wallet": wallet,
            "nextActions": [
                "Mint Passport V2 Seal",
                "Execute 1 Settlement through HSP Pool"
            ],
            "growthPath": path
        }

    def analyzeSettlementReliability(self, wallet: str) -> dict:
        """
        Analyzes the HSP settlement history of a wallet and outputs reliability metrics.
        """
        from app.database.persistence import read_json
        db = read_json("hsp_settlements.json", {})
        wallet_lower = wallet.lower()
        
        settlements = [r for r in db.values() if r.get("borrower", "").lower() == wallet_lower]
        total = len(settlements)
        verified = sum(1 for r in settlements if r.get("verified", False))
        failed = total - verified
        
        amounts = [r.get("amount", 0.0) for r in settlements]
        total_amount = sum(amounts)
        avg_amount = total_amount / total if total > 0 else 0.0
        
        ratio = int((verified * 100) / total) if total > 0 else 100
        
        if total > 0:
            analysis = f"This wallet completed {verified} verified HashKey settlements with {ratio}% reliability."
            if failed > 0:
                analysis += f" Identified {failed} pending/failed settlements in execution history."
            else:
                analysis += " Demonstrates flawless transactional execution velocity."
        else:
            analysis = "No previous on-chain HSP settlement history detected. Baseline reliability rating applied."
            
        recs = []
        if ratio < 90:
            recs.append("Improve settlement ratio by ensuring sufficient liquidity prior to due dates.")
        if total < 5:
            recs.append("Execute additional low-value HSP settlements to build history track record.")
        else:
            recs.append("Maintain high repayment consistency to preserve Prime tier terms.")
            
        return {
            "wallet": wallet_lower,
            "total_settlements": total,
            "verified_settlements": verified,
            "failed_settlements": failed,
            "reliability_ratio": ratio,
            "total_amount": total_amount,
            "average_amount": avg_amount,
            "analysis_report": analysis,
            "recommendations": recs
        }

import time
from app.services.ai.trust_agent import CredenceTrustAgent

class TrustMonitor:
    def __init__(self):
        self.agent = CredenceTrustAgent()

    def scan_wallet_health(self, wallet: str) -> dict:
        """
        Scans a wallet address and determines current risk level.
        """
        wallet = wallet.lower()
        health = self.agent.monitor_trust_health(wallet)
        risk = self.agent.predict_default_risk(wallet)
        
        status = health.get("status", "HEALTHY")
        msg = "Stable trust standing"
        
        if status == "CRITICAL":
            msg = "Transaction reliability dropped: active defaults detected!"
        elif status == "WARNING":
            msg = f"Default probability elevated at {risk.get('defaultRisk')}%"
            
        return {
            "wallet": wallet,
            "type": "RISK_WARNING" if status in ("WARNING", "CRITICAL") else "HEALTH_OK",
            "message": msg,
            "action": "Review lending exposure" if status in ("WARNING", "CRITICAL") else "No action required",
            "status": status,
            "timestamp": int(time.time())
        }

    def detect_risk_event(self, wallet: str) -> dict or None:
        """
        Returns a risk event alert if anomalous drops are observed.
        """
        wallet = wallet.lower()
        scan = self.scan_wallet_health(wallet)
        if scan["status"] in ("WARNING", "CRITICAL"):
            return {
                "type": "RISK_WARNING",
                "wallet": wallet,
                "message": scan["message"],
                "action": scan["action"]
            }
        return None

    def trigger_reputation_review(self, wallet: str) -> dict:
        """
        Generates a review payload suggesting reputation recalculation.
        """
        wallet = wallet.lower()
        health = self.scan_wallet_health(wallet)
        
        needs_review = health["status"] in ("WARNING", "CRITICAL")
        
        return {
            "wallet": wallet,
            "needsReview": needs_review,
            "reason": health["message"] if needs_review else "Healthy metrics verified",
            "suggestedAction": "RECALCULATE_SCORE" if needs_review else "MAINTAIN"
        }

from app.database.persistence import read_json, write_json
from app.services.verification_network import VerificationNetwork
from app.services.predictive_engine import PredictiveRiskEngine
from app.services.alert_engine import AlertEngine
from web3 import Web3

DB_SNAPSHOTS = "snapshots.json"

class MonitoringEngine:
    def __init__(self):
        self.alert_engine = AlertEngine()

    def monitor_wallet(self, wallet: str) -> list:
        """
        Retrieves current wallet state, compares against stored snapshot,
        generates appropriate alert updates, and updates snapshot.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        
        # 1. Fetch current live states
        vn = VerificationNetwork()
        verify_record = vn.get_verification_by_wallet(checksum_wallet)
        if not verify_record:
            verify_record = vn.verify_wallet(checksum_wallet)

        current_score = verify_record["credit_score"]
        current_risk = verify_record["risk_level"]

        # 2. Load previous snapshot
        snapshots = read_json(DB_SNAPSHOTS, {})
        prev = snapshots.get(checksum_wallet.lower())

        new_alerts = []

        if prev:
            # Detect Credit changes
            prev_score = prev.get("credit_score", 0)
            score_diff = current_score - prev_score
            
            if score_diff <= -50:
                alert = self.alert_engine.create_alert(
                    wallet=checksum_wallet,
                    alert_type="CREDIT_CHANGE",
                    severity="HIGH",
                    title="Credit Score Dropped Significantly",
                    description=f"Your credit score decreased by {abs(score_diff)} points (from {prev_score} to {current_score}).",
                    recommendation="Review outstanding liabilities and check predictive risk opportunities.",
                    source="CreditEngine"
                )
                new_alerts.append(alert)
            elif score_diff >= 30:
                alert = self.alert_engine.create_alert(
                    wallet=checksum_wallet,
                    alert_type="CREDIT_CHANGE",
                    severity="INFO",
                    title="Credit Score Improved",
                    description=f"Your credit score increased by {score_diff} points (from {prev_score} to {current_score}).",
                    recommendation="Maintain active DeFi allocations to preserve score growth.",
                    source="CreditEngine"
                )
                new_alerts.append(alert)

            # Detect Risk Level changes
            prev_risk = prev.get("risk_level", "LOW")
            if prev_risk != current_risk:
                severity = "CRITICAL" if current_risk == "HIGH" else "MEDIUM" if current_risk == "MEDIUM" else "INFO"
                alert = self.alert_engine.create_alert(
                    wallet=checksum_wallet,
                    alert_type="RISK_CHANGE",
                    severity=severity,
                    title="Wallet Risk Profile Changed",
                    description=f"Systemic risk profile shifted from {prev_risk} to {current_risk}.",
                    recommendation="Reduce borrowing exposures to normalize leverage metrics." if current_risk == "HIGH" else "Profile holds lower default risk.",
                    source="RiskEngine"
                )
                new_alerts.append(alert)

        # 3. Save latest snapshot
        snapshots[checksum_wallet.lower()] = {
            "credit_score": current_score,
            "risk_level": current_risk
        }
        write_json(DB_SNAPSHOTS, snapshots)

        return new_alerts

    def monitor_protocol(self, protocol: str) -> list:
        # Aggregate alert checks on protocol profiles
        return []

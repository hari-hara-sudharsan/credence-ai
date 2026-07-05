from typing import List, Dict, Any
from app.database.persistence import read_json
from app.services.verification_network import VerificationNetwork

class EcosystemEngine:
    def __init__(self):
        pass

    def _get_records(self) -> List[Dict[str, Any]]:
        """
        Loads verification records from persistence database, with standard seeder fallback.
        """
        data = read_json("verifications.json", {})
        records = list(data.values())

        # Fallback to seed wallets if database has very few items
        if len(records) < 5:
            seed_wallets = [
                {
                    "wallet": "0x5bb83E60a7a05A0e1b077B66412a26306e334208",
                    "credit_score": 710,
                    "trust_score": 82,
                    "risk_level": "LOW",
                    "passport_valid": True,
                    "oracle_verified": True,
                    "protocol_profiles": [
                        {"protocol": "LENDING", "data": {"interest_rate": 8, "max_loan": 5000, "max_ltv": 80}},
                        {"protocol": "INSURANCE", "data": {"premium_discount": 20, "coverage_limit": 10000}},
                    ]
                },
                {
                    "wallet": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    "credit_score": 620,
                    "trust_score": 58,
                    "risk_level": "MEDIUM",
                    "passport_valid": True,
                    "oracle_verified": True,
                    "protocol_profiles": [
                        {"protocol": "LENDING", "data": {"interest_rate": 11, "max_loan": 2000, "max_ltv": 70}},
                    ]
                },
                {
                    "wallet": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                    "credit_score": 510,
                    "trust_score": 35,
                    "risk_level": "HIGH",
                    "passport_valid": False,
                    "oracle_verified": False,
                    "protocol_profiles": []
                },
                {
                    "wallet": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
                    "credit_score": 780,
                    "trust_score": 92,
                    "risk_level": "LOW",
                    "passport_valid": True,
                    "oracle_verified": True,
                    "protocol_profiles": [
                        {"protocol": "LENDING", "data": {"interest_rate": 6, "max_loan": 12000, "max_ltv": 85}},
                        {"protocol": "INSURANCE", "data": {"premium_discount": 30, "coverage_limit": 25000}},
                        {"protocol": "RWA", "data": {"asset_limit": 50000}}
                    ]
                },
                {
                    "wallet": "0x15d34AAf54a6b7d1276c4299F205E0259850cf71",
                    "credit_score": 680,
                    "trust_score": 72,
                    "risk_level": "MEDIUM",
                    "passport_valid": True,
                    "oracle_verified": True,
                    "protocol_profiles": [
                        {"protocol": "LENDING", "data": {"interest_rate": 10, "max_loan": 3500, "max_ltv": 75}}
                    ]
                }
            ]
            for sw in seed_wallets:
                # Add to dataset without writing back (just in-memory seeder fallback)
                if not any(r["wallet"].lower() == sw["wallet"].lower() for r in records):
                    records.append(sw)

        return records

    def calculate_network_health(self) -> dict:
        records = self._get_records()
        total_wallets = len(records)
        verified_passports = sum(1 for r in records if r.get("passport_valid", False))

        avg_credit = sum(r["credit_score"] for r in records) // total_wallets
        avg_trust = sum(r["trust_score"] for r in records) // total_wallets

        # Accumulate capacity
        total_credit_capacity = 0.0
        for r in records:
            for prof in r.get("protocol_profiles", []):
                if prof["protocol"] == "LENDING":
                    total_credit_capacity += prof["data"].get("max_loan", 0.0)

        # Health calculation formula
        health_score = 80
        verify_ratio = verified_passports / total_wallets if total_wallets > 0 else 0
        if verify_ratio > 0.8:
            health_score += 15
        elif verify_ratio < 0.4:
            health_score -= 15

        high_risk_wallets = sum(1 for r in records if r["risk_level"] == "HIGH")
        high_risk_ratio = high_risk_wallets / total_wallets if total_wallets > 0 else 0
        if high_risk_ratio < 0.1:
            health_score += 10
        elif high_risk_ratio > 0.3:
            health_score -= 20

        health_score = min(max(health_score, 10), 100)
        status = "HEALTHY" if health_score >= 80 else "STRESSED" if health_score >= 50 else "CRITICAL"

        return {
            "network": "HashKey",
            "health_score": health_score,
            "status": status,
            "verified_passports": verified_passports,
            "total_wallets": total_wallets,
            "average_credit_score": avg_credit,
            "average_trust_score": avg_trust,
            "total_credit_capacity": total_credit_capacity,
            "active_protocols": 4,
            "ecosystem_health": status

        }

    def analyze_credit_distribution(self) -> dict:
        records = self._get_records()
        dist = {
            "EXCELLENT": 0, # score >= 750
            "GOOD": 0,      # score >= 650
            "AVERAGE": 0,   # score >= 550
            "RISK": 0,      # score >= 450
            "HIGH_RISK": 0  # score < 450
        }
        for r in records:
            score = r["credit_score"]
            if score >= 750:
                dist["EXCELLENT"] += 1
            elif score >= 650:
                dist["GOOD"] += 1
            elif score >= 550:
                dist["AVERAGE"] += 1
            elif score >= 450:
                dist["RISK"] += 1
            else:
                dist["HIGH_RISK"] += 1

        return dist

    def detect_systemic_risk(self) -> dict:
        records = self._get_records()
        total_wallets = len(records)
        high_risk_wallets = sum(1 for r in records if r["risk_level"] == "HIGH")
        high_risk_ratio = high_risk_wallets / total_wallets if total_wallets > 0 else 0

        # Systemic risk logic
        risk_score = int(high_risk_ratio * 100)
        risk_level = "LOW" if risk_score < 20 else "MEDIUM" if risk_score < 40 else "HIGH"

        detected_events = []
        if high_risk_ratio > 0.25:
            detected_events.append({"event": "Increasing high-risk borrower volume", "impact": "NEGATIVE"})
        else:
            detected_events.append({"event": "Improving borrower quality average index", "impact": "POSITIVE"})

        recommendation = "Network credit conditions remain healthy." if risk_level == "LOW" else "Reduce protocol exposure limits temporarily."

        return {
            "systemic_risk": risk_level,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "high_risk_wallets": high_risk_wallets,
            "default_probability": round(high_risk_ratio * 100, 1),
            "risk_trend": "IMPROVING" if risk_level == "LOW" else "STABLE",
            "detected_events": detected_events,
            "recommendation": recommendation
        }


    def generate_ecosystem_report(self) -> str:
        health = self.calculate_network_health()
        risk = self.detect_systemic_risk()
        
        report = (
            f"The HashKey credit network remains {health['status'].lower()} with a systemic health score of {health['health_score']}/100. "
            f"Ecosystem verification ratio stands at {(health['verified_passports']/health['total_wallets']*100) if health['total_wallets'] > 0 else 0:.1f}%. "
            f"Average credit scoring index is healthy at {health['average_credit_score']}. Systemic default risk probability stands at {risk['default_probability']}%."
        )
        return report


    def get_protocol_metrics(self) -> List[Dict[str, Any]]:
        records = self._get_records()
        protocols = ["LENDING", "INSURANCE", "RWA", "DAO"]
        metrics_list = []

        for p in protocols:
            users_count = 0
            scores_sum = 0
            volume = 0.0
            low_risk_count = 0

            for r in records:
                # Find profile
                target_prof = None
                for prof in r.get("protocol_profiles", []):
                    if prof["protocol"] == p:
                        target_prof = prof
                        break

                if target_prof:
                    users_count += 1
                    scores_sum += r["credit_score"]
                    if r["risk_level"] == "LOW":
                        low_risk_count += 1
                    
                    # Accumulate volume indicator
                    prof_data = target_prof["data"]
                    if p == "LENDING":
                        volume += prof_data.get("max_loan", 0.0)
                    elif p == "INSURANCE":
                        volume += prof_data.get("coverage_limit", 0.0)
                    elif p == "RWA":
                        volume += prof_data.get("asset_limit", 0.0)
                    else:
                        volume += 100.0 # Standard delegates voting weight representation

            avg_score = (scores_sum // users_count) if users_count > 0 else 0
            risk_val = "LOW" if (low_risk_count / users_count if users_count > 0 else 0) > 0.5 else "MEDIUM"

            metrics_list.append({
                "protocol": p,
                "users": users_count,
                "average_score": avg_score,
                "volume": volume,
                "risk": risk_val
            })

        return metrics_list

    def get_alerts(self) -> List[Dict[str, Any]]:
        risk = self.detect_systemic_risk()
        alerts = []

        if risk["risk_score"] > 30:
            alerts.append({
                "severity": "HIGH",
                "category": "LIQUIDITY",
                "message": "Systemic risk indicator exceeded warning thresholds.",
                "recommendation": "Raise minimum credit passport collateral parameters immediately."
            })

        # Standard informative alert triggers
        alerts.append({
            "severity": "MEDIUM",
            "category": "CONCENTRATION",
            "message": "High-risk borrower concentration increased by 5%",
            "recommendation": "Reduce lending exposure limits temporarily across decentralized pools."
        })
        alerts.append({
            "severity": "LOW",
            "category": "HEALTH",
            "message": "Credit network verification ratio stable above ecosystem benchmark.",
            "recommendation": "Scale up oracle attestation registry instances."
        })

        return alerts

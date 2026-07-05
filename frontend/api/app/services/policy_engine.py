import os
import json
import uuid
import hashlib
from datetime import datetime, timezone
from typing import List, Dict, Any
from web3 import Web3
from app.database.persistence import read_json, write_json
from app.services.verification_network import VerificationNetwork
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine

DB_FILENAME = "policies.json"

class PolicyEngine:
    def __init__(self):
        pass

    def list_policies(self) -> list:
        data = read_json(DB_FILENAME, {})
        return list(data.values())

    def get_policy(self, policy_id: str) -> dict or None:
        data = read_json(DB_FILENAME, {})
        return data.get(policy_id)

    def register_policy(self, policy_data: dict) -> dict:
        """
        Registers a new credit policy in the database.
        """
        policy_id = "pol_" + str(uuid.uuid4()).replace("-", "")[:12]
        now = datetime.now(timezone.utc)
        
        # Initialize record
        record = {
            "policy_id": policy_id,
            "policy_name": policy_data["policy_name"],
            "protocol": policy_data["protocol"].upper(),
            "version": policy_data.get("version", "1.0.0"),
            "rules": policy_data["rules"],
            "created_at": now.isoformat().replace("+00:00", "Z")
        }

        data = read_json(DB_FILENAME, {})
        data[policy_id] = record
        write_json(DB_FILENAME, data)
        return record

    def update_policy(self, policy_id: str, policy_data: dict) -> dict:
        data = read_json(DB_FILENAME, {})
        if policy_id not in data:
            raise ValueError("Policy not found")

        record = data[policy_id]
        record["policy_name"] = policy_data.get("policy_name", record["policy_name"])
        record["protocol"] = policy_data.get("protocol", record["protocol"]).upper()
        record["version"] = policy_data.get("version", record["version"])
        record["rules"] = policy_data.get("rules", record["rules"])

        data[policy_id] = record
        write_json(DB_FILENAME, data)
        return record

    def delete_policy(self, policy_id: str) -> bool:
        data = read_json(DB_FILENAME, {})
        if policy_id in data:
            del data[policy_id]
            write_json(DB_FILENAME, data)
            return True
        return False

    def export_policy(self, policy_id: str) -> dict:
        """
        Generates portable JSON policy template with SHA256 checksum validation.
        """
        policy = self.get_policy(policy_id)
        if not policy:
            raise ValueError("Policy not found")

        # Deterministic checksum of policy rules
        rules_serialized = json.dumps(policy["rules"], sort_keys=True)
        checksum = hashlib.sha256(rules_serialized.encode()).hexdigest()

        return {
            "policy_version": policy["version"],
            "protocol": policy["protocol"],
            "rules": policy["rules"],
            "checksum": checksum
        }

    def evaluate_policy(self, wallet: str, policy_id: str) -> dict:
        """
        Resolves wallet credentials and matches criteria deterministically.
        """
        policy = self.get_policy(policy_id)
        if not policy:
            raise ValueError("Policy not found")

        wallet_checksum = Web3.to_checksum_address(wallet)
        
        # 1. Fetch live metrics from VerificationNetwork & features
        vn = VerificationNetwork()
        record = vn.get_verification_by_wallet(wallet_checksum)
        if not record:
            record = vn.verify_wallet(wallet_checksum)

        analyzer = WalletAnalyzer()
        credit_engine = CreditEngine()
        features = analyzer.analyze(wallet_checksum)
        credit_profile = credit_engine.calculate(features)

        # Build flattened parameters map
        metrics = {
            "credit_score": record["credit_score"],
            "trust_score": record["trust_score"],
            "risk_level": record["risk_level"],
            "passport_verified": record["passport_valid"],
            "oracle_verified": record["oracle_verified"],
            "wallet_age": features.get("wallet_age_days", 0),
            "default_probability": credit_profile.probability_of_default,
            "badges": record.get("badges", []),
            "segments": record.get("segments", []),
        }

        # Expose protocol profile attributes flatly
        for profile in record["protocol_profiles"]:
            prefix = profile["protocol"].lower()
            for k, v in profile["data"].items():
                metrics[f"{prefix}_{k}"] = v
                metrics[k] = v

        # 2. Evaluate rules
        matched_rules = 0
        failed_rules = 0
        failed_reasons = []

        for rule in policy["rules"]:
            field = rule["field"]
            operator = rule["operator"]
            rule_value = rule["value"]

            if field not in metrics:
                # Missing fields fail the criteria
                failed_rules += 1
                failed_reasons.append(f"Field '{field}' not found in wallet parameters.")
                continue

            field_val = metrics[field]
            rule_passed = self._eval_rule(field_val, operator, rule_value)

            if rule_passed:
                matched_rules += 1
            else:
                failed_rules += 1
                failed_reasons.append(f"Failed rule: {field} {operator} {rule_value} (actual: {field_val})")

        total_rules = len(policy["rules"])
        passed = (failed_rules == 0)
        score = (matched_rules / total_rules * 100) if total_rules > 0 else 100.0

        if passed:
            reason = f"Wallet satisfies all {policy['policy_name']} rules."
        else:
            reason = f"Verification rejected. Reasons: {'; '.join(failed_reasons)}"

        return {
            "wallet": wallet_checksum,
            "policy_id": policy_id,
            "passed": passed,
            "matched_rules": matched_rules,
            "failed_rules": failed_rules,
            "score": round(score, 1),
            "reason": reason
        }

    def _eval_rule(self, field_value: Any, operator: str, rule_value: Any) -> bool:
        try:
            if operator == "==":
                return str(field_value).lower() == str(rule_value).lower() if isinstance(field_value, bool) else field_value == rule_value
            elif operator == "!=":
                return field_value != rule_value
            elif operator == ">":
                return float(field_value) > float(rule_value)
            elif operator == ">=":
                return float(field_value) >= float(rule_value)
            elif operator == "<":
                return float(field_value) < float(rule_value)
            elif operator == "<=":
                return float(field_value) <= float(rule_value)
            elif operator == "contains":
                if isinstance(field_value, list):
                    return rule_value in field_value
                return str(rule_value).lower() in str(field_value).lower()
        except Exception:
            return False
        return False

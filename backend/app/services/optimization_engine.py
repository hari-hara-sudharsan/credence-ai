from web3 import Web3
from datetime import datetime, timezone
from app.services.verification_network import VerificationNetwork
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.action_simulator import ActionSimulator

class CreditOptimizationEngine:
    def __init__(self):
        self.simulator = ActionSimulator()

    def analyze_weaknesses(self, wallet: str) -> list:
        """
        Scans wallet features to classify weakness segments.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        analyzer = WalletAnalyzer()
        features = analyzer.analyze(checksum_wallet)

        weaknesses = []
        
        # 1. Low balance check
        if features.get("balance", 0) < 1.0:
            weaknesses.append({
                "action_id": "act_collateral",
                "title": "Improve Collateral Standing",
                "description": "Deposit additional token assets into active borrow accounts to optimize margins.",
                "difficulty": "EASY",
                "expected_score_gain": 20,
                "estimated_time_days": 3,
                "priority": 3
            })

        # 2. Low transaction counts
        if features.get("tx_count", 0) < 15:
            weaknesses.append({
                "action_id": "act_activity",
                "title": "Increase Wallet Activity Velocity",
                "description": "Perform consistent weekly smart contract executions to build on-chain footprints.",
                "difficulty": "EASY",
                "expected_score_gain": 30,
                "estimated_time_days": 14,
                "priority": 2
            })

        # 3. Protocol diversity
        if len(features.get("active_protocols", [])) < 3:
            weaknesses.append({
                "action_id": "act_diversify",
                "title": "Diversify Protocol Engagements",
                "description": "Allocate collateral shares across at least 3 distinct money markets adapters.",
                "difficulty": "MEDIUM",
                "expected_score_gain": 40,
                "estimated_time_days": 30,
                "priority": 1
            })

        # 4. Reputation / age longevity
        if features.get("age_days", 0) < 180:
            weaknesses.append({
                "action_id": "act_history",
                "title": "Build Long-term History",
                "description": "Maintain active credentials state over continuous months.",
                "difficulty": "HARD",
                "expected_score_gain": 25,
                "estimated_time_days": 90,
                "priority": 4
            })

        # Always append repay option as high priority if they have active checks
        weaknesses.append({
            "action_id": "act_repay",
            "title": "Complete successful repayments",
            "description": "Fully settle outstanding loan allocations ahead of payment term ends.",
            "difficulty": "EASY",
            "expected_score_gain": 55,
            "estimated_time_days": 7,
            "priority": 1
        })

        return self.rank_actions(weaknesses)

    def rank_actions(self, actions: list) -> list:
        return sorted(actions, key=lambda x: (x["priority"], -x["expected_score_gain"]))

    def generate_plan(self, wallet: str) -> dict:
        """
        Structures a tailored optimization roadmap for the wallet.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        
        vn = VerificationNetwork()
        verify_record = vn.get_verification_by_wallet(checksum_wallet)
        if not verify_record:
            verify_record = vn.verify_wallet(checksum_wallet)

        current_score = verify_record["credit_score"]
        actions = self.analyze_weaknesses(checksum_wallet)

        # Sum of actions duration estimate capped
        estimated_days = max([a["estimated_time_days"] for a in actions]) if actions else 30
        target_score = min(current_score + sum([a["expected_score_gain"] for a in actions[:3]]), 900)

        return {
            "wallet": checksum_wallet,
            "current_score": current_score,
            "target_score": target_score,
            "estimated_days": estimated_days,
            "actions": actions,
            "created_at": datetime.now(timezone.utc)
        }

    def track_progress(self, wallet: str) -> dict:
        """
        Calculates credit progress metrics toward safety boundaries.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        plan = self.generate_plan(checksum_wallet)

        curr = plan["current_score"]
        target = plan["target_score"]

        progress_pct = 100.0
        if target > curr:
            # Progress percentage calculates how close we are to 800 (Institutional grade default target)
            progress_pct = round(((curr - 300) / (800 - 300)) * 100, 1)
            progress_pct = max(min(progress_pct, 100.0), 0.0)

        return {
            "wallet": checksum_wallet,
            "current_score": curr,
            "target_score": 800,
            "progress_percent": progress_pct,
            "completed_actions_count": 1 if curr > 600 else 0,
            "pending_actions_count": len(plan["actions"]),
            "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }

    def generate_goal_path(self, wallet: str, target_goal: str) -> dict:
        """
        Optimizes actions based on dynamic targets (e.g. "Institutional Grade").
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        plan = self.generate_plan(checksum_wallet)
        
        # Maps user inputs description
        curr = plan["current_score"]
        status = "Trusted" if curr >= 650 else "Standard"

        req_actions = [a["title"] for a in plan["actions"][:3]]
        if not req_actions:
            req_actions = ["Maintain repayments", "Increase protocol history", "Improve diversification"]

        return {
            "current_status": status,
            "target": target_goal,
            "required_actions": req_actions,
            "estimated_completion": f"{plan['estimated_days']} days"
        }

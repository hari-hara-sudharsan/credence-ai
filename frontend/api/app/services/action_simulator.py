from web3 import Web3
from app.services.verification_network import VerificationNetwork

class ActionSimulator:
    def __init__(self):
        pass

    def simulate_action(self, wallet: str, action: str) -> dict:
        """
        Projects score changes based on simulated remediation actions.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        action_upper = action.upper()

        # Get current score from verification network
        vn = VerificationNetwork()
        verify_record = vn.get_verification_by_wallet(checksum_wallet)
        if not verify_record:
            verify_record = vn.verify_wallet(checksum_wallet)

        current_score = verify_record["credit_score"]

        # Expected gains by action type
        gains = {
            "REPAY_LOAN": (55, "Successful repayment improves reliability and credit utilization ratios."),
            "INCREASE_ACTIVITY": (30, "Continuous transaction velocity demonstrates active wallet liquidity."),
            "DIVERSIFY_PROTOCOLS": (40, "Interacting across multiple money markets limits singular pool exposure."),
            "BUILD_HISTORY": (25, "Longer record longevity builds history trust indices."),
            "REDUCE_RISK": (35, "Reducing active debt ratios lowers forward-looking default probabilities."),
            "IMPROVE_COLLATERAL": (20, "Maintaining higher margin collateral indexes protects liquidations threat.")
        }

        gain, reason = gains.get(action_upper, (15, "Action builds incremental trust points."))
        predicted_score = min(current_score + gain, 900)
        score_diff = predicted_score - current_score

        return {
            "wallet": checksum_wallet,
            "action": action_upper,
            "current_score": current_score,
            "predicted_score": predicted_score,
            "score_difference": score_diff,
            "confidence": 89.0 if action_upper == "REPAY_LOAN" else 85.0,
            "reason": reason
        }

    def compare_actions(self, wallet: str, actions: list) -> list:
        results = []
        for act in actions:
            results.append(self.simulate_action(wallet, act))
        return results

    def estimate_impact(self, wallet: str, action: str) -> int:
        res = self.simulate_action(wallet, action)
        return res["score_difference"]

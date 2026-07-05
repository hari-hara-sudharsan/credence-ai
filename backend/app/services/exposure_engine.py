from web3 import Web3
from app.services.verification_network import VerificationNetwork
from app.contracts.loan_reader import LoanReader

class ExposureEngine:
    def __init__(self):
        try:
            self.loan_reader = LoanReader()
        except Exception:
            self.loan_reader = None

    def _get_wallet_exposure(self, wallet: str) -> float:
        """
        Reads actual active loan amounts from the on-chain LoanManager contract.
        Returns total outstanding principal for the wallet.
        """
        if not self.loan_reader:
            return 0.0
        try:
            active_loans = self.loan_reader.get_active_loans(wallet)
            return sum(loan["amount"] for loan in active_loans)
        except Exception:
            return 0.0

    def calculate_exposure(self, wallets: list) -> dict:
        """
        Determines total and risk-adjusted credit capacity exposure bounds
        using real on-chain loan data from the LoanManager contract.
        """
        vn = VerificationNetwork()
        total = 0.0
        risk_adjusted = 0.0
        high_risk_wallets = []

        for w in wallets:
            checksum_w = Web3.to_checksum_address(w)
            val = vn.get_verification_by_wallet(checksum_w)
            if not val:
                val = vn.verify_wallet(checksum_w)

            risk = val["risk_level"]

            # Read real active loan exposure from on-chain LoanManager
            exposure = self._get_wallet_exposure(checksum_w)
            total += exposure

            if risk == "HIGH":
                risk_adjusted += exposure * 1.5  # weight high risk exposures
                high_risk_wallets.append({
                    "wallet": checksum_w,
                    "credit_score": val["credit_score"],
                    "exposure": exposure
                })
            else:
                risk_adjusted += exposure * 0.8

        recs = []
        if len(high_risk_wallets) > 0:
            recs.append("Reduce high-risk exposure bounds immediately.")
            recs.append("Increase collateral requirements index for watchlisted borrow accounts.")
        else:
            recs.append("Portfolio exposures remain normal.")

        return {
            "total_exposure": total,
            "risk_adjusted_exposure": risk_adjusted,
            "highest_risk_wallets": high_risk_wallets,
            "recommended_actions": recs
        }

    def detect_concentration_risk(self, wallets: list) -> bool:
        res = self.calculate_exposure(wallets)
        return len(res["highest_risk_wallets"]) > 2

    def recommend_limits(self, wallet: str) -> float:
        """
        Recommends max credit limit based on credit score minus existing on-chain exposure.
        """
        checksum_w = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        val = vn.get_verification_by_wallet(checksum_w)
        if not val:
            val = vn.verify_wallet(checksum_w)

        # Max limit based on score, minus existing active loan exposure
        max_limit = float(val["credit_score"] * 10)
        current_exposure = self._get_wallet_exposure(checksum_w)
        return max(0.0, max_limit - current_exposure)

from web3 import Web3
from app.services.verification_network import VerificationNetwork
from app.services.predictive_engine import PredictiveRiskEngine
from app.services.policy_engine import PolicyEngine
from app.contracts.loan_reader import LoanReader

class MarketplaceEngine:
    def __init__(self):
        try:
            self.loan_reader = LoanReader()
        except Exception:
            self.loan_reader = None

    def list_verified_borrowers(self) -> list:
        """
        Retrieves all verified credentials profiles from the verification registry,
        ranks them dynamically, and maps badges.
        """
        from app.database.persistence import read_json
        from app.services.verification_network import DB_FILENAME
        all_verifications = list(read_json(DB_FILENAME, {}).values())


        borrowers = []
        for val in all_verifications:
            wallet = val["wallet"]
            credit_score = val["credit_score"]
            trust_score = val["trust_score"]
            risk_level = val["risk_level"]
            passport_verified = val["passport_valid"]
            trust_badge = val.get("trust_seal", val.get("badge", "BRONZE"))
            # Calculate available credit from max limit minus on-chain active loans
            max_credit = float(credit_score * 10)
            active_exposure = 0.0
            if self.loan_reader:
                try:
                    active_loans = self.loan_reader.get_active_loans(wallet)
                    active_exposure = sum(l["amount"] for l in active_loans)
                except Exception:
                    pass
            available_credit = max(0.0, max_credit - active_exposure)
            
            # Rank score computation helper
            rank_score = (credit_score * 0.5) + (trust_score * 0.5)
            if passport_verified:
                rank_score += 100
            if risk_level == "HIGH":
                rank_score -= 200

            borrowers.append({
                "wallet": wallet,
                "credit_score": credit_score,
                "trust_score": trust_score,
                "risk_level": risk_level,
                "passport_verified": passport_verified,
                "trust_badge": trust_badge,
                "available_credit": available_credit,
                "protocol_profiles": val.get("protocol_profiles", []),
                "rank_score": rank_score,
                "rank": 999
            })

        # Sort descending by rank score
        borrowers.sort(key=lambda x: x["rank_score"], reverse=True)

        # Assign ranks
        for idx, b in enumerate(borrowers):
            b["rank"] = idx + 1
            del b["rank_score"]

        return borrowers

    def rank_wallets(self) -> list:
        return self.list_verified_borrowers()

    def match_lenders(self, wallet: str) -> list:
        """
        Computes lender pools matches based on risk profiles compatibility.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        val = vn.get_verification_by_wallet(checksum_wallet)
        if not val:
            val = vn.verify_wallet(checksum_wallet)

        risk = val["risk_level"]
        score = val["credit_score"]

        # Formulate matching lender pools
        matches = []
        
        # Pool 1
        comp1 = 95 if risk == "LOW" else 70 if risk == "MEDIUM" else 45
        matches.append({
            "lender_id": "pool_aave_stable",
            "borrower": checksum_wallet,
            "compatibility_score": comp1,
            "expected_risk": risk,
            "suggested_terms": {
                "max_ltv": 75 if risk == "LOW" else 65 if risk == "MEDIUM" else 50,
                "interest_rate_apy": 4.5 if risk == "LOW" else 6.8 if risk == "MEDIUM" else 9.5
            }
        })

        # Pool 2
        comp2 = 90 if score > 700 else 75 if score > 600 else 55
        matches.append({
            "lender_id": "pool_hashkey_alpha",
            "borrower": checksum_wallet,
            "compatibility_score": comp2,
            "expected_risk": "LOW" if score > 700 else "MEDIUM",
            "suggested_terms": {
                "max_ltv": 80 if score > 700 else 70 if score > 600 else 60,
                "interest_rate_apy": 3.8 if score > 700 else 5.5 if score > 600 else 8.0
            }
        })

        return matches

    def match_protocols(self, wallet: str) -> list:
        """
        Matches active protocol adapter eligibility flags.
        """
        checksum_wallet = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        val = vn.get_verification_by_wallet(checksum_wallet)
        if not val:
            val = vn.verify_wallet(checksum_wallet)

        score = val["credit_score"]

        matches = []
        # Match 1: Lending Protocol
        elig1 = 100.0 if score >= 650 else 70.0 if score >= 550 else 30.0
        matches.append({
            "protocol": "AaveAdapter",
            "wallet": checksum_wallet,
            "eligibility": elig1,
            "reason": "Meets core credit requirements for standard money markets." if elig1 > 50 else "High risk default profile limits access."
        })

        # Match 2: Insurance Pool Protocol
        elig2 = 100.0 if score >= 700 else 50.0 if score >= 600 else 10.0
        matches.append({
            "protocol": "InsuranceAdapter",
            "wallet": checksum_wallet,
            "eligibility": elig2,
            "reason": "Qualifies for reduced leverage coverage boundaries." if elig2 > 50 else "Requires score improvement before pool coverage release."
        })

        return matches

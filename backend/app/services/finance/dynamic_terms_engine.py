class DynamicTermsEngine:
    def calculateLoanTerms(self, score: int) -> dict:
        """
        Calculate borrower limits and rates based on trust score.
        """
        if score >= 700:
            return {"limit": 10000.0, "interest": 5.0}
        elif score >= 450:
            return {"limit": 1000.0, "interest": 15.0}
        else:
            return {"limit": 100.0, "interest": 25.0}

    def calculatePayFiLimit(self, score: int) -> float:
        """
        Determine instant PayFi line of credit based on trust score.
        """
        if score >= 700:
            return 5000.0
        elif score >= 450:
            return 1000.0
        return 200.0

    def calculateCollateralRequirement(self, score: int) -> float:
        """
        Calculate required collateral ratio based on trust score.
        """
        if score >= 700:
            return 20.0 # 20%
        elif score >= 450:
            return 80.0 # 80%
        return 150.0 # 150%

    # Python snake_case aliases
    calculate_loan_terms = calculateLoanTerms
    calculate_payfi_limit = calculatePayFiLimit
    calculate_collateral_requirement = calculateCollateralRequirement

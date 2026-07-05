from app.models.lending_decision import LendingDecision


class LendingEngine:

    def evaluate(
        self,
        profile,
        features
    ):

        balance = features["balance"]

        score = profile.credit_score

        if score >= 800:

            return LendingDecision(
                eligible=True,
                max_loan_amount=balance * 0.9,
                collateral_ratio=110,
                interest_rate=4.5,
                risk_level="LOW",
                decision_reason="Excellent credit profile"
            )

        if score >= 700:

            return LendingDecision(
                eligible=True,
                max_loan_amount=balance * 0.8,
                collateral_ratio=115,
                interest_rate=6.0,
                risk_level="LOW"
                ,
                decision_reason="Strong credit profile"
            )

        if score >= 600:

            return LendingDecision(
                eligible=True,
                max_loan_amount=balance * 0.7,
                collateral_ratio=125,
                interest_rate=8.0,
                risk_level="MEDIUM",
                decision_reason="Moderate credit profile"
            )

        if score >= 500:

            return LendingDecision(
                eligible=True,
                max_loan_amount=balance * 0.5,
                collateral_ratio=140,
                interest_rate=10.0,
                risk_level="HIGH",
                decision_reason="Higher lending risk"
            )

        return LendingDecision(
            eligible=False,
            max_loan_amount=0,
            collateral_ratio=150,
            interest_rate=15.0,
            risk_level="VERY_HIGH",
            decision_reason="Credit score below lending threshold"
        )
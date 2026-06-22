from app.models.credit_insight import (
    CreditInsight
)


class AICreditAnalyst:

    def generate(
        self,
        wallet: str,
        features: dict,
        profile
    ):

        strengths = []

        weaknesses = []

        recommendations = []

        if features["wallet_age_days"] > 365:

            strengths.append(
                "Long wallet history"
            )

        else:

            weaknesses.append(
                "Limited wallet history"
            )

        if features["transaction_count"] < 20:

            weaknesses.append(
                "Very low transaction activity"
            )

            recommendations.append(
                "Increase protocol participation"
            )

        if features[
            "protocol_diversity_score"
        ] < 40:

            weaknesses.append(
                "Low DeFi diversification"
            )

            recommendations.append(
                "Use lending and staking protocols"
            )

        if features[
            "sybil_risk_score"
        ] > 80:

            strengths.append(
                "Low Sybil risk"
            )

        risk_summary = (
            f"Wallet rated "
            f"{profile.rating} "
            f"with default probability "
            f"{profile.probability_of_default}%."
        )

        return CreditInsight(
            wallet=wallet,
            credit_score=profile.credit_score,
            rating=profile.rating,
            risk_summary=risk_summary,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendations=recommendations
        )
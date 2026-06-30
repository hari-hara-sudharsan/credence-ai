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

        # --- Wallet age ---
        if features["wallet_age_days"] > 365:

            strengths.append(
                "Long wallet history"
            )

        else:

            weaknesses.append(
                "Limited wallet history"
            )

            recommendations.append(
                "Maintain an active wallet over a longer period to build history"
            )

        # --- Transaction activity ---
        if features["transaction_count"] < 20:

            weaknesses.append(
                "Very low transaction activity"
            )

            recommendations.append(
                "Increase on-chain transaction frequency"
            )

        elif features["activity_score"] < 60:

            weaknesses.append(
                "Low transaction activity"
            )

            recommendations.append(
                "Increase protocol participation with regular transactions"
            )

        else:

            strengths.append(
                "Healthy transaction activity"
            )

        # --- Protocol diversity ---
        if features[
            "protocol_diversity_score"
        ] < 40:

            weaknesses.append(
                "Low DeFi diversification"
            )

            recommendations.append(
                "Interact with lending, staking, and DEX protocols to diversify"
            )

        elif features[
            "protocol_diversity_score"
        ] < 60:

            weaknesses.append(
                "Moderate DeFi diversification"
            )

            recommendations.append(
                "Use a wider range of DeFi protocols to improve diversification"
            )

        else:

            strengths.append(
                "Good protocol diversification"
            )

        # --- Asset stability ---
        if features[
            "asset_stability_score"
        ] < 50:

            weaknesses.append(
                "Low asset balance"
            )

            recommendations.append(
                "Build a more stable on-chain asset base"
            )

        # --- Sybil risk ---
        if features[
            "sybil_risk_score"
        ] > 80:

            strengths.append(
                "Low Sybil risk"
            )

        else:

            weaknesses.append(
                "Elevated Sybil risk signal"
            )

            recommendations.append(
                "Establish organic, long-term wallet activity to reduce Sybil risk"
            )

        # --- Catch-all for HIGH_RISK wallets with no recommendations ---
        if (
            not recommendations
            and profile.rating == "HIGH_RISK"
        ):
            recommendations.append(
                "Increase overall on-chain activity and diversify protocol usage"
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
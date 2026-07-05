from app.models.credit_profile import CreditProfile


class CreditEngine:

    def calculate(
        self,
        wallet_features: dict
    ):

        age_days = wallet_features["wallet_age_days"]

        activity_score = wallet_features["activity_score"]

        tx_count = wallet_features["transaction_count"]

        longevity = self.longevity_score(
            age_days
        )

        activity = activity_score * 1.5

        stability = (
            wallet_features[
                "asset_stability_score"
            ] * 1.5
        )

        diversity = (
            wallet_features[
                "protocol_diversity_score"
            ] * 2
        )

        reliability = (
            wallet_features[
                "financial_reliability_score"
            ] * 2.5
        )

        sybil = (
            wallet_features[
                "sybil_risk_score"
            ]
        )

        credit_score = int(
            longevity +
            activity +
            stability +
            diversity +
            reliability +
            sybil
        )

        confidence = self.calculate_confidence(
            tx_count,
            age_days
        )

        rating = self.rating(
            credit_score
        )

        prob_default = self.probability_of_default(
            credit_score
        )

        return CreditProfile(
            credit_score=credit_score,
            rating=rating,
            confidence=confidence,
            probability_of_default=prob_default
        )

    def longevity_score(
        self,
        age_days: int
    ):

        if age_days >= 730:
            return 150

        if age_days >= 365:
            return 120

        if age_days >= 180:
            return 80

        return 40

    def calculate_confidence(
        self,
        tx_count: int,
        age_days: int
    ):

        score = 0

        score += min(
            tx_count,
            50
        )

        score += min(
            age_days // 30,
            50
        )

        return min(
            score,
            100
        )

    def rating(
        self,
        score: int
    ):

        if score >= 900:
            return "AAA"

        if score >= 800:
            return "AA"

        if score >= 700:
            return "A"

        if score >= 600:
            return "BBB"

        if score >= 500:
            return "BB"

        return "HIGH_RISK"

    def probability_of_default(
        self,
        credit_score: int
    ):

        if credit_score >= 900:
            return 1.0

        if credit_score >= 800:
            return 2.5

        if credit_score >= 700:
            return 5.0

        if credit_score >= 600:
            return 10.0

        return 25.0
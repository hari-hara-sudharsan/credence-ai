class FeatureExtractor:

    def wallet_age_score(
        self,
        wallet_age_days: int
    ):

        if wallet_age_days > 365:
            return 150

        if wallet_age_days > 180:
            return 100

        return 50

    def tx_activity_score(
        self,
        tx_count: int
    ):

        if tx_count > 1000:
            return 100

        if tx_count > 500:
            return 75

        return 50  
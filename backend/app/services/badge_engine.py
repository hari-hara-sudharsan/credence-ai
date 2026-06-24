class BadgeEngine:

    @staticmethod
    def generate(features):

        badges = []

        if features["wallet_age_days"] > 365:
            badges.append(
                "Veteran Wallet"
            )

        if features["balance"] > 1000:
            badges.append(
                "Whale"
            )

        if features["transaction_count"] > 100:
            badges.append(
                "Power User"
            )

        if features["activity_score"] > 70:
            badges.append(
                "Trusted Borrower"
            )

        if len(badges) == 0:
            badges.append(
                "New Wallet"
            )

        return badges

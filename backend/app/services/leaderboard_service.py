class LeaderboardService:
    leaderboard = []

    @classmethod
    def update(cls, wallet, score, segment, badges):
        cls.leaderboard = [
            item
            for item in cls.leaderboard
            if item["wallet"] != wallet
        ]

        cls.leaderboard.append({
            "wallet": wallet,
            "score": score,
            "segment": segment,
            "badges": badges
        })

    @classmethod
    def get_rankings(cls):
        return sorted(
            cls.leaderboard,
            key=lambda x: x["score"],
            reverse=True
        )

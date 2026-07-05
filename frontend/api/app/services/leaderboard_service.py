from app.database.persistence import read_json, write_json


class LeaderboardService:

    @classmethod
    def _get_leaderboard(cls):
        return read_json("leaderboard.json", [])

    @classmethod
    def update(cls, wallet, score, segment, badges):
        leaderboard = cls._get_leaderboard()
        leaderboard = [
            item
            for item in leaderboard
            if item["wallet"] != wallet
        ]

        leaderboard.append({
            "wallet": wallet,
            "score": score,
            "segment": segment,
            "badges": badges
        })
        write_json("leaderboard.json", leaderboard)

    @classmethod
    def get_rankings(cls):
        leaderboard = cls._get_leaderboard()
        return sorted(
            leaderboard,
            key=lambda x: x["score"],
            reverse=True
        )

    @classmethod
    def update_for_wallet(cls, wallet: str):
        from app.services.wallet_analyzer import WalletAnalyzer
        from app.services.credit_engine import CreditEngine
        from app.services.segment_engine import SegmentEngine
        from app.services.badge_engine import BadgeEngine

        analyzer = WalletAnalyzer()
        features = analyzer.analyze(wallet)
        credit_engine = CreditEngine()
        profile = credit_engine.calculate(features)
        segment = SegmentEngine.classify(features)
        badges = BadgeEngine.generate(features)

        cls.update(
            wallet=wallet,
            score=profile.credit_score,
            segment=segment,
            badges=badges
        )


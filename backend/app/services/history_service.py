from datetime import datetime


class HistoryService:

    history_store = []

    @classmethod
    def add_record(
        cls,
        wallet,
        score,
        rating
    ):

        cls.history_store.append(
            {
                "wallet": wallet,
                "score": score,
                "rating": rating,
                "timestamp":
                datetime.utcnow().isoformat()
            }
        )

    @classmethod
    def get_history(
        cls,
        wallet
    ):

        return [
            item
            for item in cls.history_store
            if item["wallet"] == wallet
        ]
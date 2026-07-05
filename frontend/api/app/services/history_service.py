from datetime import datetime
from app.database.persistence import read_json, write_json


class HistoryService:

    @classmethod
    def _get_store(cls):
        return read_json("history.json", [])

    @classmethod
    def add_record(
        cls,
        wallet,
        score,
        rating
    ):
        store = cls._get_store()
        store.append(
            {
                "wallet": wallet,
                "score": score,
                "rating": rating,
                "timestamp":
                datetime.utcnow().isoformat()
            }
        )
        write_json("history.json", store)

    @classmethod
    def get_history(
        cls,
        wallet
    ):
        store = cls._get_store()
        return [
            item
            for item in store
            if item["wallet"] == wallet
        ]
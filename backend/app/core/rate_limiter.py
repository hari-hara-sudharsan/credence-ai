from datetime import datetime, timezone, timedelta

class RateLimiter:
    def __init__(self):
        # Maps client identifiers to request counts
        self.registry = {}

    def check_limit(self, client_id: str, tier: str) -> dict:
        """
        Calculates allowed flag and remaining request capacities.
        """
        now = datetime.now(timezone.utc)
        reset = now + timedelta(minutes=1)

        limit = 100
        if tier.upper() == "DEVELOPER":
            limit = 1000
        elif tier.upper() == "INSTITUTION":
            limit = 10000
        elif tier.upper() == "ADMIN":
            limit = 5000

        key = f"{client_id}_{tier}_{now.minute}"
        count = self.registry.get(key, 0)

        if count >= limit:
            return {
                "allowed": False,
                "remaining": 0,
                "reset_time": reset.isoformat()
            }

        count += 1
        self.registry[key] = count

        return {
            "allowed": True,
            "remaining": limit - count,
            "reset_time": reset.isoformat()
        }

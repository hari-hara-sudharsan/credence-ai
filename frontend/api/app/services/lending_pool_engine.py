from app.database.persistence import read_json, write_json
from app.services.interest_engine import DynamicInterestEngine

DB_FILENAME = "lending_pool.json"

class LendingPoolEngine:
    def __init__(self):
        self.interest_engine = DynamicInterestEngine()

    def _get_db(self) -> dict:
        db = read_json(DB_FILENAME, {})
        if not db:
            db = {
                "stats": {
                    "total_liquidity": 0.0,
                    "borrowed_amount": 0.0,
                    "available_liquidity": 0.0,
                    "total_interest_earned": 0.0,
                    "average_interest": 0.0
                },
                "lenders": {}
            }
            write_json(DB_FILENAME, db)
        return db

    def deposit(self, wallet: str, amount: float) -> dict:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        db = self._get_db()
        wallet_key = wallet.lower()

        # Update lender position
        lenders = db["lenders"]
        if wallet_key not in lenders:
            lenders[wallet_key] = {
                "wallet": wallet_key,
                "balance": 0.0,
                "shares": 0.0,
                "yield_earned": 0.0
            }
        
        lenders[wallet_key]["balance"] += amount
        lenders[wallet_key]["shares"] += amount

        # Update stats
        db["stats"]["total_liquidity"] += amount
        db["stats"]["available_liquidity"] += amount

        write_json(DB_FILENAME, db)
        return lenders[wallet_key]

    def withdraw(self, wallet: str, amount: float) -> dict:
        if amount <= 0:
            raise ValueError("Withdraw amount must be positive")
        
        db = self._get_db()
        wallet_key = wallet.lower()

        lenders = db["lenders"]
        if wallet_key not in lenders or lenders[wallet_key]["balance"] < amount:
            raise ValueError("Insufficient balance")
        
        if db["stats"]["available_liquidity"] < amount:
            raise ValueError("Insufficient pool available liquidity")

        lenders[wallet_key]["balance"] -= amount
        lenders[wallet_key]["shares"] -= amount

        # Update stats
        db["stats"]["total_liquidity"] -= amount
        db["stats"]["available_liquidity"] -= amount

        write_json(DB_FILENAME, db)
        return lenders[wallet_key]

    def allocate_credit(self, wallet: str, amount: float, loan_id: str) -> dict:
        db = self._get_db()
        if db["stats"]["available_liquidity"] < amount:
            raise ValueError("Insufficient available pool liquidity to allocate credit")

        db["stats"]["available_liquidity"] -= amount
        db["stats"]["borrowed_amount"] += amount

        write_json(DB_FILENAME, db)
        return db["stats"]

    def process_repayment(self, amount: float, interest: float) -> dict:
        db = self._get_db()
        
        db["stats"]["available_liquidity"] += amount + interest
        db["stats"]["borrowed_amount"] = max(0.0, db["stats"]["borrowed_amount"] - amount)
        db["stats"]["total_interest_earned"] += interest

        write_json(DB_FILENAME, db)
        return db["stats"]

    def get_pool_metrics(self) -> dict:
        db = self._get_db()
        stats = db["stats"]
        
        # Calculate dynamic utilization rate
        total = stats["total_liquidity"]
        borrowed = stats["borrowed_amount"]
        util = (borrowed / total * 100) if total > 0 else 0.0

        # Health metric
        health = "HEALTHY"
        if util > 90.0:
            health = "CRITICAL_LIQUIDITY_LIMIT"
        elif util > 75.0:
            health = "WARNING_HIGH_UTILIZATION"

        return {
            "total_liquidity": total,
            "borrowed_amount": borrowed,
            "available_liquidity": stats["available_liquidity"],
            "utilization_rate": round(util, 2),
            "average_interest": stats["average_interest"],
            "health": health
        }

    def get_lender_position(self, wallet: str) -> dict:
        db = self._get_db()
        wallet_key = wallet.lower()
        lenders = db["lenders"]
        
        if wallet_key not in lenders:
            return {
                "wallet": wallet_key,
                "balance": 0.0,
                "shares": 0.0,
                "yield_earned": 0.0
            }
        return lenders[wallet_key]

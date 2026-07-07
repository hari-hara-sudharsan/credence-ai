import os
from typing import List, Optional
from web3 import Web3
from app.database.persistence import read_json, write_json
from app.services.interest_engine import DynamicInterestEngine

DB_FILENAME = "lending_pool.json"

LENDING_POOL_ABI = [
    {
        "inputs": [],
        "name": "getPoolStats",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "totalDeposits", "type": "uint256"},
                    {"internalType": "uint256", "name": "totalBorrowed", "type": "uint256"},
                    {"internalType": "uint256", "name": "availableLiquidity", "type": "uint256"},
                    {"internalType": "uint256", "name": "totalInterestEarned", "type": "uint256"},
                    {"internalType": "uint256", "name": "totalShares", "type": "uint256"}
                ],
                "internalType": "struct LendingPool.PoolStats",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "lender", "type": "address"}],
        "name": "getLenderPosition",
        "outputs": [
            {"internalType": "uint256", "name": "shares", "type": "uint256"},
            {"internalType": "uint256", "name": "currentValue", "type": "uint256"},
            {"internalType": "uint256", "name": "depositedAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "earnedInterest", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class LendingPoolEngine:
    def __init__(self):
        self.interest_engine = DynamicInterestEngine()
        self.hsk_rpc = os.getenv("HSK_RPC", "http://127.0.0.1:8545")
        self.pool_address = os.getenv("LENDING_POOL_ADDRESS")
        
        self.contract = None
        if self.hsk_rpc and self.pool_address:
            try:
                from app.contracts.web3_provider import create_web3_with_retry
                self.w3 = create_web3_with_retry(self.hsk_rpc)
                self.contract = self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.pool_address),
                    abi=LENDING_POOL_ABI
                )
            except Exception as e:
                print(f"Warning: failed to initialize onchain LendingPool: {e}")
                self.contract = None

    def _get_db(self) -> dict:
        db = read_json(DB_FILENAME, {})
        if not db:
            db = {
                "stats": {
                    "total_liquidity": 0.0,
                    "borrowed_amount": 0.0,
                    "available_liquidity": 0.0,
                    "total_interest_earned": 0.0,
                    "average_interest": 5.0
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
        
        if self.contract:
            try:
                return self.get_lender_position(wallet)
            except Exception:
                pass
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
        
        if self.contract:
            try:
                return self.get_lender_position(wallet)
            except Exception:
                pass
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
        if self.contract:
            try:
                stats_tuple = self.contract.functions.getPoolStats().call()
                total = float(Web3.from_wei(stats_tuple[0], 'ether'))
                borrowed = float(Web3.from_wei(stats_tuple[1], 'ether'))
                available = float(Web3.from_wei(stats_tuple[2], 'ether'))
                interest = float(Web3.from_wei(stats_tuple[3], 'ether'))
                
                util = (borrowed / total * 100) if total > 0 else 0.0
                health = "HEALTHY"
                if util > 90.0:
                    health = "CRITICAL_LIQUIDITY_LIMIT"
                elif util > 75.0:
                    health = "WARNING_HIGH_UTILIZATION"

                return {
                    "total_liquidity": total,
                    "borrowed_amount": borrowed,
                    "available_liquidity": available,
                    "utilization_rate": round(util, 2),
                    "average_interest": 5.0,
                    "health": health
                }
            except Exception as e:
                print(f"LendingPool onchain stats query failed: {e}. Falling back to database...")

        db = self._get_db()
        stats = db["stats"]
        total = stats["total_liquidity"]
        borrowed = stats["borrowed_amount"]
        util = (borrowed / total * 100) if total > 0 else 0.0
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
            "average_interest": stats.get("average_interest", 5.0),
            "health": health
        }

    def get_lender_position(self, wallet: str) -> dict:
        if self.contract:
            try:
                pos_tuple = self.contract.functions.getLenderPosition(Web3.to_checksum_address(wallet)).call()
                shares = float(Web3.from_wei(pos_tuple[0], 'ether'))
                current_value = float(Web3.from_wei(pos_tuple[1], 'ether'))
                yield_earned = float(Web3.from_wei(pos_tuple[3], 'ether'))
                
                return {
                    "wallet": wallet.lower(),
                    "balance": current_value,
                    "shares": shares,
                    "yield_earned": yield_earned
                }
            except Exception as e:
                print(f"LendingPool onchain lender position query failed: {e}. Falling back to database...")

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

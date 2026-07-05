import time
from app.database.persistence import read_json, write_json
from web3 import Web3

DB_FILE = "reputation_history.json"

def get_reputation_history(wallet: str, current_credit_score: int = 600) -> dict:
    """
    Loads the reputation history database record for a borrower.
    If none exists, initializes a default profile with version 1.
    """
    checksum_wallet = Web3.to_checksum_address(wallet)
    data = read_json(DB_FILE, {})
    
    if checksum_wallet not in data:
        now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        data[checksum_wallet] = {
            "wallet": checksum_wallet,
            "trust_score": 50,
            "history": [
                {
                    "version": 1,
                    "credit_score": current_credit_score,
                    "trust_score": 50,
                    "timestamp": now_str,
                    "trigger": "Initial Registration"
                }
            ],
            "events": [
                {
                    "timestamp": now_str,
                    "previous_score": 0,
                    "current_score": 50,
                    "delta": 50,
                    "reason": "Baseline trust score allocated."
                }
            ]
        }
        write_json(DB_FILE, data)
        
    return data[checksum_wallet]

def save_reputation_history(wallet: str, history_data: dict) -> None:
    """
    Persists the updated reputation history record for a borrower.
    """
    checksum_wallet = Web3.to_checksum_address(wallet)
    data = read_json(DB_FILE, {})
    data[checksum_wallet] = history_data
    write_json(DB_FILE, data)

def add_profile_version(wallet: str, credit_score: int, trust_score: int, trigger: str) -> dict:
    """
    Appends a new immutable versioned credit profile to the history.
    """
    checksum_wallet = Web3.to_checksum_address(wallet)
    history_record = get_reputation_history(checksum_wallet, current_credit_score=credit_score)
    
    # Calculate next version
    versions = [entry["version"] for entry in history_record.get("history", [])]
    next_version = max(versions) + 1 if versions else 1
    
    now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    new_version_entry = {
        "version": next_version,
        "credit_score": credit_score,
        "trust_score": trust_score,
        "timestamp": now_str,
        "trigger": trigger
    }
    
    history_record["history"].append(new_version_entry)
    history_record["trust_score"] = trust_score
    save_reputation_history(checksum_wallet, history_record)
    
    return new_version_entry

def add_evolution_event(wallet: str, previous_score: int, current_score: int, delta: int, reason: str) -> None:
    """
    Appends a score/trust evolution event record.
    """
    checksum_wallet = Web3.to_checksum_address(wallet)
    history_record = get_reputation_history(checksum_wallet)
    
    now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    new_event = {
        "timestamp": now_str,
        "previous_score": previous_score,
        "current_score": current_score,
        "delta": delta,
        "reason": reason
    }
    
    history_record["events"].append(new_event)
    save_reputation_history(checksum_wallet, history_record)

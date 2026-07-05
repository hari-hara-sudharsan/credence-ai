import os
import json
import secrets
import hashlib
from datetime import datetime, timezone

DATABASE_PATH = "c:/Users/Windows/credence-ai/backend/app/database/api_keys.json"

class ApiKeyService:
    def __init__(self):
        # Create database file if not exists
        os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
        if not os.path.exists(DATABASE_PATH):
            self._save_db({})

    def _read_db(self) -> dict:
        try:
            with open(DATABASE_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return {}

    def _save_db(self, db: dict):
        with open(DATABASE_PATH, "w") as f:
            json.dump(db, f, indent=2)

    def generate_key(self, is_live: bool = False) -> str:
        """
        Generates a secure API key in format crd_live_... or crd_test_...
        and stores its metadata.
        """
        prefix = "crd_live" if is_live else "crd_test"
        # Generate 24 bytes of secure entropy
        random_entropy = secrets.token_bytes(24)
        raw_key = hashlib.sha256(random_entropy).hexdigest()[:32]
        key = f"{prefix}_{raw_key}"
        
        db = self._read_db()
        db[key] = {
            "is_active": True,
            "is_live": is_live,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "last_used": None
        }
        self._save_db(db)
        return key

    def validate_key(self, key: str) -> bool:
        """
        Validates whether the given API key is valid and currently active.
        Updates last_used timestamp if valid.
        """
        db = self._read_db()
        if key in db and db[key]["is_active"]:
            db[key]["last_used"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            self._save_db(db)
            return True
        return False

    def revoke_key(self, key: str) -> bool:
        """
        Deactivates / revokes the API key. Returns True if successfully revoked.
        """
        db = self._read_db()
        if key in db:
            db[key]["is_active"] = False
            self._save_db(db)
            return True
        return False

    def list_keys(self) -> list:
        """
        Returns a list of all active key metadata records (masking the secret part).
        """
        db = self._read_db()
        records = []
        for key, meta in db.items():
            # Mask the middle section for security
            masked_key = f"{key[:9]}...{key[-6:]}"
            records.append({
                "raw_key": key, # Needed on UI generation to display it once
                "masked_key": masked_key,
                "is_active": meta["is_active"],
                "is_live": meta["is_live"],
                "created_at": meta["created_at"],
                "last_used": meta["last_used"]
            })
        return records

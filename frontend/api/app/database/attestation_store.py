from app.database.persistence import read_json, write_json

DB_FILENAME = "oracle_attestations.json"

class AttestationStore:
    def save(self, attestation: dict) -> None:
        data = read_json(DB_FILENAME, {})
        data[attestation["attestation_id"]] = attestation
        write_json(DB_FILENAME, data)

    def get(self, attestation_id: str) -> dict or None:
        data = read_json(DB_FILENAME, {})
        return data.get(attestation_id)

    def get_by_attestation_hash(self, attestation_hash: str) -> dict or None:
        data = read_json(DB_FILENAME, {})
        for att in data.values():
            if att.get("attestation_hash") == attestation_hash:
                return att
        return None

    def list_all(self) -> list:
        data = read_json(DB_FILENAME, {})
        # Sort by issued_at descending
        res = list(data.values())
        res.sort(key=lambda x: x.get("issued_at", ""), reverse=True)
        return res

    def get_by_wallet(self, wallet: str) -> list:
        data = read_json(DB_FILENAME, {})
        wallet_lower = wallet.lower()
        res = [att for att in data.values() if att.get("wallet", "").lower() == wallet_lower]
        res.sort(key=lambda x: x.get("issued_at", ""), reverse=True)
        return res

    def revoke(self, attestation_id: str) -> None:
        data = read_json(DB_FILENAME, {})
        if attestation_id in data:
            data[attestation_id]["verified"] = False
            data[attestation_id]["revoked"] = True
            write_json(DB_FILENAME, data)

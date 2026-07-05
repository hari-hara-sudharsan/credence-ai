import re
from web3 import Web3

class SecurityManager:
    def __init__(self):
        # Memory storage for tracking IP request counts to identify abuse
        self.request_history = {}

    def validate_wallet(self, wallet: str) -> bool:
        """
        Validates EVM checksum formatted wallet addresses.
        """
        if not wallet:
            return False
        return Web3.is_address(wallet)

    def validate_signature(self, message: str, signature: str, expected_signer: str) -> bool:
        try:
            w3 = Web3()
            # Recover signer from message hash
            signer = w3.eth.account.recover_message(
                message,
                signature=signature
            )
            return signer.lower() == expected_signer.lower()
        except Exception:
            return False

    def sanitize_input(self, val: str) -> str:
        """
        Cleans strings from script tags and malformed characters.
        """
        if not val:
            return ""
        # Remove html tags
        clean = re.sub(r"<[^>]*>", "", val)
        # Strip suspicious SQL injection chars
        clean = clean.replace("'", "").replace("\"", "").replace(";", "")
        return clean.strip()

    def detect_abuse(self, ip: str, path: str) -> bool:
        """
        Detects burst spikes (abuse) on a specific path.
        """
        if not ip:
            return False
        history = self.request_history.get(ip, [])
        history.append(path)
        self.request_history[ip] = history

        # If more than 50 calls in history log, flag as suspicious
        return len(history) > 50

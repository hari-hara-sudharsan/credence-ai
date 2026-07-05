import urllib.request
import json

class CredenceClient:
    def __init__(self, api_key: str, base_url: str = "http://127.0.0.1:8000"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def _request(self, method: str, path: str, payload: dict = None) -> dict:
        url = f"{self.base_url}/{path.lstrip('/')}"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = None
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            
        req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
        try:
            with urllib.request.urlopen(req) as res:
                return json.loads(res.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            err_detail = err.read().decode("utf-8")
            try:
                err_json = json.loads(err_detail)
                raise Exception(f"Credence SDK Error {err.code}: {err_json.get('detail', err.reason)}")
            except Exception:
                raise Exception(f"Credence SDK Error {err.code}: {err_detail or err.reason}")

    def getCreditProfile(self, wallet: str) -> dict:
        """
        Calculates and returns the Credit Profile and default probability.
        """
        return self._request("POST", "/credit/score", {"wallet": wallet})

    def getProtocolProfiles(self, protocol: str, wallet: str) -> dict:
        """
        Alias / wrapper to query protocol-specific adapter mappings.
        """
        return self.getIntegration(protocol, wallet)

    def getLoanOffer(self, wallet: str) -> dict:
        """
        Creates an underwriting loan offer.
        """
        return self._request("POST", "/loan-offer", {"wallet": wallet})

    def getReputation(self, wallet: str) -> dict:
        """
        Queries dynamic reputation scores and timeline evolution logs.
        """
        return self._request("GET", f"/reputation/{wallet}")

    def getPassport(self, wallet: str) -> dict:
        """
        Reads or queries the user's Credit Passport NFT standing.
        """
        # Resolves via standard /profiles query or direct mock wrapper
        return self._request("POST", "/wallet/analyze", {"wallet": wallet})

    def getOracle(self) -> dict:
        """
        Refreshes oracle nodes or checks feeds.
        """
        return self._request("POST", "/oracle/refresh")

    def getIntegration(self, protocol: str, wallet: str) -> dict:
        """
        Executes standard protocol adapters to get adapted parameters.
        """
        return self._request("GET", f"/integrations/{protocol}/{wallet}")

def createClient(api_key: str, base_url: str = "http://127.0.0.1:8000") -> CredenceClient:
    """
    Helper function to instantiate a new CredenceClient.
    """
    return CredenceClient(api_key, base_url)

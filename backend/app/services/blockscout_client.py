import requests


class BlockscoutClient:

    BASE_URL = "https://hashkey.blockscout.com/api/v2"

    def get_address(self, address: str):

        url = f"{self.BASE_URL}/addresses/{address}"

        response = requests.get(url, timeout=15)

        if response.status_code in [404, 422]:
            return {}

        response.raise_for_status()

        return response.json()

    def get_transactions(self, address: str):

        url = f"{self.BASE_URL}/addresses/{address}/transactions"

        response = requests.get(url, timeout=15)

        if response.status_code in [404, 422]:
            return {"items": []}

        response.raise_for_status()

        return response.json()
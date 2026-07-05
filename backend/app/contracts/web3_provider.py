import os
import json
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from dotenv import load_dotenv
import urllib3
import requests
from requests.adapters import HTTPAdapter

load_dotenv()

# Suppress only the SSL InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class RetryHTTPProvider(Web3.HTTPProvider):
    """
    Custom HTTP provider with retry logic and SSL error handling
    for HashKey Chain mainnet which has intermittent SSL drops.
    """
    def __init__(self, endpoint_uri, max_retries=3, **kwargs):
        self._max_retries = max_retries
        super().__init__(endpoint_uri, **kwargs)

    def make_request(self, method, params):
        last_error = None
        for attempt in range(self._max_retries):
            try:
                return super().make_request(method, params)
            except Exception as e:
                last_error = e
                error_msg = str(e).lower()
                if "ssl" in error_msg or "eof" in error_msg or "connection" in error_msg:
                    import time
                    time.sleep(0.5 * (attempt + 1))  # backoff
                    continue
                raise  # non-SSL errors should fail immediately
        raise last_error


def create_web3_with_retry(rpc_url: str, max_retries: int = 3) -> Web3:
    """
    Creates a Web3 instance with SSL retry logic for HashKey Chain.
    """
    provider = RetryHTTPProvider(rpc_url, max_retries=max_retries)
    w3 = Web3(provider)
    # HashKey Chain is a POA-based chain — inject POA middleware
    try:
        w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    except Exception:
        pass  # Already injected or not needed
    return w3

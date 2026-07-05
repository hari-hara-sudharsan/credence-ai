import urllib.request
import json
import sys

def test_url(url, data=None):
    try:
        if data:
            req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'}, method='POST')
        else:
            req = urllib.request.Request(url)
        res = urllib.request.urlopen(req)
        print(f"SUCCESS: {url} -> {res.getcode()}")
    except Exception as e:
        print(f"ERROR: {url} -> {e}")

test_url("http://127.0.0.1:8000/docs")

print("\n--- Testing Valid Checksum Address ---")
wallet_checksum = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
test_url("http://127.0.0.1:8000/credit/score", {"wallet": wallet_checksum})
test_url("http://127.0.0.1:8000/report/", {"wallet": wallet_checksum})
test_url("http://127.0.0.1:8000/lending/decision", {"wallet": wallet_checksum})
test_url("http://127.0.0.1:8000/history/0x5bb83E60a7a05A0e1b077B66412a26306e334208")
test_url("http://127.0.0.1:8000/oracle/refresh", {"wallet": wallet_checksum})

print("\n--- Testing Valid Lowercase Address ---")
wallet_lower = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
test_url("http://127.0.0.1:8000/credit/score", {"wallet": wallet_lower})
test_url("http://127.0.0.1:8000/report/", {"wallet": wallet_lower})
test_url("http://127.0.0.1:8000/lending/decision", {"wallet": wallet_lower})
test_url("http://127.0.0.1:8000/oracle/refresh", {"wallet": wallet_lower})

print("\n--- Testing Invalid Address (Expected to Fail with 422) ---")
test_url("http://127.0.0.1:8000/credit/score", {"wallet": "0x123"})
test_url("http://127.0.0.1:8000/oracle/refresh", {"wallet": "0x123"})



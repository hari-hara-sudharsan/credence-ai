import requests
import json

payload = {
    "loan_id": "loan_debug_" + str(int(requests.get("http://localhost:9222/json").json() is not None)),
    "borrower": "0x5bb83E60a7a05A0e1b077B66412a26306e334208",
    "amount": 500.0,
    "asset": "HSK",
    "attestation_id": "att_debug_1"
}

try:
    res = requests.post("http://127.0.0.1:8000/settlement/execute", json=payload)
    print("STATUS CODE:", res.status_code)
    print("RESPONSE:")
    print(res.text)
except Exception as e:
    print("CONNECTION ERROR:", str(e))

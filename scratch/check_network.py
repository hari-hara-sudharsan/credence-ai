import requests
try:
    r = requests.get("http://127.0.0.1:8000/api/graph/network")
    print("STATUS CODE:", r.status_code)
    print("RESPONSE JSON:", r.json())
except Exception as e:
    print("ERROR:", e)

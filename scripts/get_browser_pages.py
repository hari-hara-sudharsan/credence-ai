import requests
import json

try:
    res = requests.get("http://localhost:9222/json")
    print("STATUS CODE:", res.status_code)
    print("PAGES LIST:")
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print("ERROR:", str(e))

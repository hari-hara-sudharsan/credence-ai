import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
try:
    response = client.get("/underwriting/report/0x0000000000000000000000000000000000000000")
    print("STATUS CODE:", response.status_code)
    print("RESPONSE JSON:", response.json())
except Exception as e:
    print("ERROR OCCURRED:", str(e))

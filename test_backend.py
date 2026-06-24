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
test_url("http://127.0.0.1:8000/credit/score", {"wallet":"0x123"})
test_url("http://127.0.0.1:8000/report/", {"wallet":"0x123"})
test_url("http://127.0.0.1:8000/lending/decision", {"wallet":"0x123"})
test_url("http://127.0.0.1:8000/history/0x123")

import urllib.request
import urllib.error
import json

try:
    res = urllib.request.urlopen("http://127.0.0.1:8000/profiles/0x5bb83E60a7a05A0e1b077B66412a26306e334208")
    print(res.read().decode())
except urllib.error.HTTPError as e:
    print("Status code:", e.code)
    print("Response body:", e.read().decode())

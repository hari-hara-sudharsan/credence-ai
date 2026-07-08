import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
base_url = "https://frontend-kohl-psi-76.vercel.app/api"

def make_get(path):
    url = f"{base_url}{path}"
    print(f"\n>>> GET {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "E2ETester/1.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=20) as r:
            body = r.read().decode("utf-8")
            data = json.loads(body)
            print("Status: Success")
            print(json.dumps(data, indent=2)[:800] + "\n... (truncated if long)")
            return data
    except Exception as e:
        print(f"Error: {e}")
        return None

def make_post(path, payload):
    url = f"{base_url}{path}"
    print(f"\n>>> POST {url} with {payload}")
    try:
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url, 
            data=data_bytes, 
            headers={"Content-Type": "application/json", "User-Agent": "E2ETester/1.0"}, 
            method="POST"
        )
        with urllib.request.urlopen(req, context=ctx, timeout=25) as r:
            body = r.read().decode("utf-8")
            data = json.loads(body)
            print("Status: Success")
            print(json.dumps(data, indent=2)[:800] + "\n... (truncated if long)")
            return data
    except Exception as e:
        print(f"Error: {e}")
        return None

print(f"=== Starting End-to-End Test for Wallet: {wallet} ===")

# 1. Analyze Wallet (Reads Blockscout API)
features = make_post("/wallet/analyze", {"wallet": wallet})

# 2. Transparent Underwriting
underwriting = make_get(f"/underwriting/report/{wallet}")

# 3. Groq LLM Credit Report
llm_report = make_post("/report", {"wallet": wallet})

# 4. Reputation Registry Profile (On-chain Loan Manager contract reads)
reputation = make_get(f"/reputation/{wallet}")

print("\n=== End-to-End Test Complete ===")

import urllib.request
import json
import os

def test_developer_platform():
    base_url = "http://127.0.0.1:8000"
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    
    print("\n1. Testing GET /developer/endpoints...")
    try:
        res = urllib.request.urlopen(f"{base_url}/developer/endpoints")
        data = json.loads(res.read().decode())
        print("Endpoints List:")
        print(json.dumps(data, indent=2))
        assert "endpoints" in data
        assert len(data["endpoints"]) >= 3
    except Exception as e:
        print("ERROR on GET /developer/endpoints:", e)
        return False

    print("\n2. Testing POST /developer/api-key (Test & Live keys)...")
    try:
        # Test key
        req = urllib.request.Request(
            f"{base_url}/developer/api-key",
            data=json.dumps({"is_live": False}).encode(),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        test_data = json.loads(res.read().decode())
        print("Test API Key Response:")
        print(json.dumps(test_data, indent=2))
        assert test_data["success"] is True
        assert test_data["api_key"].startswith("crd_test_")
        
        # Live key
        req = urllib.request.Request(
            f"{base_url}/developer/api-key",
            data=json.dumps({"is_live": True}).encode(),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        live_data = json.loads(res.read().decode())
        print("Live API Key Response:")
        print(json.dumps(live_data, indent=2))
        assert live_data["success"] is True
        assert live_data["api_key"].startswith("crd_live_")
        
        test_key = test_data["api_key"]
    except Exception as e:
        print("ERROR generating API keys:", e)
        return False

    print("\n3. Testing GET /developer/api-keys list...")
    try:
        res = urllib.request.urlopen(f"{base_url}/developer/api-keys")
        data = json.loads(res.read().decode())
        print("Active Keys Metadata:")
        print(json.dumps(data, indent=2))
        assert "keys" in data
        assert len(data["keys"]) >= 2
    except Exception as e:
        print("ERROR listing API keys:", e)
        return False

    print("\n4. Testing POST /developer/api-key/revoke...")
    try:
        req = urllib.request.Request(
            f"{base_url}/developer/api-key/revoke",
            data=json.dumps({"key": test_key}).encode(),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        revoke_data = json.loads(res.read().decode())
        print("Revocation response:")
        print(json.dumps(revoke_data, indent=2))
        assert revoke_data["success"] is True
        
        # Verify key deactivation
        res = urllib.request.urlopen(f"{base_url}/developer/api-keys")
        data = json.loads(res.read().decode())
        found_revoked = False
        for k in data["keys"]:
            if k["raw_key"] == test_key:
                assert k["is_active"] is False, "Revoked key is still active!"
                found_revoked = True
                break
        assert found_revoked, "Could not find revoked key in list"
        print("Key revocation verified successfully!")
    except Exception as e:
        print("ERROR revoking API key:", e)
        return False

    print("\n5. Testing GET /developer/openapi export...")
    try:
        res = urllib.request.urlopen(f"{base_url}/developer/openapi")
        spec = json.loads(res.read().decode())
        print("OpenAPI spec title:", spec.get("info", {}).get("title"))
        assert spec.get("openapi") is not None
        
        # Assert file is physically created at backend/openapi/credence_openapi.json
        filepath = "c:/Users/Windows/credence-ai/backend/openapi/credence_openapi.json"
        assert os.path.exists(filepath), "credence_openapi.json not found on disk!"
        with open(filepath, "r") as f:
            disk_spec = json.load(f)
            assert disk_spec.get("openapi") == spec.get("openapi")
        print("OpenAPI file creation verified on disk!")
    except Exception as e:
        print("ERROR on GET /developer/openapi:", e)
        return False

    print("\n6. Testing GET /developer/webhooks...")
    try:
        res = urllib.request.urlopen(f"{base_url}/developer/webhooks")
        data = json.loads(res.read().decode())
        print("Webhook events list:")
        print(json.dumps(data, indent=2))
        assert "events" in data
        assert "reputation.updated" in data["events"]
    except Exception as e:
        print("ERROR on GET /developer/webhooks:", e)
        return False

    print("\n7. Testing GET /developer/health integration metrics...")
    try:
        res = urllib.request.urlopen(f"{base_url}/developer/health")
        data = json.loads(res.read().decode())
        print("Operational Health response:")
        print(json.dumps(data, indent=2))
        assert "integrations" in data
        assert "analytics" in data
        assert data["analytics"]["total_api_requests"] > 0
    except Exception as e:
        print("ERROR on GET /developer/health:", e)
        return False

    print("\n8. Testing GET /profiles/{wallet} dynamic profile query...")
    try:
        res = urllib.request.urlopen(f"{base_url}/profiles/{wallet}")
        profile = json.loads(res.read().decode())
        print("Profile response:")
        print(json.dumps(profile, indent=2))
        assert profile.get("wallet").lower() == wallet.lower()
        assert "credit_score" in profile
        assert "trust_score" in profile
    except Exception as e:
        print("ERROR on GET /profiles/{wallet}:", e)
        return False

    print("\nAll developer platform integration checks passed successfully!")
    return True

if __name__ == "__main__":
    test_developer_platform()

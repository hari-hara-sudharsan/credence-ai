import urllib.request
import json

def test_adapters():
    base_url = "http://127.0.0.1:8000"
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    
    print("\n1. Testing GET /integrations endpoint...")
    try:
        res = urllib.request.urlopen(f"{base_url}/integrations")
        data = json.loads(res.read().decode())
        print("Supported Protocols response:")
        print(json.dumps(data, indent=2))
        
        assert "supported_protocols" in data, "Missing supported_protocols field"
        supported = data["supported_protocols"]
        expected = ["LENDING", "INSURANCE", "RWA", "DAO", "INSTITUTIONAL"]
        for exp in expected:
            assert exp in supported, f"Expected protocol {exp} not found in supported list"
        print("GET /integrations validation passed!")
    except Exception as e:
        print("ERROR on GET /integrations:", e)
        return False
        
    print("\n2. Testing each protocol adapter dynamic terms mapping...")
    for protocol in expected:
        url = f"{base_url}/integrations/{protocol}/{wallet}"
        print(f"\nQuerying: GET /integrations/{protocol}/0xf39Fd...")
        try:
            res = urllib.request.urlopen(url)
            contract = json.loads(res.read().decode())
            print(f"Contract output for {protocol}:")
            print(json.dumps(contract, indent=2))
            
            # Assert schema wrapper
            assert contract.get("wallet").lower() == wallet.lower(), "Wallet mismatch"
            assert contract.get("adapter_version") == "1.0.0", "Version mismatch"
            assert contract.get("protocol") == protocol, "Protocol mismatch"
            assert "generated_at" in contract, "Missing generated_at timestamp"
            assert "expires_at" in contract, "Missing expires_at timestamp"
            assert "integration_result" in contract, "Missing integration_result"
            
            # Assert dynamic adapter terms
            res_data = contract["integration_result"]
            assert res_data.get("protocol") == protocol, "Inner protocol label mismatch"
            
            if protocol == "LENDING":
                assert "max_ltv" in res_data
                assert "interest_rate" in res_data
                assert "max_loan" in res_data
                assert "eligible" in res_data
            elif protocol == "INSURANCE":
                assert "risk_class" in res_data
                assert "coverage_limit" in res_data
                assert "premium_discount" in res_data
            elif protocol == "RWA":
                assert "asset_limit" in res_data
                assert "risk" in res_data
                assert "institutional_grade" in res_data
            elif protocol == "DAO":
                assert "voting_weight" in res_data
                assert "delegate_recommended" in res_data
            elif protocol == "INSTITUTIONAL":
                assert "approved" in res_data
                assert "confidence" in res_data
                assert "risk" in res_data
                
            print(f"SUCCESS: {protocol} contract matches schema!")
        except Exception as e:
            print(f"ERROR on {protocol} mapping test:", e)
            return False
            
    print("\n3. Testing invalid protocol handling...")
    try:
        url = f"{base_url}/integrations/INVALID/{wallet}"
        urllib.request.urlopen(url)
        print("ERROR: Querying an invalid protocol did not fail!")
        return False
    except urllib.error.HTTPError as err:
        print(f"Passed! Invalid protocol returned expected HTTP {err.code}: {err.reason}")
        assert err.code == 400, f"Expected status code 400, got {err.code}"
        
    print("\nAll protocol adapter integration checks completed successfully!")
    return True

if __name__ == "__main__":
    test_adapters()

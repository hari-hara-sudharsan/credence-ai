import urllib.request
import json
import time

def run_tests():
    base_url = "http://127.0.0.1:8000"
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    loan_id = "b6d0d6e2-ff61-4c4e-a146-dab8e0b9aeeb"
    
    # Wait for server to start if needed
    time.sleep(2)
    
    print("\n1. Testing POST /repayment endpoint...")
    repay_url = f"{base_url}/repayment"
    repay_data = {
        "wallet": wallet,
        "loan_id": loan_id
    }
    
    try:
        req = urllib.request.Request(
            repay_url,
            data=json.dumps(repay_data).encode(),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        res = urllib.request.urlopen(req)
        content = res.read().decode()
        response_json = json.loads(content)
        print("Response received:")
        print(json.dumps(response_json, indent=2))
        
        # Check assertions
        if response_json.get("success"):
            print("SUCCESS: Loan repaid successfully on-chain!")
            print(f"Transaction Hash: {response_json.get('transaction_hash')}")
        else:
            print(f"FAILURE: Repayment failed with message: {response_json.get('message')}")
            # If already repaid, it might be expected if run twice
            if "already repaid" in response_json.get("message", "").lower():
                print("Note: Loan was already repaid previously. Continuing to history test.")
            else:
                return False
                
    except Exception as e:
        print("ERROR executing POST /repayment:", e)
        if hasattr(e, 'read'):
            print("Error details:", e.read().decode())
        return False
        
    print("\n2. Testing GET /repayment/history/{wallet} endpoint...")
    history_url = f"{base_url}/repayment/history/{wallet}"
    try:
        res = urllib.request.urlopen(history_url)
        content = res.read().decode()
        history_json = json.loads(content)
        print("Response received:")
        print(json.dumps(history_json, indent=2))
        
        # Verify history includes the target loan ID
        found = False
        for record in history_json:
            if record.get("loan_id") == loan_id:
                found = True
                assert record.get("status") == "REPAID", "Expected status to be REPAID"
                assert "transaction_hash" in record, "Expected transaction_hash to be in record"
                assert record.get("amount") > 0, "Expected amount to be positive"
                print(f"SUCCESS: Found repayment record for loan {loan_id} in history!")
                break
        
        if not found:
            print(f"WARNING: Loan {loan_id} not found in history records.")
            return False
            
    except Exception as e:
        print("ERROR executing GET /repayment/history:", e)
        return False
        
    print("\nAll API tests completed successfully!")
    return True

if __name__ == "__main__":
    run_tests()

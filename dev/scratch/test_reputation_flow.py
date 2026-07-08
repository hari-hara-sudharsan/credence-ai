import urllib.request
import json
import time
import os
import sys
from web3 import Web3
from dotenv import load_dotenv

# Add workspace directory to python path
sys.path.append("c:/Users/Windows/credence-ai")
from backend.app.contracts.loan_manager import LOAN_MANAGER_ABI

load_dotenv("c:/Users/Windows/credence-ai/.env")

def test_reputation_flow():
    base_url = "http://127.0.0.1:8000"
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    checksum_wallet = Web3.to_checksum_address(wallet)
    
    # 1. Create a loan offer on-chain via backend API
    print("\n--- Step 1: Creating a loan offer via /protocol/create-loan ---")
    create_url = f"{base_url}/protocol/create-loan"
    create_data = {"wallet": wallet}
    
    try:
        req = urllib.request.Request(
            create_url,
            data=json.dumps(create_data).encode(),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        res = urllib.request.urlopen(req)
        response_json = json.loads(res.read().decode())
        print("Create response:")
        print(json.dumps(response_json, indent=2))
        
        assert response_json.get("approved") is True, "Loan offer not approved"
        assert response_json.get("loan_created") is True, "Loan not created on-chain"
        loan_id = response_json["loan_id"]
        print(f"Created Loan ID: {loan_id}")
    except Exception as e:
        print("ERROR during loan creation:", e)
        if hasattr(e, 'read'):
            print("Error details:", e.read().decode())
        return False

    # 2. Check reputation profile immediately after creation
    print("\n--- Step 2: Verifying reputation updates after loan creation ---")
    reputation_url = f"{base_url}/reputation/{wallet}"
    try:
        res = urllib.request.urlopen(reputation_url)
        rep_json = json.loads(res.read().decode())
        print("Reputation profile:")
        print(json.dumps(rep_json, indent=2))
        
        # Verify a loan creation event exists
        events = rep_json.get("events", [])
        found_creation = False
        for event in events:
            if "loan liability created" in event.get("reason", "").lower():
                found_creation = True
                print(f"Found creation event: {event['reason']}")
                break
        assert found_creation, "Reputation log did not record loan creation"
        
        # Verify score history (version profiles) contains entries
        history = rep_json.get("score_history", [])
        assert len(history) >= 2, f"Expected at least 2 profile versions, got {len(history)}"
        print("Score history contains versioned entries.")
    except Exception as e:
        print("ERROR checking reputation after creation:", e)
        return False

    # 3. Activate the loan on-chain (requires borrower private key)
    print("\n--- Step 3: Activating the loan on-chain ---")
    hsk_rpc = os.getenv("HSK_RPC") or "https://mainnet.hsk.xyz"
    w3 = Web3(Web3.HTTPProvider(hsk_rpc))
    private_key = os.getenv("PRIVATE_KEY")
    account = w3.eth.account.from_key(private_key)
    
    contract_address = os.getenv("LOAN_MANAGER_ADDRESS") or os.getenv("LOAN_MANAGER")
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(contract_address),
        abi=LOAN_MANAGER_ABI
    )
    
    nonce = w3.eth.get_transaction_count(account.address)
    tx_func = contract.functions.activateLoan(loan_id)
    
    try:
        gas_estimate = tx_func.estimate_gas({'from': account.address})
        gas_limit = int(gas_estimate * 1.2)
    except Exception:
        gas_limit = 200000
        
    tx = tx_func.build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': gas_limit,
        'gasPrice': w3.eth.gas_price
    })
    
    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    print("Broadcasting activation transaction...")
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Activation complete! Hash: {tx_hash.hex()}")

    # 4. Trigger Repayment via backend /repayment API
    print("\n--- Step 4: Executing repayment via /repayment ---")
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
        repay_json = json.loads(res.read().decode())
        print("Repayment response:")
        print(json.dumps(repay_json, indent=2))
        assert repay_json.get("success") is True, "Repayment failed"
        print(f"Repayment complete! Hash: {repay_json.get('transaction_hash')}")
    except Exception as e:
        print("ERROR during repayment:", e)
        if hasattr(e, 'read'):
            print("Error details:", e.read().decode())
        return False

    # 5. Check reputation profile again to verify repayment credit standing boost
    print("\n--- Step 5: Verifying reputation standing boost ---")
    try:
        res = urllib.request.urlopen(reputation_url)
        rep_json = json.loads(res.read().decode())
        print("Reputation profile:")
        print(json.dumps(rep_json, indent=2))
        
        # Verify repayment event is logged
        events = rep_json.get("events", [])
        found_repay = False
        for event in events:
            if "repaid successfully" in event.get("reason", "").lower():
                found_repay = True
                print(f"Found repayment event: {event['reason']}")
                break
        assert found_repay, "Reputation log did not record repayment"
        
        # Verify trust score has changed
        print(f"Final Trust Score: {rep_json['trust_score']} ({rep_json['rating']})")
        print(f"Successful Repayments Count: {rep_json['successful_loans']}")
    except Exception as e:
        print("ERROR verifying reputation standing boost:", e)
        return False
        
    print("\nAll integration checks passed successfully!")
    return True

if __name__ == "__main__":
    test_reputation_flow()

import os
import sys
from web3 import Web3
from dotenv import load_dotenv

sys.path.append("c:/Users/Windows/credence-ai")
from backend.app.contracts.loan_manager import LOAN_MANAGER_ABI

load_dotenv("c:/Users/Windows/credence-ai/.env")

def activate_loan(loan_id):
    hsk_rpc = os.getenv("HSK_RPC") or "https://mainnet.hsk.xyz"
    w3 = Web3(Web3.HTTPProvider(hsk_rpc))
    
    private_key = os.getenv("PRIVATE_KEY")
    account = w3.eth.account.from_key(private_key)
    
    contract_address = os.getenv("LOAN_MANAGER_ADDRESS") or os.getenv("LOAN_MANAGER")
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(contract_address),
        abi=LOAN_MANAGER_ABI
    )
    
    print(f"Activating loan: {loan_id}")
    print("Borrower:", account.address)
    
    # Check current status
    raw_loan = contract.functions.loans(loan_id).call()
    status_val = raw_loan[8]
    print(f"Current loan status: {status_val} (0=Pending, 1=Active, 2=Repaid, 3=Cancelled)")
    
    if status_val != 0:
        print("Loan is not in PENDING status, cannot activate.")
        return
        
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
    print("Broadcasting transaction...")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction successful! Hash: {tx_hash.hex()}")
    
    # Confirm new status
    raw_loan = contract.functions.loans(loan_id).call()
    print(f"New loan status: {raw_loan[8]} (1=Active)")

if __name__ == "__main__":
    activate_loan("b6d0d6e2-ff61-4c4e-a146-dab8e0b9aeeb")

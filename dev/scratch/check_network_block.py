import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv("c:/Users/Windows/credence-ai/.env")

def check_block():
    hsk_rpc = os.getenv("HSK_RPC") or "https://mainnet.hsk.xyz"
    w3 = Web3(Web3.HTTPProvider(hsk_rpc))
    
    current_block = w3.eth.block_number
    print("Current block number:", current_block)
    
    contract_address = os.getenv("LOAN_MANAGER_ADDRESS") or os.getenv("LOAN_MANAGER")
    contract_address = Web3.to_checksum_address(contract_address)
    
    # We can try to guess the deployment block by searching backward or using a reasonable start block
    # Let's search back 50000 blocks first
    print(f"Checking events from block {current_block - 50000} to {current_block}...")
    from backend.app.contracts.loan_manager import LOAN_MANAGER_ABI
    contract = w3.eth.contract(address=contract_address, abi=LOAN_MANAGER_ABI)
    
    try:
        events = contract.events.LoanRepaid.get_logs(from_block=max(0, current_block - 50000))
        print(f"Found {len(events)} LoanRepaid events in the last 50,000 blocks.")
        for event in events:
            print(f"Event: {event.args.loanId} at block {event.blockNumber}")
    except Exception as e:
        print("Error fetching events in last 50k blocks:", e)
        
    try:
        # Let's search from block 0 to see if it actually times out or how long it takes
        import time
        start = time.time()
        events = contract.events.LoanRepaid.get_logs(from_block=0)
        end = time.time()
        print(f"Found {len(events)} events from block 0. Time taken: {end - start:.2f} seconds.")
    except Exception as e:
        print("Error fetching events from block 0:", e)

if __name__ == "__main__":
    check_block()

import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv("c:/Users/Windows/credence-ai/.env")

def find_deployment_block():
    hsk_rpc = os.getenv("HSK_RPC") or "https://mainnet.hsk.xyz"
    w3 = Web3(Web3.HTTPProvider(hsk_rpc))
    
    contract_address = os.getenv("LOAN_MANAGER_ADDRESS") or os.getenv("LOAN_MANAGER")
    contract_address = Web3.to_checksum_address(contract_address)
    
    current_block = w3.eth.block_number
    print("Current block:", current_block)
    
    # Binary search for the deployment block
    low = 0
    high = current_block
    deployment_block = 0
    
    print(f"Searching for deployment block of {contract_address}...")
    
    while low <= high:
        mid = (low + high) // 2
        code = w3.eth.get_code(contract_address, block_identifier=mid)
        if len(code) > 0:
            deployment_block = mid
            high = mid - 1
        else:
            low = mid + 1
            
    print("Found deployment block:", deployment_block)

if __name__ == "__main__":
    find_deployment_block()

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta, timezone
from app.adapters.factory import AdapterFactory, ProtocolProfileEngine
from web3 import Web3

router = APIRouter(
    prefix="/integrations",
    tags=["Protocol Integrations"]
)

@router.get("")
def get_supported_integrations():
    """
    Returns a list of all supported integration protocols.
    """
    return {
        "supported_protocols": AdapterFactory.get_supported_protocols()
    }

@router.get("/{protocol}/{wallet}")
def get_protocol_integration(protocol: str, wallet: str):
    """
    Consolidates the borrower's reputation state and executes the selected
    protocol adapter to return a standardized, time-bound integration contract.
    """
    # 1. Validate wallet format
    try:
        checksum_wallet = Web3.to_checksum_address(wallet)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid wallet address format.")

    # 2. Check protocol support
    supported = [p.upper() for p in AdapterFactory.get_supported_protocols()]
    upper_protocol = protocol.upper()
    if upper_protocol not in supported:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported protocol: '{protocol}'. Supported protocols are: {supported}"
        )

    try:
        # 3. Consolidate profile metrics
        profile = ProtocolProfileEngine.get_protocol_profile(checksum_wallet)
        
        # 4. Resolve adapter and transform profile
        adapter = AdapterFactory.get_adapter(upper_protocol)
        integration_result = adapter.adapt(profile)
        
        # 5. Build versioned integration contract metadata
        now = datetime.now(timezone.utc)
        expires = now + timedelta(hours=1)
        
        return {
            "wallet": checksum_wallet,
            "adapter_version": "1.0.0",
            "protocol": upper_protocol,
            "generated_at": now.isoformat().replace("+00:00", "Z"),
            "expires_at": expires.isoformat().replace("+00:00", "Z"),
            "integration_result": integration_result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Integration mapping failed: {str(e)}"
        )

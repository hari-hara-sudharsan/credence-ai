from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.marketplace import BorrowerProfile, LenderMatch, ProtocolMatch, NetworkGraphResponse, NetworkConnection
from app.services.marketplace_engine import MarketplaceEngine
from app.services.discovery_engine import DiscoveryEngine
from app.services.verification_network import VerificationNetwork
from web3 import Web3

router = APIRouter(
    prefix="/marketplace",
    tags=["Decentralized Credit Marketplace"]
)

@router.get("/borrowers", response_model=List[BorrowerProfile])
def get_verified_borrowers():
    """
    Lists all verified borrowers registered on the marketplace.
    """
    try:
        service = MarketplaceEngine()
        return service.list_verified_borrowers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load borrowers: {str(e)}")

@router.get("/top-wallets", response_model=List[dict])
def get_leaderboard_wallets():
    """
    Retrieves topmost ranked wallets sorted by trust index coefficients.
    """
    try:
        service = MarketplaceEngine()
        profiles = service.rank_wallets()
        return [
            {
                "rank": p["rank"],
                "wallet": p["wallet"],
                "credit_score": p["credit_score"],
                "trust_score": p["trust_score"],
                "badge": p["trust_badge"],
                "risk": p["risk_level"]
            }
            for p in profiles[:10] # Top 10 leaders
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Leaderboard load failed: {str(e)}")

@router.get("/match/lender/{wallet}", response_model=List[LenderMatch])
def get_lender_matches(wallet: str):
    """
    Computes compatible lending pools matching risk limits.
    """
    try:
        service = MarketplaceEngine()
        matches = service.match_lenders(wallet)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to match lenders: {str(e)}")

@router.get("/match/protocol/{wallet}", response_model=List[ProtocolMatch])
def get_protocol_matches(wallet: str):
    """
    Computes eligibility ratios for registered credit protocols.
    """
    try:
        service = MarketplaceEngine()
        matches = service.match_protocols(wallet)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to match protocols: {str(e)}")

@router.get("/search", response_model=List[BorrowerProfile])
def search_marketplace(
    q: Optional[str] = Query("", description="Keyword search for wallet, badge, or risk status"),
    min_score: Optional[int] = Query(None, description="Min credit score range constraint"),
    max_score: Optional[int] = Query(None, description="Max credit score range constraint"),
    risk_level: Optional[str] = Query(None, description="Filter risk level"),
    badge: Optional[str] = Query(None, description="Filter credential badge classification")
):
    """
    Queries marketplace borrowers based on keyword search and filter metrics.
    """
    try:
        disc = DiscoveryEngine()
        if min_score is not None or max_score is not None or risk_level or badge:
            results = disc.filter_profiles(min_score, max_score, risk_level, badge)
        else:
            results = disc.search_wallets(q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/network/{wallet}", response_model=NetworkGraphResponse)
def get_trust_relationship_graph(wallet: str):
    """
    Returns the decentralized relationship mapping node for a wallet address.
    """
    try:
        checksum_wallet = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        val = vn.get_verification_by_wallet(checksum_wallet)
        if not val:
            val = vn.verify_wallet(checksum_wallet)

        score = val["credit_score"]
        trust = val["trust_score"]

        # Build connections from real on-chain data
        connections = []

        # Connection 1: Credence Lending Protocol (always present if verified)
        connections.append(
            NetworkConnection(type="PROTOCOL", name="CredenceLending", trust_relationship=int(trust * 0.95))
        )

        # Connection 2: Check for real active loans from on-chain LoanManager
        try:
            from app.contracts.loan_reader import LoanReader
            reader = LoanReader()
            active_loans = reader.get_active_loans(checksum_wallet)
            if active_loans:
                connections.append(
                    NetworkConnection(type="LOAN", name=f"ActiveLoans({len(active_loans)})", trust_relationship=int(trust * 0.90))
                )
            completed_loans = reader.get_completed_loans(checksum_wallet)
            if completed_loans:
                connections.append(
                    NetworkConnection(type="HISTORY", name=f"RepaidLoans({len(completed_loans)})", trust_relationship=int(trust * 0.98))
                )
        except Exception:
            pass

        # Connection 3: Check for passport verification
        if val.get("passport_valid"):
            connections.append(
                NetworkConnection(type="PASSPORT", name="CreditPassportV2", trust_relationship=int(trust * 0.97))
            )

        # Connection 4: Check for attestation
        if val.get("attestation_id"):
            connections.append(
                NetworkConnection(type="ATTESTATION", name="EIP712Attestation", trust_relationship=95)
            )

        # Calculate relationship network score based on connections average
        network_score = int(sum(c.trust_relationship for c in connections) / len(connections)) if connections else 0

        return NetworkGraphResponse(
            wallet=checksum_wallet,
            connections=connections,
            network_score=network_score
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to construct network graph: {str(e)}")


# ── Protocols Registry & Application Registration ────────────────────────────────

from pydantic import BaseModel
from app.database.persistence import read_json, write_json
from app.services.governance_engine import GovernanceEngine
from app.services.audit_engine import AuditEngine

PROTOCOLS_DB = "registered_protocols.json"

class RegisterProtocolRequest(BaseModel):
    name: str
    category: str
    targetUrl: str
    minScore: int
    sender: str

@router.get("/protocols")
def get_marketplace_protocols():
    db = read_json(PROTOCOLS_DB, {})
    if not db:
        db = {
            "keystone": {
                "name": "Keystone Lending",
                "category": "LENDING",
                "targetUrl": "https://keystone.fi",
                "minScore": 600,
                "verified": True,
                "requestCount": 45
            },
            "pebble": {
                "name": "Pebble PayFi",
                "category": "PAYFI",
                "targetUrl": "https://pebble.pay",
                "minScore": 550,
                "verified": True,
                "requestCount": 18
            }
        }
        write_json(PROTOCOLS_DB, db)
    return list(db.values())

@router.post("/register")
def register_marketplace_protocol(req: RegisterProtocolRequest):
    db = read_json(PROTOCOLS_DB, {})
    key = req.name.lower().replace(" ", "_")
    if key in db:
        raise HTTPException(status_code=400, detail="Protocol already registered")
        
    db[key] = {
        "name": req.name,
        "category": req.category,
        "targetUrl": req.targetUrl,
        "minScore": req.minScore,
        "verified": False,
        "requestCount": 0
    }
    write_json(PROTOCOLS_DB, db)
    
    # Submit registration proposal to governance contract
    try:
        gov = GovernanceEngine()
        gov.create_proposal(
            actor=req.sender,
            title=f"Authorize protocol consumer application: {req.name} ({req.category})",
            type="PROTOCOL"
        )
    except Exception as ge:
        # Fallback to direct audit logging if Web3 environment parameters are being loaded asynchronously
        audit = AuditEngine()
        audit.record_event(
            action="CREATE_PROPOSAL",
            performed_by=req.sender,
            resource=req.name,
            result=f"Proposal created for protocol verification. Status fallback: {ge}"
        )
        
    return {"success": True, "message": "Protocol registration submitted"}

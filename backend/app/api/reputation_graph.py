from fastapi import APIRouter, HTTPException
from app.schemas.reputation_graph import TrustGraph, TrustFlowResponse, TrustSource
from app.services.reputation_graph_engine import ReputationGraphEngine
from app.services.graph_analysis_engine import GraphAnalysisEngine
from web3 import Web3

router = APIRouter(
    prefix="/graph",
    tags=["Reputation Graph Layer"]
)

@router.get("/{wallet}", response_model=TrustGraph)
def get_reputation_graph(wallet: str):
    """
    Returns nodes and edges mappings for a wallet.
    """
    try:
        checksum_w = Web3.to_checksum_address(wallet)
        service = ReputationGraphEngine()
        return service.build_graph(checksum_w)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph construction failed: {str(e)}")

@router.get("/{wallet}/insights")
def get_reputation_insights(wallet: str):
    """
    Assembles AI-narrated graph relationships insights.
    """
    try:
        checksum_w = Web3.to_checksum_address(wallet)
        analyst = GraphAnalysisEngine()
        ins = analyst.generate_graph_insights(checksum_w)
        return {"insights": ins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to gather insights: {str(e)}")

@router.get("/{wallet}/connections")
def get_reputation_connections(wallet: str):
    """
    Lists direct connections with active protocols.
    """
    try:
        checksum_w = Web3.to_checksum_address(wallet)
        service = ReputationGraphEngine()
        graph = service.build_graph(checksum_w)
        return {"connections": graph["edges"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to map connections: {str(e)}")

@router.get("/{wallet}/trust-flow", response_model=TrustFlowResponse)
def get_trust_flow_propagation(wallet: str):
    """
    Traces propagation sources and paths mapping trust coefficients.
    """
    try:
        checksum_w = Web3.to_checksum_address(wallet)
        # Formulate deterministic flow inputs
        sources = [
            TrustSource(source="Successful Lending History", impact="+25"),
            TrustSource(source="Verified Passport Seal", impact="+20"),
            TrustSource(source="EIP-712 Onchain Attestation", impact="+15")
        ]
        
        path = ["Wallet", "Passport", "Oracle", "Protocol"]
        
        return TrustFlowResponse(
            wallet=checksum_w,
            trust_sources=sources,
            trust_path=path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trust flow propagation trace failed: {str(e)}")

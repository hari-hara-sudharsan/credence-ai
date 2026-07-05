from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class GraphNode(BaseModel):
    node_id: str
    node_type: str # WALLET, PROTOCOL, PASSPORT, LOAN, ATTESTATION
    label: str
    trust_score: int
    metadata: Dict[str, Any]

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str # BORROWED_FROM, REPAID, VERIFIED_BY, USED_PROTOCOL, OWNS_PASSPORT, HAS_ATTESTATION
    strength: int
    created_at: datetime

class TrustGraph(BaseModel):
    wallet: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    network_score: int

class TrustSource(BaseModel):
    source: str
    impact: str

class TrustFlowResponse(BaseModel):
    wallet: str
    trust_sources: List[TrustSource]
    trust_path: List[str]

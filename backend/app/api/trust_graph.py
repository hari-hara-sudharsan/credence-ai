from fastapi import APIRouter, HTTPException
from app.services.graph.trust_graph_engine import HashKeyTrustGraph
from app.services.graph.network_intelligence import NetworkIntelligence
from app.services.ai.trust_agent import CredenceTrustAgent

router = APIRouter(
    prefix="/api/graph",
    tags=["HashKey Trust Graph"]
)

graph_engine = HashKeyTrustGraph()
network_engine = NetworkIntelligence()
trust_agent = CredenceTrustAgent()

@router.get("/{wallet}")
def get_trust_graph_data(wallet: str):
    """
    Returns nodes and edges mapping the entity's trust network.
    """
    try:
        return graph_engine.build_graph(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights/{wallet}")
def get_trust_graph_insights(wallet: str):
    """
    Assembles ranking standings, growth opportunities, and recommendations.
    """
    try:
        insights = graph_engine.generate_graph_insights(wallet)
        position = trust_agent.analyze_network_position(wallet)
        growth = trust_agent.recommend_growth_path(wallet)
        
        # Combine responses to match required payload format
        return {
            "rank": f"{position.get('rank')} Trusted",
            "opportunities": insights.get("opportunities", []),
            "growthPath": growth.get("growthPath", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/network")
def get_network_health_statistics():
    """
    Returns health indices, active wallets, volumes, and prevented defaults globally.
    """
    try:
        return network_engine.calculate_ecosystem_health()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

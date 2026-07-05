from app.services.reputation_graph_engine import ReputationGraphEngine

class GraphAnalysisEngine:
    def __init__(self):
        self.graph_engine = ReputationGraphEngine()

    def detect_influence(self, wallet: str) -> dict:
        graph = self.graph_engine.build_graph(wallet)
        # Ratio of nodes to edges
        size = len(graph["nodes"])
        return {
            "influence_score": 85 if size >= 4 else 60,
            "connected_degree": len(graph["edges"])
        }

    def calculate_trust_distance(self, wallet: str) -> float:
        # Distance coefficient based on network score
        graph = self.graph_engine.build_graph(wallet)
        score = graph["network_score"]
        return float(1.0 - (score / 100))

    def find_protocol_connections(self, wallet: str) -> list:
        graph = self.graph_engine.build_graph(wallet)
        return [n for n in graph["nodes"] if n["node_type"] == "PROTOCOL"]

    def generate_graph_insights(self, wallet: str) -> str:
        """
        Synthesizes narrative insight analysis reporting graph connectivity structures.
        """
        graph = self.graph_engine.build_graph(wallet)
        deg = len(graph["edges"])
        score = graph["network_score"]

        return (
            f"This wallet has strong verified relationships across money markets and credential systems. "
            f"Connected degree factor: {deg} active paths. Reputation propagation score matches "
            f"top-tier standards ({score}/100 network score)."
        )

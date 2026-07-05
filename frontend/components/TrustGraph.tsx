"use client";

interface GraphNodeItem {
  node_id: string;
  node_type: string;
  label: string;
  trust_score: number;
  metadata: any;
}

interface GraphEdgeItem {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

interface Props {
  nodes: GraphNodeItem[];
  edges: GraphEdgeItem[];
}

export default function TrustGraph({ nodes, edges }: Props) {
  const getNodeColor = (type: string) => {
    if (type === "WALLET") return "#00E5FF";
    if (type === "PROTOCOL") return "#34D399";
    if (type === "PASSPORT") return "#FFB830";
    if (type === "ATTESTATION") return "#C0C0C0";
    return "#FF4D6A"; // LOAN
  };


  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        REPUTATION NODE RELATIONSHIP NETWORK MAP
      </div>

      <div
        style={{
          height: 380,
          background: "#050B14",
          border: "1px solid #111C2E",
          borderRadius: 8,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Interactive nodes representation list */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 500 }}>
          {nodes.map((node) => (
            <div
              key={node.node_id}
              style={{
                background: "#0A1425",
                border: `2px solid ${getNodeColor(node.node_type)}`,
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                minWidth: 120,
                boxShadow: `0 4px 16px ${getNodeColor(node.node_type)}1A`,
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  color: getNodeColor(node.node_type),
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {node.node_type}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{node.label}</span>
              {node.trust_score > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#34D399",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  Score: {node.trust_score}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

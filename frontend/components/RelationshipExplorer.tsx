"use client";

interface EdgeItem {
  source: string;
  target: string;
  relationship: string;
  strength: number;
  created_at: string;
}

interface Props {
  edges: EdgeItem[];
}

export default function RelationshipExplorer({ edges }: Props) {
  const getRelationshipColor = (rel: string) => {
    if (rel === "OWNS_PASSPORT") return "#FFB830";
    if (rel === "HAS_ATTESTATION") return "#00E5FF";
    if (rel === "USED_PROTOCOL") return "#34D399";
    return "#FF4D6A";
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
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        RELATIONSHIP EXPLORER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {edges.map((e, idx) => (
          <div
            key={idx}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: getRelationshipColor(e.relationship),
                    background: `${getRelationshipColor(e.relationship)}1A`,
                    border: `1px solid ${getRelationshipColor(e.relationship)}`,
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {e.relationship}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
                  {e.source.substring(0, 6)}... ➔ {e.target}
                </span>
              </div>
              <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                Created: {new Date(e.created_at).toLocaleString()}
              </span>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>RELATION STRENGTH</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#34D399", fontFamily: "JetBrains Mono, monospace" }}>
                {e.strength}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

interface Props {
  protocolName: string;
  type: string;
}

export default function ProtocolNode({ protocolName, type }: Props) {
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
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        CONNECTED ADAPTER PROTOCOL
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>PROTOCOL IDENTIFIER</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>{protocolName}</span>
        </div>

        <div>
          <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>ADAPTER MODULE TYPE</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#34D399",
              background: "rgba(52, 211, 153, 0.05)",
              border: "1px solid #34D399",
              borderRadius: 4,
              padding: "2px 6px",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}

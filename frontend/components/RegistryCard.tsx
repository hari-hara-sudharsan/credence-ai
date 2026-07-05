"use client";

export default function RegistryCard({ txHash }: { txHash: string }) {
  const truncated = txHash
    ? `${txHash.slice(0, 10)}…${txHash.slice(-8)}`
    : "—";

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #34D399, transparent)",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #111C2E",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 3,
            height: 18,
            borderRadius: 2,
            background: "#34D399",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1.5,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 2,
            }}
          >
            BLOCKCHAIN
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "#E2E8F0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            On-Chain Registry
          </h2>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Tx hash */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#4A6080",
            letterSpacing: 1.2,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 8,
          }}
        >
          TRANSACTION HASH
        </div>
        <div
          style={{
            background: "#070F1C",
            border: "1px solid #1A2740",
            borderRadius: 8,
            padding: "12px 16px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 13,
            color: "#94A3B8",
            letterSpacing: 0.3,
            wordBreak: "break-all",
            marginBottom: 16,
          }}
        >
          {txHash}
        </div>

        {/* Verified badge + explorer link */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(52, 211, 153, 0.08)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              borderRadius: 6,
              padding: "4px 12px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34D399",
                boxShadow: "0 0 6px #34D399",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#34D399",
                letterSpacing: 1,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              CONFIRMED
            </span>
          </div>

          <a
            href={`https://hashkey.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#00E5FF",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
              transition: "opacity 0.15s",
            }}
          >
            View on Explorer
            <span style={{ fontSize: 14 }}>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
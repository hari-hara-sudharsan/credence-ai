"use client";

interface Props {
  lending: any;
}

export default function LendingCard({ lending }: Props) {
  const eligible = lending?.eligible;
  const statusColor = eligible ? "#34D399" : "#FF4D6A";
  const statusLabel = eligible ? "Approved" : "Declined";

  const riskLevel = lending?.risk_level ?? "Unknown";
  const riskColor =
    riskLevel.toLowerCase().includes("low")
      ? "#34D399"
      : riskLevel.toLowerCase().includes("high")
      ? "#FF4D6A"
      : "#FFB830";

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
          background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
        }}
      />

      {/* Header with verdict */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #111C2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 3,
              height: 18,
              borderRadius: 2,
              background: "#FFB830",
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
              RISK ASSESSMENT
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
              Lending Decision
            </h2>
          </div>
        </div>

        {/* Verdict badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `${statusColor}14`,
            border: `1px solid ${statusColor}44`,
            borderRadius: 6,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: statusColor,
            letterSpacing: 1,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }}
          />
          {statusLabel}
        </span>
      </div>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1,
          background: "#111C2E",
        }}
      >
        <div style={{ background: "#0A1425", padding: "20px 24px" }}>
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
            INTEREST RATE
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#FFB830",
              fontFamily: "Inter, sans-serif",
              letterSpacing: -1,
            }}
          >
            {lending?.interest_rate}%
          </div>
        </div>

        <div style={{ background: "#0A1425", padding: "20px 24px" }}>
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
            COLLATERAL
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#E2E8F0",
              fontFamily: "Inter, sans-serif",
              letterSpacing: -1,
            }}
          >
            {lending?.collateral_ratio}%
          </div>
        </div>

        <div style={{ background: "#0A1425", padding: "20px 24px" }}>
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
            RISK LEVEL
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: riskColor,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: 0.5,
              marginTop: 4,
            }}
          >
            {riskLevel}
          </div>
        </div>
      </div>
    </div>
  );
}
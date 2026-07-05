"use client";

import TrustSeal from "@/components/TrustSeal";

interface Props {
  result: any;
}

export default function VerificationCard({ result }: Props) {
  const isExpired = new Date(result.expires_at).getTime() < Date.now();
  const statusColor = result.passport_valid && !isExpired ? "#34D399" : "#FF4D6A";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied value!");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: `1px solid ${statusColor}`,
        borderRadius: 20,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 12px 40px rgba(0, 229, 255, 0.08)`,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        alignItems: "center",
      }}
    >
      {/* Decorative Grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      {/* Main Metadata details */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#00E5FF",
            letterSpacing: 2,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 8,
          }}
        >
          UCVN TRUST REPORT
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
            {result.wallet.substring(0, 6)}...{result.wallet.substring(result.wallet.length - 4)}
          </span>
          <button
            onClick={() => copyToClipboard(result.wallet)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748B",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            📋
          </button>
        </div>

        {/* Verification Checks indicators */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "8px 14px",
            }}
          >
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
              PASSPORT VALIDITY
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: result.passport_valid ? "#34D399" : "#FF4D6A" }}>
              {result.passport_valid ? "🟢 ACTIVE" : "🔴 INVALID"}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "8px 14px",
            }}
          >
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
              ORACLE ATTESTATION
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: result.oracle_verified ? "#34D399" : "#FF4D6A" }}>
              {result.oracle_verified ? "🟢 SIGNED" : "🔴 UNVERIFIED"}
            </div>
          </div>
        </div>

        {/* Scores */}
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              CREDIT SCORE
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>{result.credit_score}</div>
          </div>

          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              TRUST SCORE
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{result.trust_score}</div>
          </div>

          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              RISK RATING
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: result.risk_level === "LOW" ? "#34D399" : result.risk_level === "MEDIUM" ? "#FFB830" : "#FF4D6A" }}>
              {result.risk_level}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Seal Right column */}
      <div style={{ zIndex: 2 }}>
        <TrustSeal seal={result.trust_seal} />
      </div>
    </div>
  );
}

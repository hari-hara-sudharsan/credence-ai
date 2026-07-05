"use client";

import VerificationBadge from "@/components/VerificationBadge";

interface Props {
  passport: any;
}

export default function PassportIdentityCard({ passport }: Props) {
  const isRevoked = passport.passport_status === "REVOKED";
  const isExpired = new Date(passport.expires_at).getTime() < Date.now();
  const isValid = !isRevoked && !isExpired;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied wallet address!");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: "1px solid rgba(0, 229, 255, 0.15)",
        borderRadius: 20,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0, 229, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 220,
        transition: "transform 0.3s ease, border-color 0.3s ease",
      }}
      className="passport-card"
    >
      {/* Decorative Cyber Grid Overlay */}
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

      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#00E5FF",
              letterSpacing: 2,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            CREDENCE TRUST PASSPORT V2
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748B",
              fontFamily: "JetBrains Mono, monospace",
              marginTop: 4,
            }}
          >
            ID: {passport.passport_id}
          </div>
        </div>

        <VerificationBadge verified={isValid} revoked={isRevoked} expired={isExpired} />
      </div>

      {/* Main Scores Section */}
      <div
        style={{
          display: "flex",
          gap: 40,
          margin: "24px 0",
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            CREDIT SCORE
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
            }}
          >
            {passport.credit_score}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            TRUST SCORE
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#34D399",
              letterSpacing: -1,
            }}
          >
            {passport.trust_score}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            RISK LEVEL
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: passport.risk_level === "LOW" ? "#34D399" : passport.risk_level === "MEDIUM" ? "#FFB830" : "#FF4D6A",
              marginTop: 10,
            }}
          >
            {passport.risk_level}
          </div>
        </div>
      </div>

      {/* Footer Wallet Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
            {passport.wallet.substring(0, 6)}...{passport.wallet.substring(passport.wallet.length - 4)}
          </span>
          <button
            onClick={() => copyToClipboard(passport.wallet)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748B",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            📋
          </button>
        </div>

        <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
          v{passport.passport_version}
        </div>
      </div>

      <style>{`
        .passport-card:hover {
          transform: translateY(-4px);
          border-color: #00E5FF !important;
          box-shadow: 0 16px 48px rgba(0, 229, 255, 0.12) !important;
        }
      `}</style>
    </div>
  );
}

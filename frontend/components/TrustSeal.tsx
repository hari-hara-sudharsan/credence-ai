"use client";

interface Props {
  seal: "BRONZE" | "SILVER" | "GOLD" | "INSTITUTIONAL_VERIFIED" | string;
}

export default function TrustSeal({ seal }: Props) {
  let label = "BRONZE TRUST SEAL";
  let color = "#CD7F32";
  let glow = "rgba(205, 127, 50, 0.2)";
  let bg = "rgba(205, 127, 50, 0.05)";

  if (seal === "INSTITUTIONAL_VERIFIED") {
    label = "🟢 INSTITUTIONAL VERIFIED";
    color = "#34D399";
    glow = "rgba(52, 211, 153, 0.25)";
    bg = "rgba(52, 211, 153, 0.05)";
  } else if (seal === "GOLD") {
    label = "🟡 GOLD TRUST SEAL";
    color = "#FFB830";
    glow = "rgba(255, 184, 48, 0.25)";
    bg = "rgba(255, 184, 48, 0.05)";
  } else if (seal === "SILVER") {
    label = "🟠 SILVER TRUST SEAL";
    color = "#94A3B8";
    glow = "rgba(148, 163, 184, 0.2)";
    bg = "rgba(148, 163, 184, 0.05)";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        border: `1px solid ${color}`,
        borderRadius: 100,
        width: 140,
        height: 140,
        position: "relative",
        boxShadow: `0 0 24px ${glow}`,
        animation: "pulse-seal 2s infinite ease-in-out",
        margin: "0 auto",
      }}
    >
      {/* Outer spinning dash ring */}
      <div
        style={{
          position: "absolute",
          top: -6,
          left: -6,
          right: -6,
          bottom: -6,
          border: `2px dashed ${color}`,
          borderRadius: "50%",
          opacity: 0.4,
          animation: "spin-ring 12s linear infinite",
        }}
      />

      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: color,
          letterSpacing: 0.5,
          fontFamily: "JetBrains Mono, monospace",
          textAlign: "center",
          padding: "0 10px",
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>

      <style>{`
        @keyframes pulse-seal {
          0% { box-shadow: 0 0 16px ${glow}; }
          50% { box-shadow: 0 0 32px ${glow}; }
          100% { box-shadow: 0 0 16px ${glow}; }
        }
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

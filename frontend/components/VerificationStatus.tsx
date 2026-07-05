"use client";

interface Props {
  status: "VERIFIED" | "INVALID" | "EXPIRED" | "LOADING" | "IDLE";
}

export default function VerificationStatus({ status }: Props) {
  const config = {
    VERIFIED: { color: "#34D399", text: "VERIFIED", bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.3)" },
    INVALID: { color: "#FF4D6A", text: "INVALID SIGNATURE", bg: "rgba(255, 77, 106, 0.08)", border: "rgba(255, 77, 106, 0.3)" },
    EXPIRED: { color: "#FFB830", text: "EXPIRED", bg: "rgba(255, 184, 48, 0.08)", border: "rgba(255, 184, 48, 0.3)" },
    LOADING: { color: "#00E5FF", text: "VERIFYING...", bg: "rgba(0, 229, 255, 0.08)", border: "rgba(0, 229, 255, 0.3)" },
    IDLE: { color: "#94A3B8", text: "UNVERIFIED", bg: "rgba(148, 163, 184, 0.08)", border: "rgba(148, 163, 184, 0.3)" }
  };

  const { color, text, bg, border } = config[status] || config.IDLE;

  return (
    <>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 10,
          fontWeight: 700,
          color: color,
          letterSpacing: 1,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
            animation: status === "LOADING" || status === "VERIFIED" ? "verification-pulse 1.5s infinite ease-in-out" : "none",
          }}
        />
        {text}
      </span>
      <style>{`
        @keyframes verification-pulse {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </>
  );
}

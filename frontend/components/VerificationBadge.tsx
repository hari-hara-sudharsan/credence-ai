"use client";

interface Props {
  verified: boolean;
  revoked: boolean;
  expired: boolean;
}

export default function VerificationBadge({ verified, revoked, expired }: Props) {
  let label = "UNVERIFIED";
  let color = "#64748B";
  let bg = "rgba(100, 116, 139, 0.08)";
  let border = "rgba(100, 116, 139, 0.2)";
  let pulse = false;

  if (verified) {
    label = "VERIFIED CREDENTIAL";
    color = "#34D399";
    bg = "rgba(52, 211, 153, 0.08)";
    border = "#34D399";
    pulse = true;
  } else if (revoked) {
    label = "REVOKED";
    color = "#FF4D6A";
    bg = "rgba(255, 77, 106, 0.08)";
    border = "#FF4D6A";
  } else if (expired) {
    label = "EXPIRED";
    color = "#FFB830";
    bg = "rgba(255, 184, 48, 0.08)";
    border = "#FFB830";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: "6px 14px",
        color: color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.5,
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {pulse && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            animation: "pulse-grow 1.5s infinite",
          }}
        />
      )}
      {label}
      <style>{`
        @keyframes pulse-grow {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

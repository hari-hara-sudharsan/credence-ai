"use client";

interface Props {
  totalPublished: number;
  verifiedToday: number;
  revokedCount: number;
  avgVerificationTimeMs: number;
}

export default function OracleMetrics({
  totalPublished,
  verifiedToday,
  revokedCount,
  avgVerificationTimeMs,
}: Props) {
  const metrics = [
    {
      label: "PUBLISHED ATTESTATIONS",
      value: totalPublished,
      color: "#00E5FF",
      glowColor: "rgba(0, 229, 255, 0.15)",
    },
    {
      label: "VERIFIED TODAY",
      value: verifiedToday,
      color: "#34D399",
      glowColor: "rgba(52, 211, 153, 0.15)",
    },
    {
      label: "REVOKED",
      value: revokedCount,
      color: "#FF4D6A",
      glowColor: "rgba(255, 77, 106, 0.15)",
    },
    {
      label: "AVG VERIFICATION TIME",
      value: `${avgVerificationTimeMs}ms`,
      color: "#FFB830",
      glowColor: "rgba(255, 184, 48, 0.15)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: "24px 20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`,
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 100,
              height: 100,
              background: m.glowColor,
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1.5,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 10,
            }}
          >
            {m.label}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: m.color,
              fontFamily: "Inter, sans-serif",
              letterSpacing: -1,
            }}
          >
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}

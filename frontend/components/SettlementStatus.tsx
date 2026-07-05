"use client";

interface Props {
  approved: boolean;
  settled: boolean;
}

export default function SettlementStatus({ approved, settled }: Props) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          color: approved ? "#34D399" : "#FF4D6A",
          background: `${approved ? "#34D399" : "#FF4D6A"}1A`,
          border: `1px solid ${approved ? "#34D399" : "#FF4D6A"}`,
          borderRadius: 4,
          padding: "4px 8px",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        AI APPROVED
      </span>

      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          color: settled ? "#00E5FF" : "#FFB830",
          background: `${settled ? "#00E5FF" : "#FFB830"}1A`,
          border: `1px solid ${settled ? "#00E5FF" : "#FFB830"}`,
          borderRadius: 4,
          padding: "4px 8px",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {settled ? "ORACLE SIGNED" : "SIGNATURE PENDING"}
      </span>

      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          color: settled ? "#34D399" : "#64748B",
          background: `${settled ? "#34D399" : "#64748B"}1A`,
          border: `1px solid ${settled ? "#34D399" : "#64748B"}`,
          borderRadius: 4,
          padding: "4px 8px",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {settled ? "HSP SETTLED" : "SETTLEMENT STANDBY"}
      </span>
    </div>
  );
}

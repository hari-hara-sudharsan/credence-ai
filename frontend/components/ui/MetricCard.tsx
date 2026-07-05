"use client";

interface Props {
  label: string;
  value: string | number;
  sub: string;
  color?: string;
}

export default function MetricCard({ label, value, sub, color = "#E2E8F0" }: Props) {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "#64748B",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 6,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color,
          letterSpacing: -0.5,
          marginBottom: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#4A6080" }}>
        {sub}
      </div>
    </div>
  );
}

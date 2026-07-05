"use client";

interface Props {
  totalRuns: number;
  averageDuration: number;
}

export default function DemoMetrics({ totalRuns, averageDuration }: Props) {
  const cards = [
    { label: "TOTAL RUNS", value: totalRuns, color: "#34D399" },
    { label: "AVG EXECUTION TIME", value: `${averageDuration}s`, color: "#00E5FF" },
    { label: "VERIFIED TRANSACTIONS", value: totalRuns * 3, color: "#FFB830" },
    { label: "API CALLS SUM", value: totalRuns * 6, color: "#FF4D6A" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}

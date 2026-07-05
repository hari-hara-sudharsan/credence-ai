"use client";

interface Props {
  selected: string;
  onChange: (strategy: string) => void;
  allocation: Record<string, number>;
}

const STRATEGIES = [
  {
    key: "SAFE",
    label: "Safe",
    icon: "🛡️",
    desc: "Conservative — Focus on Prime & Trusted borrowers",
    color: "#34D399",
  },
  {
    key: "BALANCED",
    label: "Balanced",
    icon: "⚖️",
    desc: "Moderate risk-reward across multiple tiers",
    color: "#60A5FA",
  },
  {
    key: "HIGH_YIELD",
    label: "High Yield",
    icon: "🚀",
    desc: "Higher returns from Standard & Watchlist tiers",
    color: "#F59E0B",
  },
];

export default function LenderStrategy({ selected, onChange, allocation }: Props) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
        RISK STRATEGY
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {STRATEGIES.map((s) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            style={{
              flex: 1,
              padding: "14px 8px",
              background: selected === s.key ? `${s.color}12` : "rgba(15,23,42,0.5)",
              border: `1.5px solid ${selected === s.key ? s.color : "rgba(100,116,139,0.15)"}`,
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: selected === s.key ? s.color : "#E2E8F0", marginBottom: 2 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 9, color: "#64748B", lineHeight: 1.3 }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Allocation Preview */}
      <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 8 }}>ALLOCATION PREVIEW</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {Object.entries(allocation).map(([tier, pct]) => (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#94A3B8", width: 70, fontWeight: 600 }}>{tier}</span>
            <div style={{ flex: 1, background: "rgba(100,116,139,0.1)", borderRadius: 3, height: 6, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: pct >= 50 ? "#34D399" : pct >= 20 ? "#60A5FA" : pct > 0 ? "#F59E0B" : "transparent",
                  borderRadius: 3,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: "#E2E8F0", fontWeight: 700, width: 30, textAlign: "right" }}>
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

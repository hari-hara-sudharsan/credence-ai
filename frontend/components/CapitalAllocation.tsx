"use client";

interface AllocationTier {
  target_percentage: number;
  target_amount: number;
  available_requests: number;
  deployable: boolean;
}

interface Props {
  capital: number;
  allocation: Record<string, AllocationTier>;
}

const TIER_COLORS: Record<string, string> = {
  PRIME: "#34D399",
  TRUSTED: "#60A5FA",
  STANDARD: "#F59E0B",
  WATCHLIST: "#FB923C",
  HIGH_RISK: "#EF4444",
};

export default function CapitalAllocation({ capital, allocation }: Props) {
  const activeTiers = Object.entries(allocation).filter(([, v]) => v.target_percentage > 0);

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.5)",
        border: "1px solid rgba(100,116,139,0.12)",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, letterSpacing: 1.5 }}>YOUR ALLOCATION</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#E2E8F0", marginTop: 4 }}>
            {capital.toLocaleString()} <span style={{ fontSize: 14, color: "#64748B" }}>HSK</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar */}
      <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        {activeTiers.map(([tier, data]) => (
          <div
            key={tier}
            style={{
              width: `${data.target_percentage}%`,
              background: TIER_COLORS[tier] || "#64748B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "width 0.5s ease",
              minWidth: data.target_percentage > 0 ? 20 : 0,
            }}
          >
            {data.target_percentage >= 15 && (
              <span style={{ fontSize: 10, fontWeight: 800, color: "#040C1A" }}>
                {data.target_percentage}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tier Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activeTiers.map(([tier, data]) => (
          <div
            key={tier}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              background: "rgba(4,12,26,0.4)",
              borderRadius: 8,
              borderLeft: `3px solid ${TIER_COLORS[tier]}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: TIER_COLORS[tier] }}>{tier}</span>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>
                {data.target_amount.toLocaleString()} HSK
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                color: data.deployable ? "#34D399" : "#64748B",
                background: data.deployable ? "rgba(52,211,153,0.1)" : "rgba(100,116,139,0.1)",
              }}>
                {data.available_requests} available
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

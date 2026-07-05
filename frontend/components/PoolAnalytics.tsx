"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function PoolAnalytics() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    API.get("/pool/capital-efficiency")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p style={{ color: "#64748B" }}>Loading efficiency analytics...</p>;

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        CAPITAL EFFICIENCY OPTIMIZATION SCORE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "#64748B" }}>Traditional Collateral Requirement</span>
            <span style={{ fontWeight: 700, color: "#E2E8F0" }}>{data.traditional_required_collateral}</span>
          </div>
          <div style={{ height: 6, background: "#111C2E", borderRadius: 3 }}>
            <div style={{ width: "100%", height: "100%", background: "#FF4D6A", borderRadius: 3 }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "#34D399" }}>Credence Reputation Collateral</span>
            <span style={{ fontWeight: 700, color: "#34D399" }}>{data.credence_required_collateral}</span>
          </div>
          <div style={{ height: 6, background: "#111C2E", borderRadius: 3 }}>
            <div style={{ width: "20%", height: "100%", background: "#34D399", borderRadius: 3 }} />
          </div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(52, 211, 153, 0.03)",
          border: "1px solid rgba(52, 211, 153, 0.1)",
          borderRadius: 8,
          padding: 12,
          fontSize: 11,
          color: "#94A3B8",
          lineHeight: 1.5,
        }}
      >
        <strong>Yield Optimization:</strong> Saves <strong>{data.capital_saved}</strong> collateral capital deposits for active borrowing markets. {data.reason}
      </div>
    </div>
  );
}

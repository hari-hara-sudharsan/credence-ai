"use client";

import { useState } from "react";

export default function AlertSettings() {
  const [creditDrop, setCreditDrop] = useState(50);
  const [riskTrigger, setRiskTrigger] = useState("HIGH");

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        MONITORING THRESHOLDS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            CREDIT SCORE DROP THRESHOLD
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="range"
              min="20"
              max="100"
              value={creditDrop}
              onChange={(e) => setCreditDrop(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#00E5FF" }}
            />
            <span style={{ fontSize: 13, color: "#E2E8F0", width: 40, textAlign: "right" }}>
              &gt; {creditDrop}pt
            </span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            RISK ESCALATION THRESHOLD
          </label>
          <select
            value={riskTrigger}
            onChange={(e) => setRiskTrigger(e.target.value)}
            style={{
              width: "100%",
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#E2E8F0",
              fontSize: 12,
              outline: "none",
            }}
          >
            <option value="CRITICAL">Escalation to CRITICAL</option>
            <option value="HIGH">Escalation to HIGH</option>
            <option value="MEDIUM">Escalation to MEDIUM</option>
          </select>
        </div>
      </div>
    </div>
  );
}

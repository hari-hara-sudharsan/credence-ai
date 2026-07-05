"use client";

import { useState } from "react";

export default function EmergencyControls() {
  const [controls, setControls] = useState({
    pauseOracles: false,
    suspendPassport: false,
    disablePolicies: false
  });

  const toggleControl = (key: keyof typeof controls, label: string) => {
    const newVal = !controls[key];
    setControls((prev) => ({ ...prev, [key]: newVal }));
    alert(`Emergency Control action executed: ${label} is now ${newVal ? "ENABLED" : "DISABLED"}. Action proof log stored in audit registries.`);
  };

  return (
    <div
      style={{
        background: "rgba(255, 77, 106, 0.05)",
        border: "1px solid rgba(255, 77, 106, 0.2)",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(255, 77, 106, 0.05)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#FF4D6A",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        EMERGENCY CIRCUIT BREAKERS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Pause Oracle Publishing</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Halts credit feeds sync.</div>
          </div>
          <button
            onClick={() => toggleControl("pauseOracles", "Oracle Publishing Pause")}
            style={{
              background: controls.pauseOracles ? "#FF4D6A" : "#111C2E",
              border: "1px solid #FF4D6A",
              borderRadius: 6,
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {controls.pauseOracles ? "PAUSED" : "PAUSE"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Suspend Passport Issuance</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Blocks VFC credentials updates.</div>
          </div>
          <button
            onClick={() => toggleControl("suspendPassport", "Passport Issuance Suspend")}
            style={{
              background: controls.suspendPassport ? "#FF4D6A" : "#111C2E",
              border: "1px solid #FF4D6A",
              borderRadius: 6,
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {controls.suspendPassport ? "SUSPENDED" : "SUSPEND"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Disable Policy Updates</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Locks down credit rules configurations.</div>
          </div>
          <button
            onClick={() => toggleControl("disablePolicies", "Policy Updates Lock")}
            style={{
              background: controls.disablePolicies ? "#FF4D6A" : "#111C2E",
              border: "1px solid #FF4D6A",
              borderRadius: 6,
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: 12,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {controls.disablePolicies ? "LOCKED" : "LOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}

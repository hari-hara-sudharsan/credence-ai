"use client";

import { useWallet } from "@/context/WalletContext";

interface Step {
  step_id: string;
  service: string;
  success: boolean;
  execution_time: number;
  output: any;
}

interface Props {
  steps: Step[];
}

export default function JourneyTimeline({ steps }: Props) {
  const { wallet } = useWallet();
  const displayAddress = wallet || "0x5bb83e60a7a05a0e1b077b66412a26306e334208";

  if (!steps || steps.length === 0) return null;

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
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        JOURNEY TELEMETRY PROGRESSION
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((s, idx) => (
          <div key={s.step_id} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: s.success ? "#34D399" : "#FF4D6A",
                  border: "3px solid #0A1425",
                  boxShadow: "0 0 10px rgba(52, 211, 153, 0.4)",
                }}
              />
              {idx < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "#111C2E", margin: "6px 0" }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{s.service}</span>
                <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  {s.execution_time}ms
                </span>
              </div>
              
              {/* Collapsed Outputs preview */}
              <div
                style={{
                  background: "#050B14",
                  border: "1px solid #111C2E",
                  borderRadius: 6,
                  padding: 10,
                  marginTop: 6,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#94A3B8",
                  maxHeight: 120,
                  overflowY: "auto",
                }}
              >
                {JSON.stringify(s.output, null, 2).replace(/0x5bb83e60a7a05a0e1b077b66412a26306e334208/gi, displayAddress)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

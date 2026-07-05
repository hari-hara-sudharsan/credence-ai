"use client";

import { useState } from "react";
import API from "@/lib/api";

interface Props {
  policy: any;
  onDelete: (id: string) => void;
}

export default function PolicyCard({ policy, onDelete }: Props) {
  const [exportData, setExportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (exportData) {
      setExportData(null);
      return;
    }
    setLoading(true);
    try {
      const response = await API.get(`/policies/${policy.policy_id}/export`);
      setExportData(response.data);
    } catch (err) {
      alert("Failed to export policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>{policy.policy_name}</div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>
            ID: {policy.policy_id} • v{policy.version}
          </div>
        </div>

        <span
          style={{
            background: "rgba(0, 229, 255, 0.08)",
            border: "1px solid #00E5FF",
            borderRadius: 6,
            padding: "3px 8px",
            color: "#00E5FF",
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {policy.protocol}
        </span>
      </div>

      {/* Rules list */}
      <div style={{ margin: "16px 0", borderTop: "1px solid #111C2E", paddingTop: 12 }}>
        <div style={{ fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>
          CRITERIA RULES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {policy.rules.map((rule: any, i: number) => (
            <div
              key={i}
              style={{
                background: "#050B14",
                border: "1px solid #111C2E",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#94A3B8" }}>{rule.field}</span>
              <span>
                <span style={{ color: "#FFB830", marginRight: 6 }}>{rule.operator}</span>
                <span style={{ color: "#E2E8F0", fontWeight: 600 }}>{String(rule.value)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Delete Action controls */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={handleExport}
          disabled={loading}
          style={{
            flex: 1,
            background: "rgba(0, 229, 255, 0.08)",
            border: "1px solid #00E5FF",
            borderRadius: 8,
            color: "#00E5FF",
            fontSize: 11,
            fontWeight: 600,
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {loading ? "EXPORTING..." : exportData ? "HIDE TEMPLATE" : "EXPORT TEMPLATE"}
        </button>

        <button
          onClick={() => onDelete(policy.policy_id)}
          style={{
            background: "rgba(255, 77, 106, 0.08)",
            border: "1px solid #FF4D6A",
            borderRadius: 8,
            color: "#FF4D6A",
            fontSize: 11,
            fontWeight: 600,
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          DELETE
        </button>
      </div>

      {/* Export JSON Block */}
      {exportData && (
        <div style={{ marginTop: 16, animation: "slide-down 0.2s ease" }}>
          <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            PORTABLE TEMPLATE (SHA-256 CHECK)
          </div>
          <pre
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 6,
              padding: 12,
              fontSize: 10,
              color: "#34D399",
              fontFamily: "JetBrains Mono, monospace",
              overflow: "auto",
              maxHeight: 180,
              margin: 0,
            }}
          >
            {JSON.stringify(exportData, null, 2)}
          </pre>
        </div>
      )}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

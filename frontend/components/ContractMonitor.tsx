"use client";

interface ContractItem {
  contract: string;
  address: string;
  status: string;
}

interface Props {
  contracts: ContractItem[];
}

export default function ContractMonitor({ contracts }: Props) {
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
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        DEPLOYED SMART CONTRACT REGISTRY
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #111C2E", textAlign: "left" }}>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                CONTRACT NAME
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                CHAIN REGISTRY ADDRESS
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #111C2E", fontSize: 13, color: "#E2E8F0" }}>
                <td style={{ padding: "12px 8px", fontWeight: 700 }}>{c.contract}</td>
                <td style={{ padding: "12px 8px", fontFamily: "JetBrains Mono, monospace" }}>{c.address}</td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: "#34D399",
                      background: "rgba(52, 211, 153, 0.05)",
                      border: "1px solid #34D399",
                      borderRadius: 4,
                      padding: "2px 6px",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

export default function TechStack() {
  const stack = [
    { tech: "Solidity 0.8.28", role: "Smart Contracts & Registry" },
    { tech: "EIP-712 Signatures", role: "Cryptographic Attestation Proofs" },
    { tech: "FastAPI & Python", role: "Risk Engine & ML Predictive logic" },
    { tech: "Next.js 16 (Turbopack)", role: "Developer Portal & Interfaces Cockpit" },
    { tech: "Web3.py & Ethers.js", role: "EVM Interfacing Bridges" },
    { tech: "Hardhat 3", role: "Ignition Deployment Modules" }
  ];

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
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
        TECHNOLOGY OVERVIEW STACK
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {stack.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>
              {item.tech}
            </div>
            <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              {item.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

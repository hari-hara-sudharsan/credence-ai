"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

interface OracleItem {
  address: string;
  version: string;
  status: string;
  lastActivity: string;
}

export default function OracleManagement() {
  const { wallet } = useWallet();
  const [oracles, setOracles] = useState<OracleItem[]>([]);

  const [newOracle, setNewOracle] = useState("");
  const [loading, setLoading] = useState(false);

  // Load real oracle data from governance dashboard
  useEffect(() => {
    const loadOracles = async () => {
      try {
        const resp = await API.get("/governance/dashboard");
        // Build oracle list from active count if no direct list endpoint
        if (resp.data?.active_oracles !== undefined) {
          // Try to get real oracle list
          try {
            const rolesResp = await API.get("/governance/roles");
            const oracleRoles = (rolesResp.data || []).filter(
              (r: any) => r.role === "ORACLE_OPERATOR" || r.role === "SUPER_ADMIN"
            );
            if (oracleRoles.length > 0) {
              setOracles(oracleRoles.map((r: any) => ({
                address: r.actor,
                version: "v2.0.1",
                status: "ACTIVE",
                lastActivity: "On-chain"
              })));
            }
          } catch { /* roles endpoint may not return oracle-specific data */ }
        }
      } catch (err) {
        console.error("Failed to load oracle data:", err);
      }
    };
    loadOracles();
  }, []);

  const registerOracle = async () => {
    if (!newOracle.trim()) return;
    setLoading(true);
    try {
      const response = await API.post("/governance/oracle", {
        oracle: newOracle.trim()
      }, {
        headers: { "x-actor": wallet || "" }
      });
      alert(`Oracle Registered successfully! Proof Tx: ${response.data.tx_hash}`);
      setOracles((prev) => [
        ...prev,
        { address: newOracle.trim(), version: "v2.0.1", status: "ACTIVE", lastActivity: "Just now" }
      ]);
      setNewOracle("");
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Failed to register oracle operator.";
      alert(detail);
    } finally {
      setLoading(false);
    }
  };

  const suspendOracle = async (addr: string) => {
    try {
      await API.patch(`/governance/oracle/${addr}`, {
        status: "REVOKED"
      }, {
        headers: { "x-actor": wallet || "" }
      });
      setOracles((prev) =>
        prev.map((o) => (o.address === addr ? { ...o, status: "REVOKED" } : o))
      );
      alert("Oracle revoked successfully.");
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Revocation failed.";
      alert(detail);
    }
  };

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
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ORACLE OPERATORS MANAGEMENT
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          value={newOracle}
          onChange={(e) => setNewOracle(e.target.value)}
          placeholder="New Operator Address (0x...)"
          style={{
            flex: 1,
            background: "#050B14",
            border: "1px solid #1D2E49",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#E2E8F0",
            fontSize: 13,
            outline: "none",
            fontFamily: "JetBrains Mono, monospace",
          }}
        />
        <button
          onClick={registerOracle}
          disabled={loading}
          style={{
            background: "#34D399",
            border: "none",
            borderRadius: 8,
            color: "#040C1A",
            fontWeight: 700,
            fontSize: 13,
            padding: "0 20px",
            cursor: "pointer",
          }}
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {oracles.map((o) => (
          <div
            key={o.address}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
                {o.address}
              </div>
              <span style={{ fontSize: 10, color: "#64748B", marginRight: 12 }}>Version: {o.version}</span>
              <span style={{ fontSize: 10, color: "#64748B" }}>Activity: {o.lastActivity}</span>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: o.status === "ACTIVE" ? "#34D399" : "#FF4D6A",
                  background: `${o.status === "ACTIVE" ? "#34D399" : "#FF4D6A"}1A`,
                  border: `1px solid ${o.status === "ACTIVE" ? "#34D399" : "#FF4D6A"}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                {o.status}
              </span>

              {o.status === "ACTIVE" && (
                <button
                  onClick={() => suspendOracle(o.address)}
                  style={{
                    background: "transparent",
                    border: "1px solid #FF4D6A",
                    borderRadius: 4,
                    color: "#FF4D6A",
                    fontSize: 11,
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  REVOKE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

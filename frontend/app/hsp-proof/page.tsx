"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function HSPProofPage() {
  const { wallet } = useWallet();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedProof, setSelectedProof] = useState<any | null>(null);
  const [searchId, setSearchId] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchHistory = async (address: string) => {
    setLoadingHistory(true);
    try {
      const res = await API.get(`/hsp/history/${address}`);
      setHistory(res.data || []);
      if (res.data && res.data.length > 0) {
        fetchProofDetails(res.data[0].settlementId);
      } else {
        setSelectedProof(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchProofDetails = async (id: string) => {
    setLoadingProof(true);
    setErrorMessage("");
    try {
      const res = await API.get(`/hsp/proof/${id}`);
      setSelectedProof(res.data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || "Failed to fetch proof details");
    } finally {
      setLoadingProof(false);
    }
  };

  useEffect(() => {
    if (wallet && wallet.trim().length > 0) {
      fetchHistory(wallet.trim());
    } else {
      setHistory([]);
      setSelectedProof(null);
    }
  }, [wallet]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim().length > 0) {
      fetchProofDetails(searchId.trim());
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header Block */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#00E5FF",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#00E5FF" }}></span>
            Economic Settlement Layer
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF 0%, #64748B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              margin: 0,
            }}
          >
            HashKey Settlement Proof Center
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 8, maxWidth: 600 }}>
            Every economic event on Credence triggers native HSK settlement and cryptographic proof generation, upgrading your portable credit profile.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 40, maxWidth: 600 }}>
          <input
            type="text"
            placeholder="Search by Settlement ID (e.g. hsp_settle_sim_12345)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              background: "rgba(17, 28, 46, 0.5)",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 13,
              outline: "none",
              transition: "border 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#00E5FF")}
            onBlur={(e) => (e.target.style.borderColor = "#111C2E")}
          />
          <button
            type="submit"
            style={{
              background: "#00E5FF",
              color: "#040C1A",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontWeight: 650,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Query Proof
          </button>
        </form>

        {errorMessage && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: 8,
              padding: "16px",
              color: "#EF4444",
              fontSize: 13,
              marginBottom: 32,
              maxWidth: 600,
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32 }}>
          {/* Timeline / History list */}
          <div
            style={{
              background: "rgba(10, 18, 30, 0.3)",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 24,
              minHeight: 400,
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", fontSize: 16, fontWeight: 700 }}>Settlement Registry</h3>
            {loadingHistory ? (
              <p style={{ color: "#64748B", fontSize: 13 }}>Fetching history feed...</p>
            ) : !wallet ? (
              <p style={{ color: "#64748B", fontSize: 13 }}>Please connect a test wallet address to view settlement history.</p>
            ) : history.length === 0 ? (
              <p style={{ color: "#64748B", fontSize: 13 }}>No HSP settlements found for this wallet. Execute a loan in the borrow flow to generate history.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {history.map((item) => (
                  <div
                    key={item.settlementId}
                    onClick={() => fetchProofDetails(item.settlementId)}
                    style={{
                      padding: 16,
                      background: "rgba(17, 28, 46, 0.4)",
                      border: `1px solid ${selectedProof?.txHash === item.hspProofHash ? "#00E5FF" : "#111C2E"}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedProof?.txHash !== item.hspProofHash) {
                        e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedProof?.txHash !== item.hspProofHash) {
                        e.currentTarget.style.borderColor = "#111C2E";
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
                        ID: {item.settlementId.substring(0, 15)}...
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: item.verified ? "#34D399" : "#64748B",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {item.verified ? "VERIFIED ✓" : "PENDING"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>
                        {item.amount} HSK
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 750, color: "#34D399" }}>
                        {item.trustImpact} Trust
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Proof Viewer */}
          <div
            style={{
              background: "rgba(10, 18, 30, 0.3)",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {loadingProof ? (
              <p style={{ color: "#64748B", fontSize: 13, alignSelf: "center", justifySelf: "center" }}>Retrieving on-chain proof data...</p>
            ) : !selectedProof ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#64748B" }}>
                <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>🛡️</span>
                <p style={{ fontSize: 14, margin: 0 }}>Select a settlement or search by ID to inspect cryptographic proofs.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Settlement Proof Details</h3>
                  <div
                    style={{
                      background: "rgba(52, 211, 153, 0.08)",
                      border: "1px solid rgba(52, 211, 153, 0.2)",
                      borderRadius: 20,
                      padding: "4px 16px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#34D399",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    STATUS: {selectedProof.settlement}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                      Transaction Hash (HSK)
                    </span>
                    <span style={{ display: "block", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#00E5FF", wordBreak: "break-all" }}>
                      {selectedProof.txHash || "0x"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                        Disbursed Value
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#FFF" }}>
                        {selectedProof.amount} HSK
                      </span>
                    </div>

                    <div>
                      <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                        Ecosystem Trust Generated
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#34D399" }}>
                        {selectedProof.trustGenerated} Trust
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                      Borrower Wallet
                    </span>
                    <span style={{ display: "block", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>
                      {selectedProof.borrower}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                      Lender Protocol
                    </span>
                    <span style={{ display: "block", fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>
                      {selectedProof.lender}
                    </span>
                  </div>

                  {selectedProof.timestamp && (
                    <div>
                      <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                        Settlement Timestamp
                      </span>
                      <span style={{ display: "block", fontSize: 13, color: "#94A3B8" }}>
                        {new Date(selectedProof.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 40,
                    padding: 20,
                    background: "rgba(0, 229, 255, 0.04)",
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    borderRadius: 12,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#94A3B8",
                  }}
                >
                  <strong style={{ color: "#FFF" }}>Security Proof:</strong> This transaction was completed on-chain using HashKey Chain RPC. The state updates have been verified by the Credence Oracle network, triggering score upgrades across the ecosystem.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

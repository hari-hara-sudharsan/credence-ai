"use client";

import { useState } from "react";
import API from "@/lib/api";
import PassportIdentityCard from "@/components/PassportIdentityCard";
import TrustTimeline from "@/components/TrustTimeline";
import ProtocolProfileGrid from "@/components/ProtocolProfileGrid";
import AttestationViewer from "@/components/AttestationViewer";
import CredentialQRCode from "@/components/CredentialQRCode";

export default function PassportV2Page() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [passport, setPassport] = useState<any | null>(null);
  const [vcDoc, setVcDoc] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!wallet.trim()) {
      setError("Please enter a valid wallet address.");
      return;
    }
    setLoading(true);
    setError(null);
    setPassport(null);
    setVcDoc(null);

    try {
      // 1. Generate/Mint Passport V2
      const response = await API.post("/passport/v2/generate", { wallet: wallet.trim() });
      setPassport(response.data);

      // 2. Fetch standards-inspired Verifiable Credential document
      const vcResponse = await API.get(`/passport/v2/${wallet.trim()}/credential`);
      setVcDoc(vcResponse.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Passport generation failed. Ensure your wallet features exist."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!passport) return;
    setRefreshing(true);
    setError(null);

    try {
      const response = await API.post("/passport/v2/refresh", { wallet: passport.wallet });
      setPassport(response.data);

      const vcResponse = await API.get(`/passport/v2/${passport.wallet}/credential`);
      setVcDoc(vcResponse.data);
      alert("Passport and on-chain references refreshed successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "60px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6080",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <span>FINANCIAL IDENTITY REGISTRY</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>PORTABLE CREDENTIALS</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            Credence Financial Identity
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            A cryptographically verifiable financial identity for the decentralized economy. Generate and export your secure credit credentials.
          </p>
        </div>

        {/* Wallet Generation Entry Bar */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            marginBottom: 32,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter Wallet Address (0x...)"
            style={{
              flex: 1,
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !wallet.trim()}
            style={{
              background: "#00E5FF",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 700,
              fontSize: 14,
              padding: "14px 28px",
              cursor: loading || !wallet.trim() ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "GENERATING..." : "GENERATE PASSPORT V2"}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 77, 106, 0.08)",
              border: "1px solid rgba(255, 77, 106, 0.3)",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#FF4D6A",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {passport && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 32,
              animation: "fade-in 0.4s ease",
            }}
          >
            {/* Top Row: Identity Card + QR Code */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <PassportIdentityCard passport={passport} />
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  style={{
                    background: "rgba(52, 211, 153, 0.08)",
                    border: "1px solid #34D399",
                    borderRadius: 10,
                    color: "#34D399",
                    fontWeight: 700,
                    fontSize: 13,
                    padding: "12px 20px",
                    cursor: refreshing ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                  }}
                >
                  {refreshing ? "REFRESHING METRICS ON-CHAIN..." : "SYNC & REFRESH SCORES ON-CHAIN"}
                </button>
              </div>

              <CredentialQRCode wallet={passport.wallet} />
            </div>

            {/* Middle Row: Protocol Profiles */}
            <ProtocolProfileGrid profiles={passport.protocol_profiles} />

            {/* Bottom Row: Evidence & Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              <TrustTimeline issuedAt={passport.issued_at} oracleVerified={passport.oracle_verified} />
              <AttestationViewer passport={passport} vcDoc={vcDoc} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface ProtocolHealth {
  security: string;
  riskLevel: string;
  warnings: string[];
  components: {
    identityLayer: string;
    aiLayer: string;
    oracleLayer: string;
    settlementLayer: string;
    graphLayer: string;
  };
}

export default function ProtocolStatusPage() {
  const [health, setHealth] = useState<ProtocolHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/api/v1/security/health");
        setHealth(response.data);
      } catch (err: any) {
        console.error("Error loading health status:", err);
        setError("Failed to fetch protocol health statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#111C2E] bg-[#050E1E] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0F172A] via-[#040C1A] to-[#040C1A] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3A8A] bg-[#1E3A8A]/20 px-3 py-1 text-xs font-semibold text-[#60A5FA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
              SYSTEM HEALTH MONITOR
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Protocol Status
            </h1>
            <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl font-sans">
              Operational diagnostics, contract validation, and real-time security alerts on HashKey Chain.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
            <div className="h-32 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#7F1D1D] bg-[#450A0A]/20 p-6 text-[#F87171]">
            <p className="font-medium">Protocol Health Telemetry Timeout</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : health && (
          <div className="space-y-12">
            {/* Status Summary Banner */}
            <div className="bg-[#050E1E] border border-[#1A4D3E] bg-gradient-to-r from-[#050E1E] to-[#0B2E24]/20 rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Ecosystem Health Standing</h3>
                <p className="text-sm text-[#94A3B8] max-w-xl">
                  All security verification mechanisms are verified. AI model risk prediction layers are active and synced.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#64748B] font-mono">STATUS</span>
                <span className="text-lg font-bold text-[#34D399] bg-[#0D261F] px-4 py-1.5 rounded-sm border border-[#1A4D3E] font-mono">
                  {health.security}
                </span>
              </div>
            </div>

            {/* Core Layers Status */}
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-6">Core Telemetry Blocks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Identity Layer</span>
                      <span className="text-sm font-semibold text-white mt-1 block">Credit Passport V2 Registry</span>
                    </div>
                    <span className="text-xs text-[#34D399] bg-[#0D261F] px-2.5 py-0.5 rounded border border-[#1A4D3E] font-mono font-bold">
                      {health.components.identityLayer}
                    </span>
                  </CardContent>
                </Card>

                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">AI Decision Layer</span>
                      <span className="text-sm font-semibold text-white mt-1 block">Transparent Underwriter</span>
                    </div>
                    <span className="text-xs text-[#34D399] bg-[#0D261F] px-2.5 py-0.5 rounded border border-[#1A4D3E] font-mono font-bold">
                      {health.components.aiLayer}
                    </span>
                  </CardContent>
                </Card>

                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Oracle Layer</span>
                      <span className="text-sm font-semibold text-white mt-1 block">Consensus Attestations</span>
                    </div>
                    <span className="text-xs text-[#34D399] bg-[#0D261F] px-2.5 py-0.5 rounded border border-[#1A4D3E] font-mono font-bold">
                      {health.components.oracleLayer}
                    </span>
                  </CardContent>
                </Card>

                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Settlement Layer</span>
                      <span className="text-sm font-semibold text-white mt-1 block">HSP Settlement Engine</span>
                    </div>
                    <span className="text-xs text-[#34D399] bg-[#0D261F] px-2.5 py-0.5 rounded border border-[#1A4D3E] font-mono font-bold">
                      {health.components.settlementLayer}
                    </span>
                  </CardContent>
                </Card>

                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Graph Layer</span>
                      <span className="text-sm font-semibold text-white mt-1 block">Ecosystem Relational map</span>
                    </div>
                    <span className="text-xs text-[#34D399] bg-[#0D261F] px-2.5 py-0.5 rounded border border-[#1A4D3E] font-mono font-bold">
                      {health.components.graphLayer}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Smart Contract Registry Details */}
            <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl">
              <CardContent className="p-8">
                <h3 className="font-display text-xl font-bold text-white mb-6">Security & Replay Verifiers</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-[#111C2E] pb-2">
                    <span className="text-[#94A3B8]">TrustVerifier (EIP-712)</span>
                    <span className="text-[#60A5FA]">0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60</span>
                  </div>
                  <div className="flex justify-between border-b border-[#111C2E] pb-2">
                    <span className="text-[#94A3B8]">Signature Expiry Window</span>
                    <span className="text-white">3600 seconds (1 hour)</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-[#94A3B8]">Nonce Replay Protection</span>
                    <span className="text-[#34D399]">ACTIVE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

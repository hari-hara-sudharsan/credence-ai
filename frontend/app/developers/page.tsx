"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import ApiKeyCard from "@/components/ApiKeyCard";
import EndpointCard from "@/components/EndpointCard";
import WebhookCard from "@/components/WebhookCard";
import SDKDownloadCard from "@/components/SDKDownloadCard";
import ApiPlayground from "@/components/ApiPlayground";
import { Card, CardContent } from "@/components/ui/card";

interface HealthMetric {
  integration_name: string;
  adapter_version: string;
  last_request: string;
  total_requests: number;
  success_rate: number;
  average_latency_ms: number;
}

interface Analytics {
  total_api_requests: number;
  active_integrations: number;
  average_latency_ms: number;
  success_rate: number;
  most_used_endpoint: string;
}

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<"health" | "keys" | "endpoints" | "sdks" | "webhooks" | "playground">("health");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [healthData, setHealthData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/developer/health");
      setAnalytics(res.data.analytics);
      setHealthData(res.data.integrations);
    } catch (err) {
      console.error("Failed to fetch integration health data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const TABS = [
    { id: "health", label: "Health & Analytics" },
    { id: "keys", label: "API Keys" },
    { id: "endpoints", label: "API Reference" },
    { id: "sdks", label: "SDK Downloads" },
    { id: "webhooks", label: "Webhooks" },
    { id: "playground", label: "Playground" }
  ];

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Credence Protocol — Developer Documentation Center</span>
        </div>

        {/* Hero Section */}
        <div className="pb-6 border-b border-[#2A3142]/40">
          <h1 className="font-display text-4xl sm:text-5xl font-medium leading-[1.1] mb-4 text-[#E8E6DE]">
            Developer Platform
          </h1>
          <p className="font-sans text-[#6B7280] text-base sm:text-lg max-w-3xl">
            Build on top of Credence AI using production-ready API controllers, custom client SDK libraries, and background webhooks event pipelines.
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#2A3142]/30 pb-1">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`font-mono text-[11px] tracking-wider uppercase px-4 py-2 border-b-2 transition-all cursor-pointer ${
                  isSelected 
                    ? "border-[#00E5FF] text-[#00E5FF] font-semibold" 
                    : "border-transparent text-[#6B7280] hover:text-[#E8E6DE]/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Render Tab Content */}
        <div className="rise-in">
          {activeTab === "health" && (
            <div className="space-y-6">
              {/* Analytics Summary Row */}
              {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-[#2A3142]/70 bg-[#1A1F2B]/30 rounded-sm p-4">
                    <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Total API Requests</span>
                    <div className="font-display text-2xl font-bold text-[#E8E6DE] mt-1">
                      {analytics.total_api_requests.toLocaleString()}
                    </div>
                  </div>
                  <div className="border border-[#2A3142]/70 bg-[#1A1F2B]/30 rounded-sm p-4">
                    <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Success Rate</span>
                    <div className="font-display text-2xl font-bold text-[#3DDC97] mt-1">
                      {analytics.success_rate}%
                    </div>
                  </div>
                  <div className="border border-[#2A3142]/70 bg-[#1A1F2B]/30 rounded-sm p-4">
                    <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Average Latency</span>
                    <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">
                      {analytics.average_latency_ms} <span className="font-sans text-xs text-[#6B7280] font-normal">ms</span>
                    </div>
                  </div>
                  <div className="border border-[#2A3142]/70 bg-[#1A1F2B]/30 rounded-sm p-4">
                    <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Active Integrations</span>
                    <div className="font-display text-2xl font-bold text-[#E8E6DE] mt-1">
                      {analytics.active_integrations}
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Health Table */}
              <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2A3142]/40">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
                    <h3 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
                      Integration Health Dashboard
                    </h3>
                  </div>
                  <button 
                    onClick={fetchHealthData}
                    disabled={loading}
                    className="font-mono text-[9px] text-[#00E5FF] hover:underline cursor-pointer"
                  >
                    {loading ? "Refreshing..." : "Refresh Stats"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] text-[#E8E6DE]/80">
                    <thead>
                      <tr className="border-b border-[#2A3142]/35 text-[#6B7280] text-[10px]">
                        <th className="pb-3">Integration Name</th>
                        <th className="pb-3">Adapter Version</th>
                        <th className="pb-3">Total Calls</th>
                        <th className="pb-3">Latency</th>
                        <th className="pb-3">Success Rate</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A3142]/20">
                      {healthData.map((row) => (
                        <tr key={row.integration_name} className="hover:bg-[#0B0E14]/15">
                          <td className="py-4 font-semibold text-[#E8E6DE]/95">{row.integration_name}</td>
                          <td className="py-4 text-[#6B7280]">{row.adapter_version}</td>
                          <td className="py-4">{row.total_requests.toLocaleString()}</td>
                          <td className="py-4 text-[#00E5FF]">{row.average_latency_ms} ms</td>
                          <td className="py-4 text-[#3DDC97]">{row.success_rate}%</td>
                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1.5 font-sans text-[10px] text-[#3DDC97] bg-[#3DDC97]/10 px-2 py-0.5 rounded-sm">
                              <span className="w-1.5 h-1.5 bg-[#3DDC97] rounded-full animate-pulse" />
                              Healthy
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "keys" && <ApiKeyCard />}

          {activeTab === "endpoints" && <EndpointCard />}

          {activeTab === "sdks" && <SDKDownloadCard />}

          {activeTab === "webhooks" && <WebhookCard />}

          {activeTab === "playground" && <ApiPlayground />}
        </div>
      </div>
    </main>
  );
}

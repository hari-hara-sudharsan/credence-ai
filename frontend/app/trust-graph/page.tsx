"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface GraphNode {
  id: string;
  type: string;
  trustScore: number;
  connections: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  trustImpact: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  trustScore: number;
}

interface GraphInsights {
  rank: string;
  opportunities: string[];
  growthPath: string;
}

export default function TrustGraphPage() {
  const { wallet } = useWallet();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [insights, setInsights] = useState<GraphInsights | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) {
      setGraphData(null);
      setInsights(null);
      setSelectedNode(null);
      return;
    }

    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [graphRes, insightsRes] = await Promise.all([
          API.get(`/api/graph/${wallet}`),
          API.get(`/api/graph/insights/${wallet}`)
        ]);

        setGraphData(graphRes.data);
        setInsights(insightsRes.data);

        // Pre-select center node
        const center = graphRes.data.nodes.find((n: any) => n.id.toLowerCase() === wallet.toLowerCase());
        setSelectedNode(center || graphRes.data.nodes[0]);
      } catch (err: any) {
        console.error("Error loading trust graph:", err);
        setError("Failed to compile HashKey Trust Graph structure.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [wallet]);

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A3056] via-[#040C1A] to-[#040C1A] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3A8A] bg-[#1E3A8A]/20 px-3 py-1 text-xs font-semibold text-[#3B82F6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                RELATIONAL TRUST GRAPH
              </div>
              <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                HashKey Trust Graph
              </h1>
              <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl font-sans">
                Map your interconnected financial reputation network across protocols, pools, and entities.
              </p>
            </div>
            {insights && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#64748B] font-mono">ECOSYSTEM STANDING</span>
                <span className="text-lg font-bold text-[#34D399] bg-[#0D261F] px-4 py-1.5 rounded-sm border border-[#1A4D3E] mt-1 font-mono">
                  {insights.rank}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {!wallet ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#1E293B] rounded-lg bg-[#050E1E]">
            <h3 className="text-lg font-semibold text-white">Wallet Not Connected</h3>
            <p className="mt-2 text-sm text-[#94A3B8] max-w-sm mx-auto text-center">
              Connect your Web3 wallet to build your decentralized trust relationships map.
            </p>
          </div>
        ) : loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
            <div className="h-32 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#7F1D1D] bg-[#450A0A]/20 p-6 text-[#F87171]">
            <p className="font-medium">Relational Graph Fetch Failure</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Graph Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trust Graph Visual SVG Card */}
              <div className="lg:col-span-2">
                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl h-full flex flex-col justify-between">
                  <CardContent className="p-8">
                    <h2 className="font-display text-2xl font-bold text-white mb-6">Interactive Network Visualizer</h2>
                    
                    <div className="flex items-center justify-center bg-[#030914] border border-[#111C2E] rounded-md p-8 relative min-h-[300px]">
                      <svg width="100%" height="300" viewBox="0 0 500 300" className="max-w-lg">
                        {/* Connecting Lines */}
                        <g stroke="#1D4ED8" strokeWidth="2" strokeOpacity="0.4">
                          {graphData?.edges.map((edge, idx) => {
                            const targetIdx = graphData.nodes.findIndex(n => n.id === edge.to);
                            if (targetIdx === -1) return null;
                            // Project points on a simple circle layout for simplicity of presentation
                            const angle = (idx * (2 * Math.PI)) / (graphData.edges.length || 1);
                            const x2 = 250 + 150 * Math.cos(angle);
                            const y2 = 150 + 100 * Math.sin(angle);
                            return (
                              <line 
                                key={idx} 
                                x1="250" y1="150" 
                                x2={x2} y2={y2} 
                                className="animate-[pulse_3s_infinite]"
                                stroke={edge.type.includes("DEFAULT") ? "#EF4444" : "#1D4ED8"}
                              />
                            );
                          })}
                        </g>

                        {/* Nodes */}
                        {/* Center Node */}
                        <circle 
                          cx="250" cy="150" r="26" 
                          fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" 
                          className="cursor-pointer"
                          onClick={() => {
                            const c = graphData?.nodes.find(n => n.id.toLowerCase() === wallet.toLowerCase());
                            if (c) setSelectedNode(c);
                          }}
                        />
                        <text x="250" y="153" fill="#60A5FA" fontSize="8" textAnchor="middle" fontWeight="bold" className="pointer-events-none">YOU</text>

                        {/* Surrounding Nodes */}
                        {graphData?.nodes.map((node, idx) => {
                          if (node.id.toLowerCase() === wallet.toLowerCase()) return null;
                          const angle = ((idx - 1) * (2 * Math.PI)) / ((graphData.nodes.length - 1) || 1);
                          const x = 250 + 150 * Math.cos(angle);
                          const y = 150 + 100 * Math.sin(angle);
                          return (
                            <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                              <circle 
                                cx={x} cy={y} r="18" 
                                fill={node.type === "PROTOCOL" ? "#064E3B" : "#1F2937"} 
                                stroke={node.type === "PROTOCOL" ? "#34D399" : "#9CA3AF"} 
                                strokeWidth="1.5" 
                              />
                              <text x={x} y={y + 3} fill="#E2E8F0" fontSize="7" textAnchor="middle" className="pointer-events-none">
                                {node.id.slice(0, 3)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Node Detail / Recommendation Column */}
              <div className="space-y-8">
                {selectedNode && (
                  <Card className="bg-[#050E1E] border-[#1E3A8A] rounded-sm shadow-2xl">
                    <CardContent className="p-8">
                      <span className="text-xs text-[#3B82F6] font-mono block mb-1">NODE ANALYTICS</span>
                      <h3 className="font-display text-2xl font-bold text-white mb-6">
                        {selectedNode.id === wallet ? "Your Wallet Node" : `${selectedNode.id} Entity`}
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Entity Type</span>
                          <span className="text-sm font-semibold text-white mt-1 block">{selectedNode.type}</span>
                        </div>

                        <div className="border-t border-[#111C2E] pt-6">
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Trust Score</span>
                          <span className="text-3xl font-bold text-[#34D399] font-mono mt-1 block">{selectedNode.trustScore}</span>
                        </div>

                        <div className="border-t border-[#111C2E] pt-6">
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider block">Active Connections</span>
                          <span className="text-lg font-semibold text-white mt-1 block font-mono">{selectedNode.connections} branches</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Growth Path */}
                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl">
                  <CardContent className="p-8">
                    <h3 className="font-display text-lg font-bold text-white mb-4">AI Recommended Trust Growth Path</h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed italic mb-6">
                      "{insights?.growthPath}"
                    </p>
                    <span className="text-xs text-[#64748B] font-mono block">OPPORTUNITIES UNLOCKED:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {insights?.opportunities.map((opp, idx) => (
                        <span key={idx} className="text-xs text-[#3B82F6] bg-[#1E3A8A]/20 px-2.5 py-0.5 rounded border border-[#1D4ED8]/40 font-semibold">
                          {opp}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API from "@/lib/api";

interface Factor {
  name: string;
  weight: number;
  raw_value: number;
  normalized_score: number;
  weighted_contribution: number;
  explanation: string;
  status: "strong" | "moderate" | "weak";
}

interface UnderwritingReport {
  wallet: string;
  credit_score: number;
  risk_level: string;
  default_probability: number;
  badge: string;
  factors: Factor[];
  summary: string;
}

export default function ScoreBreakdown({ wallet }: { wallet: string }) {
  const [report, setReport] = useState<UnderwritingReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) return;
    
    API.get(`/underwriting/report/${wallet}`)
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load underwriting report:", err);
        setLoading(false);
      });
  }, [wallet]);

  if (loading) {
    return (
      <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 w-1/3 bg-[#2A3142] rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-[#2A3142] rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong": return "text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20";
      case "moderate": return "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20";
      case "weak": return "text-[#FFB830] bg-[#FFB830]/10 border-[#FFB830]/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusBarColor = (status: string) => {
    switch (status) {
      case "strong": return "bg-[#34D399]";
      case "moderate": return "bg-[#00E5FF]";
      case "weak": return "bg-[#FFB830]";
      default: return "bg-gray-500";
    }
  };

  const formatFactorName = (name: string) => {
    return name.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] transition-all duration-300 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#34D399]/5 rounded-full blur-xl pointer-events-none" />
      
      <CardHeader className="border-b border-[#2A3142]/40 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#6B7280] uppercase">
              AI Credit Engine
            </span>
            <h3 className="font-mono text-sm font-semibold text-[#E8E6DE] mt-1">
              Transparent Score Breakdown
            </h3>
          </div>
          
          <div className="flex gap-2">
            <Badge className="font-mono text-[10px] tracking-[0.05em] px-2 rounded-sm border border-[#2A3142] bg-[#0A1425] text-[#94A3B8]">
              DEFAULT PROBABILITY: {report.default_probability.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-5">
        <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
          {report.summary}
        </p>

        <div className="space-y-4">
          {report.factors.map((factor, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-[#0A1425] border border-[#111C2E]">
              {/* Left: Factor Name & Weight */}
              <div className="w-[140px] shrink-0">
                <div className="font-mono text-[11px] text-[#E2E8F0] mb-1">
                  {formatFactorName(factor.name)}
                </div>
                <div className="font-mono text-[9px] text-[#64748B]">
                  Weight: {(factor.weight * 100).toFixed(0)}%
                </div>
              </div>

              {/* Middle: Progress Bar & Score */}
              <div className="flex-1 space-y-2 pt-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className={getStatusColor(factor.status).split(' ')[0]}>
                    {factor.normalized_score.toFixed(0)} / 100
                  </span>
                  <span className="text-[#64748B] uppercase tracking-wider">
                    {factor.status}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#1A2740] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStatusBarColor(factor.status)}`}
                    style={{ width: `${factor.normalized_score}%` }}
                  />
                </div>
              </div>

              {/* Right: Explanation */}
              <div className="w-[180px] shrink-0 pt-1">
                <p className="text-[10px] text-[#94A3B8] leading-snug">
                  {factor.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

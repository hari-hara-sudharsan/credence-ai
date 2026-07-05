"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrustScoreCardProps {
  trustScore: number;
  rating: string;
  protocolConfidence: number;
}

export default function TrustScoreCard({
  trustScore,
  rating,
  protocolConfidence,
}: TrustScoreCardProps) {
  const [scoreProgress, setScoreProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScoreProgress(trustScore), 150);
    return () => clearTimeout(timer);
  }, [trustScore]);

  // Determine colors based on rating
  let ratingStyle = "border-gray-500 text-gray-400 bg-gray-500/10";
  let barColor = "bg-gray-500";
  let textColor = "text-gray-400";
  
  if (rating === "Institutional") {
    ratingStyle = "border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10";
    barColor = "bg-[#00E5FF]";
    textColor = "text-[#00E5FF]";
  } else if (rating === "Trusted") {
    ratingStyle = "border-[#3DDC97] text-[#3DDC97] bg-[#3DDC97]/10";
    barColor = "bg-[#3DDC97]";
    textColor = "text-[#3DDC97]";
  } else if (rating === "Reliable") {
    ratingStyle = "border-emerald-500 text-emerald-500 bg-emerald-500/10";
    barColor = "bg-emerald-500";
    textColor = "text-emerald-500";
  } else if (rating === "Developing") {
    ratingStyle = "border-[#FFB830] text-[#FFB830] bg-[#FFB830]/10";
    barColor = "bg-[#FFB830]";
    textColor = "text-[#FFB830]";
  } else if (rating === "High Risk") {
    ratingStyle = "border-[#FF4D6A] text-[#FF4D6A] bg-[#FF4D6A]/10";
    barColor = "bg-[#FF4D6A]";
    textColor = "text-[#FF4D6A]";
  }

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] transition-all duration-300 hover:border-[#00E5FF]/20 hover:bg-[#1A1F2B]/50 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#00E5FF]/5 rounded-full blur-xl pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#2A3142]/40">
        <div>
          <span className="font-mono text-[10px] tracking-[0.1em] text-[#6B7280] uppercase">
            On-Chain Standing
          </span>
          <h3 className="font-mono text-xs font-semibold text-[#E8E6DE]/90 mt-0.5">
            Dynamic Reputation Trust
          </h3>
        </div>
        <Badge className={`font-mono text-[10px] tracking-[0.08em] px-2.5 py-0.5 rounded-sm border uppercase font-semibold ${ratingStyle}`}>
          {rating}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-6">
          {/* Trust Score circular gauge or numeric panel */}
          <div className="flex flex-col items-center justify-center bg-[#0B0E14]/60 border border-[#2A3142]/40 rounded-sm p-4 w-28 h-28 shrink-0 relative">
            <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">
              Trust Score
            </span>
            <span className={`font-display text-4xl font-bold mt-1.5 ${textColor}`}>
              {trustScore}
            </span>
            <span className="font-mono text-[9px] text-[#4A6080] mt-0.5">
              / 100
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            <div>
              <span className="font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase block">
                Rating Classification
              </span>
              <p className="font-sans text-xs text-[#E8E6DE]/85 mt-1 leading-relaxed">
                Your wallet is designated as <strong className={textColor}>{rating}</strong> on-chain. This classification is continuously audited by the Credence Protocol.
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[9px] text-[#6B7280] uppercase">
                <span>Trust Rating Progress</span>
                <span>{trustScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A2740] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${barColor} transition-all duration-1000 ease-out`} 
                  style={{ width: `${scoreProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

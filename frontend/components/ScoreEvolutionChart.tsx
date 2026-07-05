"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ScoreHistoryItem {
  date: string;
  score: number;
}

interface ScoreEvolutionChartProps {
  scoreHistory: ScoreHistoryItem[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  const formattedDate = new Date(data.rawDate).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="bg-[#0B0E14] border border-[#2A3142] rounded-sm p-3 shadow-xl">
      <div className="font-mono text-[10px] text-[#6B7280] tracking-wider uppercase mb-1">
        {formattedDate}
      </div>
      <div className="flex items-baseline gap-1.5 font-display text-xl font-bold text-[#00E5FF]">
        {data.score}
        <span className="font-sans text-[10px] text-[#6B7280] font-normal">Points</span>
      </div>
    </div>
  );
};

export default function ScoreEvolutionChart({ scoreHistory }: ScoreEvolutionChartProps) {
  const chartData = scoreHistory.map((item, index) => {
    const d = new Date(item.date);
    const shortDate = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return {
      name: shortDate,
      score: item.score,
      rawDate: item.date,
    };
  });

  return (
    <div className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 space-y-4 text-[#E8E6DE]">
      <div className="flex items-center gap-2">
        <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
        <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
          Credit Score Evolution Trend
        </h4>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="reputationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2A3142/40"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="#4A6080"
              tick={{
                fill: "#6B7280",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
              }}
              axisLine={{ stroke: "#2A3142/50" }}
              tickLine={{ stroke: "#2A3142/50" }}
            />

            <YAxis
              stroke="#4A6080"
              domain={["dataMin - 50", "dataMax + 50"]}
              tick={{
                fill: "#6B7280",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
              }}
              axisLine={{ stroke: "#2A3142/50" }}
              tickLine={{ stroke: "#2A3142/50" }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A3142/40" }} />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#00E5FF"
              strokeWidth={2}
              fill="url(#reputationGradient)"
              dot={{
                r: 3.5,
                fill: "#0B0E14",
                stroke: "#00E5FF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5.5,
                fill: "#00E5FF",
                stroke: "#0B0E14",
                strokeWidth: 2,
                style: { filter: "drop-shadow(0 0 5px #00E5FF)" },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0D1B2E",
        border: "1px solid #1A2740",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 4,
        }}
      >
        ENTRY #{label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#00E5FF",
          fontFamily: "Inter, sans-serif",
          letterSpacing: -0.5,
        }}
      >
        {payload[0].value}
      </div>
    </div>
  );
};

export default function CreditHistoryChart({ history }: { history: any[] }) {
  const chartData = history.map((item, index) => ({
    index: index + 1,
    score: item.score,
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1A2740"
            vertical={false}
          />

          <XAxis
            dataKey="index"
            stroke="#2E4060"
            tick={{
              fill: "#4A6080",
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
            }}
            axisLine={{ stroke: "#1A2740" }}
            tickLine={{ stroke: "#1A2740" }}
          />

          <YAxis
            stroke="#2E4060"
            tick={{
              fill: "#4A6080",
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
            }}
            axisLine={{ stroke: "#1A2740" }}
            tickLine={{ stroke: "#1A2740" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="score"
            stroke="#00E5FF"
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
            dot={{
              r: 4,
              fill: "#040C1A",
              stroke: "#00E5FF",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#00E5FF",
              stroke: "#040C1A",
              strokeWidth: 2,
              style: { filter: "drop-shadow(0 0 6px #00E5FF)" },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
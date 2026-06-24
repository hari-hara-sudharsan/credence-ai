"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CreditHistoryChart({
  history,
}: {
  history: any[];
}) {

  const chartData =
    history.map(
      (item, index) => ({
        index:
          index + 1,

        score:
          item.score,
      })
    );

  return (

    <div className="w-full h-[350px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={chartData}
        >

          <XAxis
            dataKey="index"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
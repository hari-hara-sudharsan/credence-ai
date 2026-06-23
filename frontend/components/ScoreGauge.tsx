"use client";

import {
  RadialBarChart,
  RadialBar,
} from "recharts";

export default function ScoreGauge({
  score,
}: {
  score: number;
}) {

  const data = [
    {
      name: "score",
      value: score,
      fill: "#2563eb",
    },
  ];

  return (
    <div className="flex justify-center">

      <RadialBarChart
        width={250}
        height={250}
        innerRadius="80%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >

        <RadialBar
          dataKey="value"
        />

      </RadialBarChart>

    </div>
  );
}
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ScoreChart({
  data,
}: {
  data: Array<{ range: string; count: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,0,0,0.06)"
        />
        <XAxis
          dataKey="range"
          stroke="rgba(0,0,0,0.4)"
          fontSize={12}
          tick={{ fill: "#6b7280" }}
        />
        <YAxis
          stroke="rgba(0,0,0,0.4)"
          fontSize={12}
          tick={{ fill: "#6b7280" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            color: "#111827",
          }}
        />
        <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartsProps {
  commitsOverTime: Array<{ date: string; count: number }>;
  churnOverTime: Array<{ date: string; additions: number; deletions: number }>;
}

export function Charts({ commitsOverTime, churnOverTime }: ChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="mb-4 text-lg font-semibold">Commits Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={commitsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="date"
              stroke="#a1a1aa"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="#a1a1aa" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="mb-4 text-lg font-semibold">Code Churn (Additions/Deletions)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={churnOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="date"
              stroke="#a1a1aa"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="#a1a1aa" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Legend />
            <Bar dataKey="additions" fill="#10b981" />
            <Bar dataKey="deletions" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

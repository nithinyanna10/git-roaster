"use client";

import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Analysis } from "@/types/analysis";

interface MomentumStripProps {
  analysis: Analysis;
}

export function MomentumStrip({ analysis }: MomentumStripProps) {
  const starsData = analysis.series.weeklyStars.map((w) => ({
    date: w.weekStartISO,
    value: w.starsGained,
  }));

  const issuesData = analysis.series.weeklyIssues.map((w) => ({
    date: w.weekStartISO,
    opened: w.opened,
    closed: w.closed,
  }));

  const prsData = analysis.series.weeklyPRs.map((w) => ({
    date: w.weekStartISO,
    opened: w.opened,
    merged: w.merged,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="glass rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-2">Stars</div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={starsData}>
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-2">Issues</div>
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={issuesData}>
            <Line type="monotone" dataKey="opened" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-2">PRs</div>
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={prsData}>
            <Line type="monotone" dataKey="opened" stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="merged" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

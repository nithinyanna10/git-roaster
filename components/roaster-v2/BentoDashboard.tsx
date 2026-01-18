"use client";

import { motion } from "framer-motion";
import { Metrics, Scores } from "@/types";
import { useTheme } from "./ThemeProvider";

interface BentoDashboardProps {
  metrics: Metrics;
  scores: Scores;
}

const BENTO_TILES = [
  {
    id: "pulse",
    label: "Repo Pulse",
    emoji: "💓",
    size: "medium" as const,
    getValue: (m: Metrics) => `${m.commitsLast30Days} commits (30d)`,
    getInsight: (m: Metrics) =>
      m.commitsTrend === "increasing" ? "Momentum building" : "Activity stable",
    score: (s: Scores) => s.pulse,
  },
  {
    id: "churn",
    label: "Churn Heat",
    emoji: "🔥",
    size: "medium" as const,
    getValue: (m: Metrics) => `${Math.round(m.churnRatio)} lines/commit`,
    getInsight: (m: Metrics) =>
      m.churnRatio > 500 ? "High volatility" : "Stable changes",
    score: (s: Scores) => s.stability,
  },
  {
    id: "tests",
    label: "Tests",
    emoji: "🧪",
    size: "small" as const,
    getValue: (m: Metrics) => (m.hasTests ? "Present" : "Missing"),
    getInsight: () => "Quality check",
    score: (s: Scores) => s.tests,
  },
  {
    id: "ci",
    label: "CI/CD",
    emoji: "⚙️",
    size: "small" as const,
    getValue: (m: Metrics) => (m.hasCI ? "Active" : "None"),
    getInsight: () => "Automation",
    score: (s: Scores) => s.tests,
  },
  {
    id: "releases",
    label: "Releases",
    emoji: "📦",
    size: "small" as const,
    getValue: (m: Metrics) => `${m.releasesCount} total`,
    getInsight: (m: Metrics) =>
      m.daysSinceLastRelease && m.daysSinceLastRelease < 30
        ? "Fresh updates"
        : "Stale",
    score: (s: Scores) => s.releases,
  },
  {
    id: "docs",
    label: "Docs",
    emoji: "📚",
    size: "small" as const,
    getValue: (m: Metrics) => (m.hasDocs ? "Present" : "Missing"),
    getInsight: () => "Documentation",
    score: (s: Scores) => s.docs,
  },
  {
    id: "bus",
    label: "Bus Factor",
    emoji: "🚌",
    size: "small" as const,
    getValue: (m: Metrics) => `${m.topContributorPct}% top`,
    getInsight: (m: Metrics) =>
      m.uniqueContributors90Days > 5 ? "Team effort" : "Solo heavy",
    score: (s: Scores) => s.busFactor,
  },
];

export function BentoDashboard({ metrics, scores }: BentoDashboardProps) {
  const { config } = useTheme();

  const getTileSize = (size: "small" | "medium" | "large") => {
    if (size === "large") return "col-span-2 row-span-2";
    if (size === "medium") return "col-span-1 row-span-1 md:col-span-2";
    return "col-span-1 row-span-1";
  };

  const getColor = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-emerald-500/20 border-green-500/30";
    if (score >= 60) return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    if (score >= 40) return "from-orange-500/20 to-red-500/20 border-orange-500/30";
    return "from-red-500/20 to-rose-500/20 border-red-500/30";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {BENTO_TILES.map((tile, index) => {
        const tileScore = tile.score(scores);
        return (
          <motion.div
            key={tile.id}
            className={`${getTileSize(tile.size)} rounded-xl border bg-gradient-to-br p-4 cursor-pointer group ${getColor(
              tileScore
            )}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">{tile.emoji}</div>
              <div className="text-2xl font-bold">{tileScore}</div>
            </div>
            <div className="text-sm font-medium mb-1">{tile.label}</div>
            <div className="text-xs text-zinc-400 mb-2 font-mono">
              {tile.getValue(metrics)}
            </div>
            <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {tile.getInsight(metrics)}
            </div>
            <div className="h-1 w-full rounded-full bg-black/20 mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-current rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tileScore}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

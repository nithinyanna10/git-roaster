"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface BentoDashboardProps {
  analysis: Analysis;
}

const TILES = [
  { id: "vibe", label: "Vibe Meter", size: "large" as const, getValue: (a: Analysis) => a.scores.vibeTotal, emoji: "⭐" },
  { id: "pulse", label: "Pulse", size: "small" as const, getValue: (a: Analysis) => a.scores.pulse, emoji: "💓" },
  { id: "churn", label: "Churn", size: "small" as const, getValue: (a: Analysis) => a.scores.churn, emoji: "🔥" },
  { id: "busFactor", label: "Bus Factor", size: "small" as const, getValue: (a: Analysis) => a.scores.busFactor, emoji: "🚌" },
  { id: "tests", label: "Tests", size: "small" as const, getValue: (a: Analysis) => a.scores.tests, emoji: "🧪" },
  { id: "ci", label: "CI/CD", size: "small" as const, getValue: (a: Analysis) => a.scores.ci, emoji: "⚙️" },
  { id: "releases", label: "Releases", size: "small" as const, getValue: (a: Analysis) => a.scores.releases, emoji: "📦" },
  { id: "docs", label: "Docs", size: "small" as const, getValue: (a: Analysis) => a.scores.docs, emoji: "📚" },
  { id: "issueResponse", label: "Issue Response", size: "medium" as const, getValue: (a: Analysis) => a.scores.issues, emoji: "📝" },
  { id: "prMerge", label: "PR Merge Rate", size: "medium" as const, getValue: (a: Analysis) => a.scores.prs, emoji: "🔀" },
  { id: "momentum", label: "Momentum", size: "medium" as const, getValue: (a: Analysis) => a.scores.momentum, emoji: "📈" },
  { id: "risk", label: "Risk Level", size: "small" as const, getValue: (a: Analysis) => a.scores.risk, emoji: "⚠️" },
  { id: "opsHealth", label: "Ops Health", size: "small" as const, getValue: (a: Analysis) => a.verdicts.opsHealth === "Healthy" ? 80 : a.verdicts.opsHealth === "At Risk" ? 50 : 20, emoji: "🏥" },
];

export function BentoDashboard({ analysis }: BentoDashboardProps) {
  const { pinnedTiles, addPinnedTile, removePinnedTile, selectedClaimId } = useAppStore();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const getColor = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-emerald-500/20 border-green-500/30";
    if (score >= 60) return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    if (score >= 40) return "from-orange-500/20 to-red-500/20 border-orange-500/30";
    return "from-red-500/20 to-rose-500/20 border-red-500/30";
  };

  const getSizeClass = (size: "small" | "medium" | "large") => {
    if (size === "large") return "col-span-2 row-span-2";
    if (size === "medium") return "col-span-1 md:col-span-2";
    return "col-span-1";
  };

  const isPinned = (tileId: string) => pinnedTiles.includes(tileId);
  const isHighlighted = (tileId: string) => {
    if (!selectedClaimId) return false;
    const claim = analysis.claims.find((c) => c.id === selectedClaimId);
    return claim?.relatedTiles.includes(tileId) || false;
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">The Dashboard</h2>
          <p className="text-zinc-400">Interactive metrics breakdown</p>
        </div>

        {/* Spotlight Row */}
        {pinnedTiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm text-zinc-400 mb-2">Spotlight</h3>
            <div className="flex gap-2 flex-wrap">
              {pinnedTiles.map((tileId) => {
                const tile = TILES.find((t) => t.id === tileId);
                if (!tile) return null;
                return (
                  <button
                    key={tileId}
                    onClick={() => removePinnedTile(tileId)}
                    className="glass rounded-lg px-4 py-2 text-sm border border-white/20 hover:bg-white/10 flex items-center gap-2"
                  >
                    {tile.emoji} {tile.label}
                    <span>×</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TILES.map((tile, index) => {
            const score = tile.getValue(analysis);
            const isHovered = hoveredTile === tile.id;
            const highlighted = isHighlighted(tile.id);

            return (
              <motion.div
                key={tile.id}
                className={`${getSizeClass(tile.size)} rounded-xl border bg-gradient-to-br p-4 cursor-pointer relative ${
                  highlighted ? "ring-2 ring-purple-500" : ""
                } ${getColor(score)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredTile(tile.id)}
                onHoverEnd={() => setHoveredTile(null)}
                onClick={() => (isPinned(tile.id) ? removePinnedTile(tile.id) : addPinnedTile(tile.id))}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{tile.emoji}</div>
                  <button
                    className={`text-xs ${isPinned(tile.id) ? "text-purple-400" : "text-zinc-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isPinned(tile.id) ? removePinnedTile(tile.id) : addPinnedTile(tile.id);
                    }}
                  >
                    {isPinned(tile.id) ? "📌" : "📍"}
                  </button>
                </div>
                <div className="text-sm font-medium mb-1">{tile.label}</div>
                <div className="text-3xl font-bold mb-2">{score}</div>
                <div className="h-1 w-full rounded-full bg-black/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-current rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.8 }}
                  />
                </div>
                {isHovered && (
                  <motion.div
                    className="mt-2 text-xs opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                  >
                    Click to pin
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

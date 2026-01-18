"use client";

import { motion } from "framer-motion";
import { Scores } from "@/types";
import { useState } from "react";

const BADGES = [
  { key: "pulse" as const, label: "Pulse", emoji: "💓", description: "Activity and recency of commits" },
  { key: "stability" as const, label: "Stability", emoji: "🧱", description: "Code churn and stability" },
  { key: "busFactor" as const, label: "Bus Factor", emoji: "🚌", description: "Distribution of contributions" },
  { key: "tests" as const, label: "Tests", emoji: "🧪", description: "Test coverage and CI/CD" },
  { key: "releases" as const, label: "Releases", emoji: "📦", description: "Release frequency and recency" },
  { key: "docs" as const, label: "Docs", emoji: "📚", description: "Documentation quality" },
] as const;

interface BadgeGridProps {
  scores: Scores;
}

export function BadgeGrid({ scores }: BadgeGridProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const getColor = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
    if (score >= 60) return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400";
    if (score >= 40) return "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400";
    return "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400";
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-center mb-6">Scorecard</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((badge, index) => {
            const score = scores[badge.key];
            const isHovered = hovered === badge.key;

            return (
              <motion.div
                key={badge.key}
                className={`rounded-xl border bg-gradient-to-br p-4 cursor-pointer transition-all ${
                  isHovered ? "scale-105 shadow-lg" : ""
                } ${getColor(score)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onHoverStart={() => setHovered(badge.key)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className="text-sm font-medium mb-1">{badge.label}</div>
                <div className="text-3xl font-bold mb-2">{score}</div>
                <div className="h-2 w-full rounded-full bg-black/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-current rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                {isHovered && (
                  <motion.div
                    className="mt-2 text-xs opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                  >
                    {badge.description}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

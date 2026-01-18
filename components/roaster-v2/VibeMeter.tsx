"use client";

import { motion } from "framer-motion";
import { Scores } from "@/types";
import { useTheme } from "./ThemeProvider";

interface VibeMeterProps {
  scores: Scores;
}

export function VibeMeter({ scores }: VibeMeterProps) {
  const { config } = useTheme();
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (scores.vibe / 100) * circumference;

  const getVibeLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getVibeColor = (score: number) => {
    if (score >= 80) return config.colors.accent;
    if (score >= 60) return config.colors.secondary;
    if (score >= 40) return "#f59e0b";
    return config.colors.primary;
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div
        className={`rounded-2xl p-8 ${
          config.effects.glass
            ? "backdrop-blur-xl bg-white/5 border border-white/10"
            : config.effects.borders === "bold"
            ? "bg-white border-4 border-black"
            : "bg-zinc-900/80 border border-zinc-700"
        }`}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Vibe Score</h3>
        <div className="relative w-64 h-64 mx-auto">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-zinc-800"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="90"
              stroke={getVibeColor(scores.vibe)}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div
                className="text-6xl font-black"
                style={{ color: getVibeColor(scores.vibe) }}
              >
                {scores.vibe}
              </div>
              <div className="text-sm text-zinc-400 mt-2">{getVibeLabel(scores.vibe)}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

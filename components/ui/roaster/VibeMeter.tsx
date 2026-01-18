"use client";

import { motion } from "framer-motion";
import { Scores } from "@/types";

interface VibeMeterProps {
  scores: Scores;
}

export function VibeMeter({ scores }: VibeMeterProps) {
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (scores.vibe / 100) * circumference;

  const getVibeLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getVibeColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="relative z-10 max-w-md mx-auto px-4 mb-8">
      <motion.div
        className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="text-2xl font-bold mb-6">Vibe Score</h3>
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
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={getVibeColor(scores.vibe)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className={`text-6xl font-black ${getVibeColor(scores.vibe)}`}>
                {scores.vibe}
              </div>
              <div className="text-sm text-zinc-400 mt-2">{getVibeLabel(scores.vibe)}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

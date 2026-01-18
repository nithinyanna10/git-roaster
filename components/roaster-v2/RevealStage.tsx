"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types";
import { useTheme } from "./ThemeProvider";
import { RepoPersonaAvatar } from "./RepoPersonaAvatar";
import { VibeMeter } from "./VibeMeter";
import { BentoDashboard } from "./BentoDashboard";

interface RevealStageProps {
  result: AnalysisResult;
  mode: "roast" | "praise";
  onCopy: () => void;
  onShare: () => void;
}

export function RevealStage({ result, mode, onCopy, onShare }: RevealStageProps) {
  const { config } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < result.narrative.text.length) {
        setDisplayText(result.narrative.text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [result.narrative.text]);

  return (
    <section className="min-h-screen py-20 px-4 snap-start">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Narrative Card */}
        <motion.div
          className={`rounded-2xl p-8 ${
            config.effects.glass
              ? "backdrop-blur-xl bg-white/5 border border-white/10"
              : config.effects.borders === "bold"
              ? "bg-white border-4 border-black"
              : "bg-zinc-900/80 border border-zinc-700"
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-5xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {mode === "roast" ? "🔥" : "✨"}
              </motion.span>
              <h2 className="text-3xl font-bold">
                {mode === "roast" ? "The Roast" : "The Praise"}
              </h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 flex items-center gap-1">
              <span>✅</span>
              <span>Receipts attached</span>
            </div>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-zinc-200 leading-relaxed mb-6 min-h-[120px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {displayText}
            {isTyping && (
              <motion.span
                className="inline-block w-1 h-6 ml-1"
                style={{ backgroundColor: config.colors.primary }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.p>

          <div className="flex gap-3">
            <motion.button
              onClick={onCopy}
              className="px-6 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📋 Copy
            </motion.button>
            <motion.button
              onClick={onShare}
              className="px-6 py-3 rounded-lg border border-purple-600 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎴 Share Card
            </motion.button>
          </div>
        </motion.div>

        {/* Vibe Meter + Persona */}
        <div className="grid md:grid-cols-2 gap-8">
          <VibeMeter scores={result.scores} />
          <motion.div
            className={`rounded-2xl p-8 flex flex-col items-center justify-center ${
              config.effects.glass
                ? "backdrop-blur-xl bg-white/5 border border-white/10"
                : "bg-zinc-900/80 border border-zinc-700"
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">Repo Persona</h3>
            <RepoPersonaAvatar metrics={result.metrics} scores={result.scores} size="lg" />
          </motion.div>
        </div>

        {/* Bento Dashboard */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Dashboard</h3>
          <BentoDashboard metrics={result.metrics} scores={result.scores} />
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { RepoPersonaAvatar } from "./RepoPersonaAvatar";
import { Metrics, Scores } from "@/types";

const TRENDING_REPOS = [
  { name: "vercel/next.js", url: "https://github.com/vercel/next.js" },
  { name: "facebook/react", url: "https://github.com/facebook/react" },
  { name: "microsoft/vscode", url: "https://github.com/microsoft/vscode" },
  { name: "torvalds/linux", url: "https://github.com/torvalds/linux" },
];

interface HeroIgnitionProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  onAnalyze: () => void;
  previewMetrics?: Metrics;
  previewScores?: Scores;
}

export function HeroIgnition({
  repoUrl,
  setRepoUrl,
  onAnalyze,
  previewMetrics,
  previewScores,
}: HeroIgnitionProps) {
  const { config } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const fullText = "Turn any repo into a story: vibe, health, drama, receipts.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 snap-start">
      <div className="max-w-6xl w-full text-center">
        {/* Hero Title */}
        <motion.h1
          className="text-7xl md:text-9xl font-black mb-6"
          style={{
            background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Git Roaster
        </motion.h1>

        {/* Subtitle with typing effect */}
        <motion.p
          className="text-xl md:text-2xl mb-12 text-zinc-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {displayText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1"
          >
            |
          </motion.span>
        </motion.p>

        {/* Preview Avatar if metrics available */}
        {previewMetrics && previewScores && (
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <RepoPersonaAvatar metrics={previewMetrics} scores={previewScores} size="lg" />
          </motion.div>
        )}

        {/* Input Console */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className={`rounded-2xl p-6 ${
              config.effects.glass
                ? "backdrop-blur-xl bg-white/5 border border-white/10"
                : config.effects.borders === "bold"
                ? "bg-white border-4 border-black"
                : "bg-zinc-900/80 border border-zinc-700"
            }`}
          >
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
              placeholder="https://github.com/owner/repo"
              className="w-full px-4 py-4 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm mb-4"
            />
            <div className="flex gap-3">
              <motion.button
                onClick={onAnalyze}
                className="flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
                  color: "#fff",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔥 Ignite Roast
              </motion.button>
              <motion.button
                className="px-6 py-4 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ⚔️ Battle
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trending Repos Carousel */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-zinc-400 mb-4">Try trending repos:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TRENDING_REPOS.map((repo) => (
              <motion.button
                key={repo.name}
                onClick={() => setRepoUrl(repo.url)}
                className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {repo.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Powered by badge */}
        <motion.div
          className="mt-12 text-xs text-zinc-500 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>📊</span>
          <span>Powered by data</span>
        </motion.div>
      </div>
    </section>
  );
}

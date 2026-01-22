"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { Toggle } from "./Toggle";

const INSIGHTS = [
  "README.md: 'Coming soon' since 2019 💀",
  "No CI/CD detected ⚡",
  "Bus factor: 1 → single-point-of-failure energy 🚨",
  "Last commit: 312 days ago 🪦",
  "Zero releases. Is this code even real? 📦",
  "95% one contributor. Solo project vibes 👤",
];

interface HeroIgnitionProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function HeroIgnition({ repoUrl, setRepoUrl, onAnalyze, loading }: HeroIgnitionProps) {
  const { mode, setMode, liveGithub, setLiveGithub, token, setToken, bookmarkedRepos, history, removeBookmark } = useAppStore();
  const [showTokenDrawer, setShowTokenDrawer] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [parsed, setParsed] = useState<{ owner: string; repo: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % INSIGHTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const match = repoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
    if (match) {
      setParsed({ owner: match[1], repo: match[2] });
    } else {
      setParsed(null);
    }
  }, [repoUrl]);

  const modes = [
    { id: "roast" as const, label: "Roast", emoji: "🔥" },
    { id: "praise" as const, label: "Praise", emoji: "✨" },
    { id: "audit" as const, label: "Audit", emoji: "🧾" },
    { id: "investor" as const, label: "Investor", emoji: "📈" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Hero Title */}
        <motion.h1
          className="text-7xl md:text-9xl font-black mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Git Roaster
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-zinc-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Turn any repo into a story: vibe, health, drama, receipts.
        </motion.p>

        {/* Rotating Insight */}
        <motion.div
          key={currentInsight}
          className="inline-block px-4 py-2 rounded-full glass border border-white/20 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <span className="text-sm text-zinc-300">{INSIGHTS[currentInsight]}</span>
        </motion.div>

        {/* Console Card */}
        <Card className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-zinc-400 font-mono">git-roaster v3.0</span>
          </div>

          {/* Input with History/Bookmarks */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && onAnalyze()}
                placeholder="https://github.com/owner/repo or owner/repo"
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              />
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-3 rounded-lg glass border border-white/10 text-zinc-300 hover:bg-white/5"
                title="History"
              >
                📜
              </button>
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className="px-3 py-3 rounded-lg glass border border-white/10 text-zinc-300 hover:bg-white/5"
                title="Bookmarks"
              >
                ⭐
              </button>
            </div>
            {parsed && (
              <div className="mt-2 text-xs text-green-400 font-mono">
                ✓ {parsed.owner} / {parsed.repo}
              </div>
            )}
            
            {/* History Dropdown */}
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 glass rounded-lg p-2 max-h-48 overflow-y-auto"
              >
                {history.slice(0, 10).map((entry) => (
                  <button
                    key={entry.timestamp}
                    onClick={() => {
                      setRepoUrl(entry.repoUrl);
                      setMode(entry.mode);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-white/5 text-sm text-zinc-300 flex justify-between items-center"
                  >
                    <span className="truncate">{entry.repoName}</span>
                    <span className="text-xs text-zinc-500 ml-2">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Bookmarks Dropdown */}
            {showBookmarks && bookmarkedRepos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 glass rounded-lg p-2 max-h-48 overflow-y-auto"
              >
                {bookmarkedRepos.map((bookmark) => (
                  <div
                    key={bookmark.repoUrl}
                    className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 group"
                  >
                    <button
                      onClick={() => {
                        setRepoUrl(bookmark.repoUrl);
                        setShowBookmarks(false);
                      }}
                      className="flex-1 text-left text-sm text-zinc-300 truncate"
                    >
                      {bookmark.repoName}
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark.repoUrl)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Mode Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m.id
                    ? "bg-purple-600 text-white"
                    : "glass border border-white/10 text-zinc-300 hover:bg-white/5"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>

          {/* Token Drawer */}
          <button
            onClick={() => setShowTokenDrawer(!showTokenDrawer)}
            className="text-xs text-zinc-400 hover:text-zinc-300 mb-2"
          >
            {showTokenDrawer ? "▼" : "▶"} GitHub Token (optional, for private repos)
          </button>

          {showTokenDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </motion.div>
          )}

          {/* Live GitHub Toggle */}
          <div className="mb-4">
            <Toggle
              checked={liveGithub}
              onChange={setLiveGithub}
              label="Live GitHub (uses real API, requires token for private repos)"
            />
          </div>

          {/* CTA */}
          <Button
            onClick={onAnalyze}
            disabled={loading || !parsed}
            className="w-full"
            size="lg"
          >
            {loading ? "Analyzing..." : "Ignite →"}
          </Button>

          <p className="mt-4 text-xs text-zinc-500">
            This roast is fact-based. All claims backed by real metrics.
          </p>
        </Card>
      </div>
    </section>
  );
}

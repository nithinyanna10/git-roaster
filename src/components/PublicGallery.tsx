"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface PublicRoast {
  id: string;
  repoName: string;
  repoUrl: string;
  mode: string;
  vibeScore: number;
  narrative: string;
  createdAt: number;
  likes: number;
  remixes: number;
}

export function PublicGallery() {
  const [roasts, setRoasts] = useState<PublicRoast[]>([]);
  const [filter, setFilter] = useState<"all" | "roast" | "praise" | "audit" | "investor">("all");

  // In production, this would fetch from a backend
  const loadRoasts = () => {
    // Simulated public roasts
    const mockRoasts: PublicRoast[] = [
      {
        id: "1",
        repoName: "facebook/react",
        repoUrl: "https://github.com/facebook/react",
        mode: "roast",
        vibeScore: 95,
        narrative: "This repo is so well-maintained, it's almost suspicious...",
        createdAt: Date.now() - 86400000,
        likes: 42,
        remixes: 5,
      },
      {
        id: "2",
        repoName: "vercel/next.js",
        repoUrl: "https://github.com/vercel/next.js",
        mode: "praise",
        vibeScore: 92,
        narrative: "Outstanding documentation and consistent releases!",
        createdAt: Date.now() - 172800000,
        likes: 38,
        remixes: 3,
      },
    ];
    setRoasts(mockRoasts);
    showToast("Public roasts loaded");
  };

  const handleLike = (id: string) => {
    setRoasts((prev) =>
      prev.map((roast) =>
        roast.id === id ? { ...roast, likes: roast.likes + 1 } : roast
      )
    );
    showToast("Liked!");
  };

  const handleRemix = (roast: PublicRoast) => {
    // Open in new tab with repo and mode
    const url = new URL(window.location.href);
    url.searchParams.set("repo", roast.repoUrl);
    url.searchParams.set("mode", roast.mode);
    window.open(url.toString(), "_blank");
    showToast("Opening for remix...");
  };

  const filteredRoasts = filter === "all" ? roasts : roasts.filter((r) => r.mode === filter);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Public Roast Gallery</h3>
        <Button onClick={loadRoasts} variant="primary" size="sm">
          🔄 Load Roasts
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "roast", "praise", "audit", "investor"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border transition-all text-sm ${
              filter === f
                ? "border-purple-500 bg-purple-500/20 text-purple-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredRoasts.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🎨</div>
          <p>No public roasts yet</p>
          <p className="text-sm mt-2">Click "Load Roasts" to see community roasts</p>
          <p className="text-xs mt-4 text-zinc-500">
            (Note: Requires backend integration for real public gallery)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoasts.map((roast) => (
            <motion.div
              key={roast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg">{roast.repoName}</h4>
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs">
                      {roast.mode}
                    </span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                      {roast.vibeScore}/100
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{roast.narrative}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span>{new Date(roast.createdAt).toLocaleDateString()}</span>
                    <span>❤️ {roast.likes}</span>
                    <span>🔄 {roast.remixes}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleLike(roast.id)}
                  variant="secondary"
                  size="sm"
                >
                  ❤️ Like
                </Button>
                <Button
                  onClick={() => handleRemix(roast)}
                  variant="secondary"
                  size="sm"
                >
                  🔄 Remix
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(roast.repoUrl);
                    showToast("Repo URL copied!");
                  }}
                  variant="secondary"
                  size="sm"
                >
                  🔗 Copy URL
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-yellow-900/20 border border-yellow-700/50">
        <p className="text-sm text-yellow-300">
          ⚠️ <strong>Note:</strong> Public gallery requires backend integration for real-time sharing.
          Currently shows mock data for demonstration.
        </p>
      </div>
    </Card>
  );
}

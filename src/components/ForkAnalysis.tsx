"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Fork {
  id: string;
  owner: string;
  name: string;
  stars: number;
  forks: number;
  lastUpdated: number;
  aheadBy: number;
  behindBy: number;
  hasChanges: boolean;
  description: string;
}

interface ForkAnalysisProps {
  analysis: Analysis;
  repoUrl: string;
}

export function ForkAnalysis({ analysis, repoUrl }: ForkAnalysisProps) {
  const [forks, setForks] = useState<Fork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFork, setSelectedFork] = useState<Fork | null>(null);

  const loadForks = async () => {
    setIsLoading(true);
    showToast("Loading fork analysis...");

    try {
      // In production, this would call GitHub API to get forks
      // GET /repos/{owner}/{repo}/forks
      // Then compare each fork with the original

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockForks: Fork[] = [
        {
          id: "1",
          owner: "forker1",
          name: analysis.repo.name,
          stars: 45,
          forks: 12,
          lastUpdated: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          aheadBy: 3,
          behindBy: 15,
          hasChanges: true,
          description: "Added support for TypeScript 5.0 and improved type safety",
        },
        {
          id: "2",
          owner: "contributor2",
          name: analysis.repo.name,
          stars: 23,
          forks: 5,
          lastUpdated: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          aheadBy: 0,
          behindBy: 42,
          hasChanges: false,
          description: "Personal fork with experimental features",
        },
        {
          id: "3",
          owner: "org-team",
          name: analysis.repo.name,
          stars: 128,
          forks: 34,
          lastUpdated: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          aheadBy: 12,
          behindBy: 2,
          hasChanges: true,
          description: "Enterprise fork with additional security features and compliance updates",
        },
      ];

      setForks(mockForks);
      showToast(`Found ${mockForks.length} forks`);
    } catch (error) {
      showToast("Failed to load forks");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadForks();
  }, [repoUrl]);

  const formatDate = (timestamp: number) => {
    const daysAgo = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return `${Math.floor(daysAgo / 30)} months ago`;
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍴</span>
          <div>
            <h3 className="text-xl font-bold">Fork Analysis</h3>
            <p className="text-sm text-zinc-400">Compare original vs forks</p>
          </div>
        </div>
        <Button onClick={loadForks} disabled={isLoading} variant="secondary" size="sm">
          {isLoading ? "Loading..." : "🔄 Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Analyzing forks...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 glass rounded-lg text-center">
              <div className="text-2xl font-bold">{forks.length}</div>
              <div className="text-xs text-zinc-400">Total Forks</div>
            </div>
            <div className="p-3 glass rounded-lg text-center">
              <div className="text-2xl font-bold">
                {forks.filter((f) => f.hasChanges).length}
              </div>
              <div className="text-xs text-zinc-400">With Changes</div>
            </div>
            <div className="p-3 glass rounded-lg text-center">
              <div className="text-2xl font-bold">
                {forks.reduce((sum, f) => sum + f.stars, 0)}
              </div>
              <div className="text-xs text-zinc-400">Total Stars</div>
            </div>
          </div>

          {/* Forks List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {forks.map((fork) => (
              <motion.div
                key={fork.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedFork(fork)}
                className={`p-4 glass rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                  selectedFork?.id === fork.id ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{fork.owner}/{fork.name}</h4>
                    <p className="text-xs text-zinc-400">{fork.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-4">
                      <span>⭐ {fork.stars}</span>
                      <span>🍴 {fork.forks}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {fork.aheadBy > 0 && (
                    <span className="text-green-400">
                      ⬆️ {fork.aheadBy} commits ahead
                    </span>
                  )}
                  {fork.behindBy > 0 && (
                    <span className="text-red-400">
                      ⬇️ {fork.behindBy} commits behind
                    </span>
                  )}
                  {fork.aheadBy === 0 && fork.behindBy === 0 && (
                    <span className="text-zinc-400">In sync</span>
                  )}
                  <span className="text-zinc-500 ml-auto">
                    Updated {formatDate(fork.lastUpdated)}
                  </span>
                </div>

                {fork.hasChanges && (
                  <div className="mt-2 text-xs text-purple-400">
                    ✨ Has unique changes worth reviewing
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedFork && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4 border border-purple-500/50"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">{selectedFork.owner}/{selectedFork.name}</h4>
            <button
              onClick={() => setSelectedFork(null)}
              className="text-zinc-400 hover:text-zinc-300"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-400">Description: </span>
              <span className="text-zinc-300">{selectedFork.description}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-zinc-400">Stars: </span>
                <span className="font-semibold">{selectedFork.stars}</span>
              </div>
              <div>
                <span className="text-zinc-400">Forks: </span>
                <span className="font-semibold">{selectedFork.forks}</span>
              </div>
            </div>
            <div>
              <span className="text-zinc-400">Status: </span>
              {selectedFork.aheadBy > 0 && (
                <span className="text-green-400">
                  {selectedFork.aheadBy} commits ahead
                </span>
              )}
              {selectedFork.behindBy > 0 && (
                <span className="text-red-400">
                  , {selectedFork.behindBy} commits behind
                </span>
              )}
            </div>
            <div>
              <span className="text-zinc-400">Last Updated: </span>
              <span className="text-zinc-300">{formatDate(selectedFork.lastUpdated)}</span>
            </div>
            <Button
              onClick={() => window.open(`https://github.com/${selectedFork.owner}/${selectedFork.name}`, "_blank")}
              variant="primary"
              size="sm"
              className="mt-3"
            >
              View Fork on GitHub →
            </Button>
          </div>
        </motion.div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Fork analysis helps identify valuable contributions, popular variations, and potential merge candidates.
      </div>
    </Card>
  );
}

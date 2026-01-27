"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface PortfolioRepo {
  id: string;
  name: string;
  url: string;
  vibeScore: number;
  healthScore: number;
  size: number; // lines of code
  contributors: number;
}

export function MultiRepoPortfolio() {
  const [repos, setRepos] = useState<PortfolioRepo[]>([]);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addRepo = async () => {
    if (!newRepoUrl.trim()) {
      showToast("Please enter a repository URL");
      return;
    }

    setIsAnalyzing(true);
    showToast("Analyzing repository...");

    // In production, this would call the analyze API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const match = newRepoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
    if (match) {
      const [, owner, repo] = match;
      const newRepo: PortfolioRepo = {
        id: Date.now().toString(),
        name: `${owner}/${repo}`,
        url: newRepoUrl,
        vibeScore: Math.floor(Math.random() * 40) + 60, // 60-100
        healthScore: Math.floor(Math.random() * 40) + 60,
        size: Math.floor(Math.random() * 50000) + 10000,
        contributors: Math.floor(Math.random() * 20) + 5,
      };

      setRepos((prev) => [...prev, newRepo]);
      setNewRepoUrl("");
      showToast("Repository added to portfolio!");
    } else {
      showToast("Invalid repository URL");
    }

    setIsAnalyzing(false);
  };

  const removeRepo = (id: string) => {
    setRepos((prev) => prev.filter((r) => r.id !== id));
    showToast("Repository removed");
  };

  const portfolioStats = {
    totalRepos: repos.length,
    avgVibe: repos.length > 0 ? repos.reduce((sum, r) => sum + r.vibeScore, 0) / repos.length : 0,
    avgHealth: repos.length > 0 ? repos.reduce((sum, r) => sum + r.healthScore, 0) / repos.length : 0,
    totalSize: repos.reduce((sum, r) => sum + r.size, 0),
    totalContributors: new Set(repos.flatMap((r) => [r.name])).size,
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-xl font-bold">Multi-Repo Portfolio Analysis</h3>
            <p className="text-sm text-zinc-400">Analyze entire codebase portfolios</p>
          </div>
        </div>
      </div>

      {/* Add Repo */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newRepoUrl}
          onChange={(e) => setNewRepoUrl(e.target.value)}
          placeholder="Enter repository URL..."
          className="flex-1 px-3 py-2 glass rounded-lg border border-white/20 text-sm"
          onKeyPress={(e) => e.key === "Enter" && addRepo()}
        />
        <Button onClick={addRepo} disabled={isAnalyzing} variant="primary" size="sm">
          {isAnalyzing ? "Analyzing..." : "Add"}
        </Button>
      </div>

      {/* Portfolio Stats */}
      {repos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 glass rounded-lg text-center">
            <div className="text-lg font-bold">{portfolioStats.totalRepos}</div>
            <div className="text-xs text-zinc-400">Repos</div>
          </div>
          <div className="p-3 glass rounded-lg text-center">
            <div className="text-lg font-bold">{Math.round(portfolioStats.avgVibe)}</div>
            <div className="text-xs text-zinc-400">Avg Vibe</div>
          </div>
          <div className="p-3 glass rounded-lg text-center">
            <div className="text-lg font-bold">{Math.round(portfolioStats.avgHealth)}</div>
            <div className="text-xs text-zinc-400">Avg Health</div>
          </div>
          <div className="p-3 glass rounded-lg text-center">
            <div className="text-lg font-bold">
              {Math.round(portfolioStats.totalSize / 1000)}k
            </div>
            <div className="text-xs text-zinc-400">LOC</div>
          </div>
        </div>
      )}

      {/* Repos List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {repos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 glass rounded-lg flex items-center justify-between"
          >
            <div className="flex-1">
              <h5 className="font-semibold">{repo.name}</h5>
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                <span>Vibe: {repo.vibeScore}</span>
                <span>Health: {repo.healthScore}</span>
                <span>Size: {Math.round(repo.size / 1000)}k LOC</span>
                <span>Contributors: {repo.contributors}</span>
              </div>
            </div>
            <button
              onClick={() => removeRepo(repo.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </div>

      {repos.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2">📊</div>
          <p>Add repositories to analyze your portfolio</p>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Portfolio analysis helps organizations understand the health and status of their entire codebase across multiple repositories.
      </div>
    </Card>
  );
}

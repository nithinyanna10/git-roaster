"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

interface OrgRepo {
  name: string;
  vibeScore: number;
  pulse: number;
  busFactor: number;
  contributors: number;
  commits: number;
}

export function OrganizationDashboard() {
  const [repos, setRepos] = useState<OrgRepo[]>([]);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrgRepos = () => {
    if (!orgName.trim()) {
      showToast("Please enter an organization name");
      return;
    }

    setLoading(true);
    
    // Simulate loading org repos
    setTimeout(() => {
      const mockRepos: OrgRepo[] = [
        { name: "repo-1", vibeScore: 85, pulse: 80, busFactor: 70, contributors: 15, commits: 120 },
        { name: "repo-2", vibeScore: 72, pulse: 65, busFactor: 50, contributors: 8, commits: 85 },
        { name: "repo-3", vibeScore: 90, pulse: 95, busFactor: 85, contributors: 25, commits: 200 },
        { name: "repo-4", vibeScore: 60, pulse: 55, busFactor: 40, contributors: 5, commits: 45 },
        { name: "repo-5", vibeScore: 78, pulse: 70, busFactor: 60, contributors: 12, commits: 95 },
      ];
      
      setRepos(mockRepos);
      setLoading(false);
      showToast(`Loaded ${mockRepos.length} repositories for ${orgName}`);
    }, 1500);
  };

  const aggregateMetrics = () => {
    if (repos.length === 0) return null;

    return {
      avgVibeScore: repos.reduce((sum, r) => sum + r.vibeScore, 0) / repos.length,
      avgPulse: repos.reduce((sum, r) => sum + r.pulse, 0) / repos.length,
      avgBusFactor: repos.reduce((sum, r) => sum + r.busFactor, 0) / repos.length,
      totalContributors: new Set(repos.flatMap((r) => Array(r.contributors).fill(0).map((_, i) => `${r.name}-${i}`))).size,
      totalCommits: repos.reduce((sum, r) => sum + r.commits, 0),
      totalRepos: repos.length,
    };
  };

  const aggregated = aggregateMetrics();

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Organization Dashboard</h3>
        <p className="text-zinc-400 text-sm">Aggregate metrics across all organization repositories</p>
      </div>

      <div className="space-y-6">
        {/* Input */}
        <div className="glass rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Organization Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g., facebook, microsoft, google"
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button onClick={loadOrgRepos} variant="primary" size="sm" disabled={loading}>
                {loading ? "Loading..." : "📊 Load Repos"}
              </Button>
            </div>
          </div>
        </div>

        {/* Aggregated Metrics */}
        {aggregated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Avg Vibe Score</div>
              <div className="text-3xl font-bold">{aggregated.avgVibeScore.toFixed(1)}/100</div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Avg Pulse</div>
              <div className="text-3xl font-bold">{aggregated.avgPulse.toFixed(1)}/100</div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Avg Bus Factor</div>
              <div className="text-3xl font-bold">{aggregated.avgBusFactor.toFixed(1)}/100</div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Total Repos</div>
              <div className="text-3xl font-bold">{aggregated.totalRepos}</div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Total Contributors</div>
              <div className="text-3xl font-bold">{aggregated.totalContributors}</div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Total Commits</div>
              <div className="text-3xl font-bold">{aggregated.totalCommits}</div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        {repos.length > 0 && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-4">Repository Comparison</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={repos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="vibeScore" fill="#8b5cf6" name="Vibe Score" />
                  <Bar dataKey="pulse" fill="#ec4899" name="Pulse" />
                  <Bar dataKey="busFactor" fill="#06b6d4" name="Bus Factor" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Repository List</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {repos.map((repo, index) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold">{repo.name}</div>
                      <div className="text-sm text-zinc-400">
                        Vibe: {repo.vibeScore} | Pulse: {repo.pulse} | Bus: {repo.busFactor}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">{repo.contributors} contributors</div>
                      <div className="text-sm text-zinc-400">{repo.commits} commits</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {repos.length === 0 && !loading && (
          <div className="text-center py-12 text-zinc-400">
            <div className="text-6xl mb-4">📊</div>
            <p>Enter an organization name and click "Load Repos" to see aggregated metrics</p>
          </div>
        )}
      </div>

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> Organization dashboard requires GitHub API integration to fetch all repos from an organization.
        </p>
      </div>
    </Card>
  );
}

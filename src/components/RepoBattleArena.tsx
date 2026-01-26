"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Battle {
  id: string;
  repo1: string;
  repo2: string;
  repo1Score: number;
  repo2Score: number;
  votes: number;
  winner: string | null;
  createdAt: number;
}

export function RepoBattleArena() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [newBattle, setNewBattle] = useState({ repo1: "", repo2: "" });
  const [leaderboard, setLeaderboard] = useState<{ repo: string; wins: number; score: number }[]>([]);

  const createBattle = () => {
    if (!newBattle.repo1 || !newBattle.repo2) {
      showToast("Please enter both repositories");
      return;
    }

    const battle: Battle = {
      id: Date.now().toString(),
      repo1: newBattle.repo1,
      repo2: newBattle.repo2,
      repo1Score: Math.floor(Math.random() * 100),
      repo2Score: Math.floor(Math.random() * 100),
      votes: 0,
      winner: null,
      createdAt: Date.now(),
    };

    setBattles((prev) => [battle, ...prev]);
    setNewBattle({ repo1: "", repo2: "" });
    showToast("Battle created! Analyze both repos to see the results.");
  };

  const vote = (battleId: string, repo: "repo1" | "repo2") => {
    setBattles((prev) =>
      prev.map((battle) =>
        battle.id === battleId
          ? { ...battle, votes: battle.votes + 1, winner: repo }
          : battle
      )
    );
    showToast("Vote recorded!");
  };

  const loadLeaderboard = () => {
    // Simulate leaderboard data
    const mockLeaderboard = [
      { repo: "facebook/react", wins: 42, score: 95 },
      { repo: "vercel/next.js", wins: 38, score: 92 },
      { repo: "microsoft/vscode", wins: 35, score: 90 },
      { repo: "tensorflow/tensorflow", wins: 32, score: 88 },
      { repo: "kubernetes/kubernetes", wins: 30, score: 87 },
    ];
    setLeaderboard(mockLeaderboard);
    showToast("Leaderboard loaded!");
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Repo Battle Arena</h3>
        <p className="text-zinc-400 text-sm">Head-to-head comparisons and community battles</p>
      </div>

      <div className="space-y-6">
        {/* Create Battle */}
        <div className="glass rounded-lg p-4 space-y-4">
          <h4 className="font-bold text-lg">Create New Battle</h4>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={newBattle.repo1}
              onChange={(e) => setNewBattle({ ...newBattle, repo1: e.target.value })}
              placeholder="Repository 1 (owner/repo)"
              className="px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={newBattle.repo2}
              onChange={(e) => setNewBattle({ ...newBattle, repo2: e.target.value })}
              placeholder="Repository 2 (owner/repo)"
              className="px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button onClick={createBattle} variant="primary" size="sm" className="w-full">
            ⚔️ Create Battle
          </Button>
        </div>

        {/* Active Battles */}
        <div>
          <h4 className="font-bold text-lg mb-4">Active Battles</h4>
          {battles.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-8">No battles yet. Create one above!</p>
          ) : (
            <div className="space-y-4">
              {battles.map((battle) => (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-lg p-4 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-purple-900/20 border border-purple-700/50">
                      <div className="font-bold mb-2">{battle.repo1}</div>
                      <div className="text-3xl font-bold mb-2">{battle.repo1Score}</div>
                      <Button
                        onClick={() => vote(battle.id, "repo1")}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        ⬆️ Vote
                      </Button>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-pink-900/20 border border-pink-700/50">
                      <div className="font-bold mb-2">{battle.repo2}</div>
                      <div className="text-3xl font-bold mb-2">{battle.repo2Score}</div>
                      <Button
                        onClick={() => vote(battle.id, "repo2")}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        ⬆️ Vote
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-zinc-400">
                    {battle.votes} votes • {battle.winner ? `Winner: ${battle.winner}` : "No winner yet"}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Leaderboard</h4>
            <Button onClick={loadLeaderboard} variant="secondary" size="sm">
              🔄 Load
            </Button>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-8">Click "Load" to see top repositories</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.repo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-8">{index + 1}</div>
                    <div>
                      <div className="font-bold">{entry.repo}</div>
                      <div className="text-sm text-zinc-400">{entry.wins} wins</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{entry.score}/100</div>
                    {index === 0 && <div className="text-xs text-yellow-400">🏆 Champion</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 glass rounded-lg p-4 bg-yellow-900/20 border border-yellow-700/50">
        <p className="text-sm text-yellow-300">
          ⚠️ <strong>Note:</strong> Battle arena requires backend integration for real-time voting and leaderboard updates.
        </p>
      </div>
    </Card>
  );
}

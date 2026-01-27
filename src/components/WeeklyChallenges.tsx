"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  participants: number;
  deadline: number;
  prize?: string;
}

export function WeeklyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Roast the Most Complex Repo",
      description: "Find and roast the repository with the highest cyclomatic complexity. Bonus points for creative roasts!",
      difficulty: "medium",
      participants: 234,
      deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      prize: "Git Roaster Pro (1 month)",
    },
    {
      id: "2",
      title: "Find the Hidden Gem",
      description: "Discover a repository with amazing code quality but low stars. Share why it deserves more attention!",
      difficulty: "easy",
      participants: 567,
      deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
      prize: "Featured on homepage",
    },
    {
      id: "3",
      title: "Best Comeback Story",
      description: "Find a repo that went from 'At Risk' to 'Healthy'. Document the transformation!",
      difficulty: "hard",
      participants: 89,
      deadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days
      prize: "Git Roaster Swag Pack",
    },
  ]);

  const [participatedChallenges, setParticipatedChallenges] = useState<Set<string>>(new Set());

  const participateInChallenge = (challengeId: string) => {
    setParticipatedChallenges((prev) => new Set([...prev, challengeId]));
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, participants: c.participants + 1 } : c
      )
    );
    showToast("You've joined the challenge!");
  };

  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    const colors = {
      easy: "bg-green-500/20 text-green-300 border-green-500",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
      hard: "bg-red-500/20 text-red-300 border-red-500",
    };
    return colors[difficulty];
  };

  const formatTimeRemaining = (deadline: number) => {
    const days = Math.floor((deadline - Date.now()) / (24 * 60 * 60 * 1000));
    if (days === 0) return "Ends today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏆</span>
        <div>
          <h3 className="text-xl font-bold">Weekly Challenges</h3>
          <p className="text-sm text-zinc-400">Compete with the community</p>
        </div>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize border ${getDifficultyColor(challenge.difficulty)}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mb-2">{challenge.description}</p>
                {challenge.prize && (
                  <div className="text-xs text-purple-400 mb-2">🎁 Prize: {challenge.prize}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span>👥 {challenge.participants} participants</span>
                <span>⏰ {formatTimeRemaining(challenge.deadline)}</span>
              </div>
              <Button
                onClick={() => participateInChallenge(challenge.id)}
                disabled={participatedChallenges.has(challenge.id)}
                variant={participatedChallenges.has(challenge.id) ? "secondary" : "primary"}
                size="sm"
              >
                {participatedChallenges.has(challenge.id) ? "✓ Joined" : "Join Challenge"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-xs text-zinc-500">
        💡 Weekly challenges encourage community engagement and help discover interesting repositories. Winners are featured and receive prizes!
      </div>
    </Card>
  );
}

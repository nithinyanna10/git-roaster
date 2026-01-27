"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface FeaturedRoast {
  id: string;
  repoName: string;
  repoUrl: string;
  roast: string;
  vibeScore: number;
  author: string;
  timestamp: number;
  likes: number;
}

export function RoastOfTheDay() {
  const [featuredRoast, setFeaturedRoast] = useState<FeaturedRoast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoastOfTheDay();
  }, []);

  const loadRoastOfTheDay = async () => {
    setIsLoading(true);

    // In production, this would fetch from a backend/database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockRoast: FeaturedRoast = {
      id: "1",
      repoName: "facebook/react",
      repoUrl: "https://github.com/facebook/react",
      roast: "This repo has more stars than a Hollywood premiere, but its issue queue is longer than a CVS receipt. The vibe is immaculate, but someone needs to tell them that 'legacy' isn't a feature.",
      vibeScore: 92,
      author: "roastmaster3000",
      timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      likes: 1247,
    };

    setFeaturedRoast(mockRoast);
    setIsLoading(false);
  };

  const likeRoast = () => {
    if (featuredRoast) {
      setFeaturedRoast({ ...featuredRoast, likes: featuredRoast.likes + 1 });
      showToast("Liked!");
    }
  };

  const shareRoast = () => {
    if (featuredRoast) {
      const text = `🔥 Roast of the Day: ${featuredRoast.repoName}\n\n"${featuredRoast.roast}"\n\nVia Git Roaster`;
      navigator.clipboard.writeText(text);
      showToast("Roast copied to clipboard!");
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔥</span>
        <div>
          <h3 className="text-xl font-bold">Roast of the Day</h3>
          <p className="text-sm text-zinc-400">Featured community roasts</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Loading roast of the day...</p>
        </div>
      ) : featuredRoast ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-lg p-6 border-2 border-orange-500/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold">{featuredRoast.repoName}</h4>
                <div className="text-sm text-zinc-400">by @{featuredRoast.author}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">{featuredRoast.vibeScore}</div>
                <div className="text-xs text-zinc-400">Vibe Score</div>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-zinc-200 mb-4">"{featuredRoast.roast}"</p>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>❤️ {featuredRoast.likes} likes</span>
              <span>•</span>
              <span>{new Date(featuredRoast.timestamp).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={likeRoast} variant="primary" size="sm" className="flex-1">
              ❤️ Like ({featuredRoast.likes})
            </Button>
            <Button onClick={shareRoast} variant="secondary" size="sm" className="flex-1">
              📤 Share
            </Button>
            <Button
              onClick={() => window.open(featuredRoast.repoUrl, "_blank")}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              🔗 View Repo
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-zinc-400">
          <p>No roast of the day available</p>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Roast of the Day features the best community-submitted roasts. Submit your own roast to be featured!
      </div>
    </Card>
  );
}

"use client";

import { motion } from "framer-motion";
import { AnalysisResult } from "@/types";
import { formatDaysAgo } from "@/lib/utils";

interface RepoStoryTimelineProps {
  result: AnalysisResult;
}

export function RepoStoryTimeline({ result }: RepoStoryTimelineProps) {
  const { repo, metrics, charts } = result;

  const generateStorySummary = () => {
    const parts: string[] = [];
    
    if (metrics.commitsTrend === "increasing") {
      parts.push("This repo is gaining momentum");
    } else if (metrics.commitsTrend === "decreasing") {
      parts.push("Activity is slowing down");
    } else {
      parts.push("This repo maintains steady activity");
    }

    if (metrics.daysSinceLastCommit > 180) {
      parts.push("but has been quiet for a while");
    }

    if (metrics.releasesCount > 10) {
      parts.push("with regular releases");
    } else if (metrics.releasesCount === 0) {
      parts.push("with no releases yet");
    }

    if (metrics.uniqueContributors90Days > 5) {
      parts.push("and active collaboration");
    }

    return parts.join(", ") + ".";
  };

  const milestones = [
    {
      label: "Last Release",
      value: metrics.daysSinceLastRelease !== null 
        ? `${formatDaysAgo(metrics.daysSinceLastRelease)}`
        : "Never",
      icon: "📦",
    },
    {
      label: "Last Commit",
      value: formatDaysAgo(metrics.daysSinceLastCommit),
      icon: "💻",
    },
    {
      label: "Contributors (90d)",
      value: `${metrics.uniqueContributors90Days}`,
      icon: "👥",
    },
    {
      label: "Releases",
      value: `${metrics.releasesCount}`,
      icon: "🚀",
    },
  ];

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
      <motion.div
        className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold mb-6">The Story</h3>

        {/* Story Summary */}
        <motion.div
          className="mb-8 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg text-zinc-200 italic">"{generateStorySummary()}"</p>
        </motion.div>

        {/* Milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.label}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="text-3xl mb-2">{milestone.icon}</div>
              <div className="text-sm text-zinc-400 mb-1">{milestone.label}</div>
              <div className="text-xl font-bold text-zinc-200">{milestone.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Placeholder - will use existing Charts component */}
        {charts.commitsOverTime.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Activity Timeline</h4>
            <div className="h-48 rounded-lg bg-zinc-800/50 p-4 flex items-end justify-between gap-1">
              {charts.commitsOverTime.slice(-20).map((point, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-purple-500 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(point.count / Math.max(...charts.commitsOverTime.map(p => p.count))) * 100}%` }}
                  transition={{ delay: 0.7 + i * 0.02, duration: 0.3 }}
                  title={`${point.count} commits`}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

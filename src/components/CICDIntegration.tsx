"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Pipeline {
  id: string;
  name: string;
  status: "success" | "failed" | "running" | "pending";
  duration: number;
  lastRun: number;
  successRate: number;
}

interface CICDIntegrationProps {
  analysis: Analysis;
  repoUrl: string;
}

export function CICDIntegration({ analysis, repoUrl }: CICDIntegrationProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"github" | "gitlab" | "jenkins" | "circleci">("github");

  const loadPipelines = async () => {
    setIsLoading(true);
    showToast("Loading CI/CD pipeline data...");

    try {
      // In production, this would integrate with:
      // - GitHub Actions API
      // - GitLab CI API
      // - Jenkins API
      // - CircleCI API

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockPipelines: Pipeline[] = [
        {
          id: "1",
          name: "Build & Test",
          status: "success",
          duration: 245, // seconds
          lastRun: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          successRate: 95,
        },
        {
          id: "2",
          name: "Lint & Format",
          status: "success",
          duration: 89,
          lastRun: Date.now() - 2 * 60 * 60 * 1000,
          successRate: 98,
        },
        {
          id: "3",
          name: "Security Scan",
          status: "failed",
          duration: 312,
          lastRun: Date.now() - 3 * 60 * 60 * 1000,
          successRate: 72,
        },
        {
          id: "4",
          name: "Deploy to Staging",
          status: "success",
          duration: 456,
          lastRun: Date.now() - 4 * 60 * 60 * 1000,
          successRate: 88,
        },
        {
          id: "5",
          name: "E2E Tests",
          status: "running",
          duration: 0,
          lastRun: Date.now(),
          successRate: 85,
        },
      ];

      setPipelines(mockPipelines);
      showToast(`Loaded ${mockPipelines.length} pipelines`);
    } catch (error) {
      showToast("Failed to load pipelines");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, [repoUrl, selectedProvider]);

  const getStatusColor = (status: Pipeline["status"]) => {
    const colors = {
      success: "bg-green-500/20 text-green-300 border-green-500",
      failed: "bg-red-500/20 text-red-300 border-red-500",
      running: "bg-blue-500/20 text-blue-300 border-blue-500",
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Pipeline["status"]) => {
    const icons = {
      success: "✅",
      failed: "❌",
      running: "🔄",
      pending: "⏳",
    };
    return icons[status];
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const hoursAgo = Math.floor((Date.now() - timestamp) / (60 * 60 * 1000));
    if (hoursAgo === 0) return "Just now";
    if (hoursAgo === 1) return "1 hour ago";
    return `${hoursAgo} hours ago`;
  };

  const overallHealth = pipelines.length > 0
    ? pipelines.filter((p) => p.status === "success").length / pipelines.length
    : 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <div>
            <h3 className="text-xl font-bold">CI/CD Integration</h3>
            <p className="text-sm text-zinc-400">Analyze pipeline health</p>
          </div>
        </div>
        <Button onClick={loadPipelines} disabled={isLoading} variant="secondary" size="sm">
          {isLoading ? "Loading..." : "🔄 Refresh"}
        </Button>
      </div>

      {/* Provider Selection */}
      <div className="flex gap-2 flex-wrap">
        {(["github", "gitlab", "jenkins", "circleci"] as const).map((provider) => (
          <button
            key={provider}
            onClick={() => setSelectedProvider(provider)}
            className={`px-3 py-1 rounded-lg text-sm transition-all capitalize ${
              selectedProvider === provider
                ? "bg-purple-500 text-white"
                : "glass text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {provider === "github" ? "GitHub Actions" :
             provider === "gitlab" ? "GitLab CI" :
             provider === "jenkins" ? "Jenkins" :
             "CircleCI"}
          </button>
        ))}
      </div>

      {/* Overall Health */}
      {pipelines.length > 0 && (
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Pipeline Health</span>
            <span className={`text-lg font-bold ${
              overallHealth > 0.8 ? "text-green-400" :
              overallHealth > 0.6 ? "text-yellow-400" :
              "text-red-400"
            }`}>
              {Math.round(overallHealth * 100)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                overallHealth > 0.8 ? "bg-green-500" :
                overallHealth > 0.6 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${overallHealth * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Pipelines List */}
      {isLoading ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Loading pipelines...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pipelines.map((pipeline, index) => (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${getStatusColor(pipeline.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getStatusIcon(pipeline.status)}</span>
                  <h5 className="font-semibold">{pipeline.name}</h5>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-zinc-800 capitalize">
                  {pipeline.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span>Duration: {formatDuration(pipeline.duration)}</span>
                <span>Success Rate: {pipeline.successRate}%</span>
                <span>Last Run: {formatTimeAgo(pipeline.lastRun)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Integrate with GitHub Actions, GitLab CI, Jenkins, or CircleCI APIs to monitor your CI/CD pipeline health in real-time.
      </div>
    </Card>
  );
}

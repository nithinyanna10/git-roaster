"use client";

import { useState } from "react";
import { RepoInfo, Metrics, Scores, Claim } from "@/types";
import { formatDaysAgo } from "@/lib/utils";

interface ReceiptsProps {
  repo: RepoInfo;
  metrics: Metrics;
  scores: Scores;
  claims: Claim[];
}

export function Receipts({ repo, metrics, scores, claims }: ReceiptsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMetricValue = (key: string): any => {
    const metricsAny = metrics as any;
    const scoresAny = scores as any;
    const repoAny = repo as any;
    return metricsAny[key] ?? scoresAny[key] ?? repoAny[key] ?? "N/A";
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      if (key.includes("Days") || key.includes("Release")) {
        return `${value} ${value === 1 ? "day" : "days"}`;
      }
      if (key.includes("Pct") || key.includes("Score")) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/50"
      >
        <h3 className="text-lg font-semibold">📋 Receipts (Evidence)</h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-800 p-4 space-y-6">
          {/* Claims to Evidence Mapping */}
          <div>
            <h4 className="mb-3 font-semibold text-zinc-300">Claims & Evidence</h4>
            <div className="space-y-3">
              {claims.map((claim, idx) => (
                <div key={idx} className="rounded border border-zinc-700 bg-zinc-800/30 p-3">
                  <div className="mb-2 font-medium text-zinc-200">"{claim.text}"</div>
                  <div className="text-sm text-zinc-400">
                    <span className="font-medium">Evidence:</span>{" "}
                    {claim.evidenceKeys.length > 0 ? (
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {claim.evidenceKeys.map((key) => (
                          <li key={key}>
                            <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs">
                              {key}
                            </code>
                            : {formatValue(key, getMetricValue(key))}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-zinc-500">No specific metrics</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repo Facts */}
          <div>
            <h4 className="mb-3 font-semibold text-zinc-300">Repository Facts</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Full Name:</span>
                <span className="font-mono text-zinc-200">{repo.owner}/{repo.repo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Name:</span>
                <span className="font-mono text-zinc-200">{repo.name}</span>
              </div>
              {repo.description && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Description:</span>
                  <span className="font-mono text-zinc-200 text-right max-w-md">{repo.description}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Stars:</span>
                <span className="font-mono text-zinc-200">{repo.stars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Forks:</span>
                <span className="font-mono text-zinc-200">{repo.forks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Open Issues:</span>
                <span className="font-mono text-zinc-200">{repo.openIssues.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Default Branch:</span>
                <span className="font-mono text-zinc-200">{repo.defaultBranch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">License:</span>
                <span className="font-mono text-zinc-200">{repo.license || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Created:</span>
                <span className="font-mono text-zinc-200">{new Date(repo.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Last Updated:</span>
                <span className="font-mono text-zinc-200">{new Date(repo.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Last Pushed:</span>
                <span className="font-mono text-zinc-200">{new Date(repo.pushedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Languages ({Object.keys(repo.languages).length}):</span>
                <span className="font-mono text-zinc-200 text-right max-w-md">
                  {Object.entries(repo.languages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([lang, bytes]) => `${lang} (${(bytes / 1024).toFixed(0)}KB)`)
                    .join(", ")}
                  {Object.keys(repo.languages).length > 5 && "..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Contributors:</span>
                <span className="font-mono text-zinc-200">{repo.contributors.length}</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="mb-3 font-semibold text-zinc-300">Computed Metrics</h4>
            <div className="grid gap-2 text-sm">
              <div className="border-b border-zinc-700 pb-2 mb-2">
                <div className="font-medium text-zinc-300 mb-1">Pulse Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Days since last commit:</span>
                <span className="font-mono text-zinc-200">{metrics.daysSinceLastCommit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commits (last 7 days):</span>
                <span className="font-mono text-zinc-200">{metrics.commitsLast7Days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commits (last 30 days):</span>
                <span className="font-mono text-zinc-200">{metrics.commitsLast30Days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commits (last 90 days):</span>
                <span className="font-mono text-zinc-200">{metrics.commitsLast90Days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commit trend:</span>
                <span className="font-mono text-zinc-200 capitalize">{metrics.commitsTrend}</span>
              </div>
              
              <div className="border-b border-zinc-700 pb-2 mb-2 mt-3">
                <div className="font-medium text-zinc-300 mb-1">Bus Factor Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Top contributor:</span>
                <span className="font-mono text-zinc-200">{metrics.topContributorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Top contributor %:</span>
                <span className="font-mono text-zinc-200">{metrics.topContributorPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Unique contributors (90d):</span>
                <span className="font-mono text-zinc-200">{metrics.uniqueContributors90Days}</span>
              </div>
              
              <div className="border-b border-zinc-700 pb-2 mb-2 mt-3">
                <div className="font-medium text-zinc-300 mb-1">Churn Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Additions (last 90d):</span>
                <span className="font-mono text-zinc-200">{metrics.additionsLast90Days.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Deletions (last 90d):</span>
                <span className="font-mono text-zinc-200">{metrics.deletionsLast90Days.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total changes (90d):</span>
                <span className="font-mono text-zinc-200">{(metrics.additionsLast90Days + metrics.deletionsLast90Days).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Churn ratio (lines/commit):</span>
                <span className="font-mono text-zinc-200">{Math.round(metrics.churnRatio)}</span>
              </div>
              
              <div className="border-b border-zinc-700 pb-2 mb-2 mt-3">
                <div className="font-medium text-zinc-300 mb-1">Quality Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Has tests:</span>
                <span className="font-mono text-zinc-200">{metrics.hasTests ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Has CI/CD:</span>
                <span className="font-mono text-zinc-200">{metrics.hasCI ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Has documentation:</span>
                <span className="font-mono text-zinc-200">{metrics.hasDocs ? "Yes" : "No"}</span>
              </div>
              {metrics.hasDocs && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">README length:</span>
                  <span className="font-mono text-zinc-200">{metrics.readmeLength.toLocaleString()} chars</span>
                </div>
              )}
              
              <div className="border-b border-zinc-700 pb-2 mb-2 mt-3">
                <div className="font-medium text-zinc-300 mb-1">Release Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total releases:</span>
                <span className="font-mono text-zinc-200">{metrics.releasesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Days since last release:</span>
                <span className="font-mono text-zinc-200">
                  {metrics.daysSinceLastRelease !== null ? metrics.daysSinceLastRelease : "Never"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Release frequency:</span>
                <span className="font-mono text-zinc-200">{metrics.releaseFrequency.toFixed(2)} per month</span>
              </div>
              
              <div className="border-b border-zinc-700 pb-2 mb-2 mt-3">
                <div className="font-medium text-zinc-300 mb-1">Complexity Metrics</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Language count:</span>
                <span className="font-mono text-zinc-200">{metrics.languageCount}</span>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div>
            <h4 className="mb-3 font-semibold text-zinc-300">Scores (Weighted Average)</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Pulse (25%):</span>
                <span className="font-mono text-zinc-200">{scores.pulse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Stability (20%):</span>
                <span className="font-mono text-zinc-200">{scores.stability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bus Factor (15%):</span>
                <span className="font-mono text-zinc-200">{scores.busFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tests (15%):</span>
                <span className="font-mono text-zinc-200">{scores.tests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Releases (15%):</span>
                <span className="font-mono text-zinc-200">{scores.releases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Docs (10%):</span>
                <span className="font-mono text-zinc-200">{scores.docs}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-zinc-700 pt-2">
                <span className="font-semibold text-zinc-300">Vibe Score:</span>
                <span className="font-mono text-lg font-bold text-zinc-100">{scores.vibe}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/types";
import { parseGitHubUrl, generateShareLink } from "@/lib/utils";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Charts } from "@/components/Charts";
import { Receipts } from "@/components/Receipts";

const LOADING_MESSAGES = [
  "Counting regrets per commit...",
  "Analyzing commit messages for typos...",
  "Measuring the bus factor...",
  "Checking if tests exist (fingers crossed)...",
  "Calculating churn like a washing machine...",
  "Roasting in progress...",
];

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [mode, setMode] = useState<"roast" | "praise">("roast");
  const [useLLM, setUseLLM] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Check for repo in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setRepoUrl(repoParam.includes("/") ? `https://github.com/${repoParam}` : repoParam);
    }
  }, []);

  // Rotate loading messages
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      setError("Invalid GitHub URL. Please provide a valid repository URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
          mode,
          useLLM,
          githubToken: githubToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const link = generateShareLink(result.repo.owner, result.repo.repo);
    navigator.clipboard.writeText(link);
    alert("Share link copied to clipboard!");
  };

  const handleCopyNarrative = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.narrative.text);
    alert("Narrative copied to clipboard!");
  };

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.repo.owner}-${result.repo.repo}-analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
            Git Roaster
          </h1>
          <p className="text-zinc-400">
            A playful, data-driven analysis of your GitHub repositories
          </p>
        </header>

        {/* Main Card */}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6 shadow-2xl backdrop-blur-sm">
            {/* Input Section */}
            <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="repo-url" className="mb-2 block text-sm font-medium text-zinc-300">
                  GitHub Repository URL
                </label>
                <input
                  id="repo-url"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Mode:</span>
                  <button
                    onClick={() => setMode("roast")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      mode === "roast"
                        ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/50"
                        : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    🔥 Roast
                  </button>
                  <button
                    onClick={() => setMode("praise")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      mode === "praise"
                        ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/50"
                        : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    ✨ Praise
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useLLM}
                      onChange={(e) => setUseLLM(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-zinc-400">
                      Spicy AI (Ollama)
                    </span>
                    <span
                      className="text-xs text-zinc-500"
                      title="Uses your local Ollama instance for more creative roasts"
                    >
                      ⓘ
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-sm text-zinc-400 hover:text-zinc-300"
                >
                  {showTokenInput ? "Hide" : "Add"} GitHub Token
                </button>
              </div>

              {showTokenInput && (
                <div>
                  <label htmlFor="github-token" className="mb-2 block text-sm font-medium text-zinc-300">
                    GitHub Token (optional, for private repos or higher rate limits)
                  </label>
                  <input
                    id="github-token"
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_..."
                    className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? loadingMessage : mode === "roast" ? "🔥 Roast it!" : "✨ Praise it!"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Narrative */}
                <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {mode === "roast" ? "🔥 The Roast" : "✨ The Praise"}
                    </h2>
                    {result.cached && (
                      <span className="text-xs text-zinc-500">(cached)</span>
                    )}
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{result.narrative.text}</p>
                </div>

                {/* Scorecards */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Scorecard</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <ScoreBadge
                      label="Pulse"
                      score={result.scores.pulse}
                      description="Activity and recency of commits"
                    />
                    <ScoreBadge
                      label="Stability"
                      score={result.scores.stability}
                      description="Code churn and stability"
                    />
                    <ScoreBadge
                      label="Bus Factor"
                      score={result.scores.busFactor}
                      description="Distribution of contributions"
                    />
                    <ScoreBadge
                      label="Tests"
                      score={result.scores.tests}
                      description="Test coverage and CI/CD"
                    />
                    <ScoreBadge
                      label="Releases"
                      score={result.scores.releases}
                      description="Release frequency and recency"
                    />
                    <ScoreBadge
                      label="Docs"
                      score={result.scores.docs}
                      description="Documentation quality"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="inline-block rounded-lg border border-purple-500/30 bg-purple-500/10 px-6 py-3">
                      <div className="text-sm text-zinc-400">Vibe Score</div>
                      <div className="text-4xl font-bold text-purple-400">{result.scores.vibe}</div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                {result.charts.commitsOverTime.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Trends</h3>
                    <Charts
                      commitsOverTime={result.charts.commitsOverTime}
                      churnOverTime={result.charts.churnOverTime}
                    />
                  </div>
                )}

                {/* Receipts */}
                <Receipts
                  repo={result.repo}
                  metrics={result.metrics}
                  scores={result.scores}
                  claims={result.narrative.claims}
                />

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleShare}
                    className="rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
                  >
                    📋 Copy Share Link
                  </button>
                  <button
                    onClick={handleCopyNarrative}
                    className="rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
                  >
                    📝 Copy Narrative
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
                  >
                    💾 Export JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-zinc-500">
          <p>Git Roaster - Because every repo deserves honest feedback</p>
          <p className="mt-2 text-xs">
            All roasts are fact-based and grounded in actual repository metrics.
          </p>
        </footer>
      </div>
    </div>
  );
}

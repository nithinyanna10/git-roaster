"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/types";
import { parseGitHubUrl, generateShareLink } from "@/lib/utils";
import { ThemeMode, themes } from "@/lib/theme";
import { DynamicBackground } from "@/components/ui/roaster/DynamicBackground";
import { RoastReactorHero } from "@/components/ui/roaster/RoastReactorHero";
import { RepoInputConsole } from "@/components/ui/roaster/RepoInputConsole";
import { RevealLoader } from "@/components/ui/roaster/RevealLoader";
import { RoastNarrativeCard } from "@/components/ui/roaster/RoastNarrativeCard";
import { VibeMeter } from "@/components/ui/roaster/VibeMeter";
import { BadgeGrid } from "@/components/ui/roaster/BadgeGrid";
import { RepoStoryTimeline } from "@/components/ui/roaster/RepoStoryTimeline";
import { ReceiptsCaseFile } from "@/components/ui/roaster/ReceiptsCaseFile";
import { RoastLabPanel } from "@/components/ui/roaster/RoastLabPanel";
import { ShareCardGenerator } from "@/components/ui/roaster/ShareCardGenerator";
import { Charts } from "@/components/Charts";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [mode, setMode] = useState<"roast" | "praise">("roast");
  const [useLLM, setUseLLM] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("nebula");
  const [intensity, setIntensity] = useState<"mild" | "medium" | "savage">("medium");

  // Check for repo in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setRepoUrl(repoParam.includes("/") ? `https://github.com/${repoParam}` : repoParam);
    }
  }, []);

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

  const handleShareCard = () => {
    // Share card generation is handled in ShareCardGenerator component
  };

  const currentTheme = themes[theme];
  const vibeScore = result?.scores.vibe;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: currentTheme.colors.background,
        color: currentTheme.colors.text,
      }}
    >
      {/* Dynamic Background */}
      <DynamicBackground theme={theme} vibeScore={vibeScore} isAnalyzing={loading} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        {!result && <RoastReactorHero />}

        {/* Input Section */}
        {!result && (
          <>
            <RepoInputConsole
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              mode={mode}
              setMode={setMode}
              onAnalyze={handleAnalyze}
              loading={loading}
              showTokenInput={showTokenInput}
              setShowTokenInput={setShowTokenInput}
              githubToken={githubToken}
              setGithubToken={setGithubToken}
            />

            {/* Roast Lab */}
            <RoastLabPanel
              theme={theme}
              setTheme={setTheme}
              useLLM={useLLM}
              setUseLLM={setUseLLM}
              intensity={intensity}
              setIntensity={setIntensity}
            />
          </>
        )}

        {/* Loading State */}
        {loading && <RevealLoader />}

        {/* Error State */}
        {error && (
          <div className="relative z-10 max-w-2xl mx-auto px-4 mt-8">
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-red-400">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="py-8 space-y-8">
            {/* Narrative Card */}
            <RoastNarrativeCard
              narrative={result.narrative}
              mode={mode}
              onCopy={handleCopyNarrative}
              onShare={handleShareCard}
            />

            {/* Vibe Meter */}
            <VibeMeter scores={result.scores} />

            {/* Badge Grid */}
            <BadgeGrid scores={result.scores} />

            {/* Charts */}
            {result.charts.commitsOverTime.length > 0 && (
              <div className="relative z-10 max-w-6xl mx-auto px-4">
                <Charts
                  commitsOverTime={result.charts.commitsOverTime}
                  churnOverTime={result.charts.churnOverTime}
                />
              </div>
            )}

            {/* Repo Story Timeline */}
            <RepoStoryTimeline result={result} />

            {/* Receipts Case File */}
            <ReceiptsCaseFile
              repo={result.repo}
              metrics={result.metrics}
              scores={result.scores}
              claims={result.narrative.claims}
            />

            {/* Share Card Generator */}
            <ShareCardGenerator result={result} mode={mode} />

            {/* Action Buttons */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
                >
                  📋 Copy Share Link
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="px-6 py-3 rounded-lg border border-purple-600 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
                >
                  🔄 Analyze Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!result && (
          <footer className="relative z-10 text-center py-12 px-4">
            <p className="text-sm text-zinc-500">
              Git Roaster - Because every repo deserves honest feedback
            </p>
            <p className="text-xs text-zinc-600 mt-2">
              All roasts are fact-based and grounded in actual repository metrics.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

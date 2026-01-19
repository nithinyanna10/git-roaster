"use client";

import { useState, useEffect } from "react";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { BackgroundCosmos } from "@/components/BackgroundCosmos";
import { HeroIgnition } from "@/components/HeroIgnition";
import { ScanSequence } from "@/components/ScanSequence";
import { RevealCard } from "@/components/RevealCard";
import { RepoMRI } from "@/components/RepoMRI";
import { ScrubToReplay } from "@/components/ScrubToReplay";
import { BentoDashboard } from "@/components/BentoDashboard";
import { MomentumStrip } from "@/components/MomentumStrip";
import { ReceiptsEvidenceRoom } from "@/components/ReceiptsEvidenceRoom";
import { PosterStudio } from "@/components/PosterStudio";
import { RightToolbar } from "@/components/RightToolbar";
import { CursorModes } from "@/components/CursorModes";
import { Toasts } from "@/components/Toasts";
import { remixNarrative } from "@/lib/narrative";

export default function Home() {
  const { mode, liveGithub, token } = useAppStore();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "1") useAppStore.getState().setMode("roast");
      if (e.key === "2") useAppStore.getState().setMode("praise");
      if (e.key === "3") useAppStore.getState().setMode("audit");
      if (e.key === "4") useAppStore.getState().setMode("investor");
      if (e.key === "i" || e.key === "I") {
        const current = useAppStore.getState().cursorMode;
        useAppStore.getState().setCursorMode(current === "inspector" ? "normal" : "inspector");
      }
      if (e.key === "a" || e.key === "A") {
        const current = useAppStore.getState().cursorMode;
        useAppStore.getState().setCursorMode(current === "arcade" ? "normal" : "arcade");
      }
      if (e.key === "r" || e.key === "R") {
        if (analysis) handleRemix();
      }
      if (e.key === "p" || e.key === "P") {
        if (analysis) setShowPoster(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [analysis]);

  // URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setRepoUrl(repoParam.includes("/") ? `https://github.com/${repoParam}` : repoParam);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repoUrl,
          mode,
          timeWindowDays: 90,
          liveGithub,
          token: token || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemix = () => {
    if (!analysis) return;
    const remixed = remixNarrative(
      analysis.narrative,
      analysis.metrics,
      analysis.scores,
      analysis.verdicts,
      analysis.claims,
      analysis.repo.fullName
    );
    setAnalysis({ ...analysis, narrative: remixed });
  };

  return (
    <main className="relative min-h-screen">
      <BackgroundCosmos />
      <CursorModes />
      <Toasts />
      <RightToolbar />

      {/* Cursor Mode Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass rounded-lg px-4 py-2 flex items-center gap-4">
        <span className="text-xs text-zinc-400">Cursor:</span>
        {(["normal", "inspector", "arcade"] as const).map((m) => (
          <button
            key={m}
            onClick={() => useAppStore.getState().setCursorMode(m)}
            className={`text-xs px-3 py-1 rounded transition-all ${
              useAppStore.getState().cursorMode === m
                ? "bg-purple-600 text-white"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="scroll-snap">
        {/* Hero */}
        <HeroIgnition
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {/* Scan */}
        {loading && <ScanSequence isActive={loading} />}

        {/* Error */}
        {error && (
          <section className="min-h-screen flex items-center justify-center px-4 snap-start">
            <div className="max-w-2xl w-full text-center glass rounded-2xl p-8">
              <div className="text-4xl mb-4">😕</div>
              <h2 className="text-2xl font-bold mb-2">Repo not found</h2>
              <p className="text-zinc-400 mb-4">The roast can't locate its victim. {error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setAnalysis(null);
                }}
                className="px-6 py-3 rounded-lg glass border border-white/20 hover:bg-white/10"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Results */}
        {analysis && (
          <>
            <RevealCard
              analysis={analysis}
              onRemix={handleRemix}
              onGeneratePoster={() => setShowPoster(true)}
            />
            <RepoMRI analysis={analysis} />
            <ScrubToReplay analysis={analysis} />
            <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
              <div className="max-w-7xl w-full">
                <MomentumStrip analysis={analysis} />
                <BentoDashboard analysis={analysis} />
              </div>
            </section>
            <ReceiptsEvidenceRoom analysis={analysis} />
          </>
        )}
      </div>

      {analysis && (
        <PosterStudio
          analysis={analysis}
          isOpen={showPoster}
          onClose={() => setShowPoster(false)}
        />
      )}
    </main>
  );
}

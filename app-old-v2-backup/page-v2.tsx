"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/types";
import { parseGitHubUrl } from "@/lib/utils";
import { ThemeProvider } from "@/components/roaster-v2/ThemeProvider";
import { HeroIgnition } from "@/components/roaster-v2/HeroIgnition";
import { ScanSequence } from "@/components/roaster-v2/ScanSequence";
import { RevealStage } from "@/components/roaster-v2/RevealStage";
import { ReceiptsCaseFile } from "@/components/roaster-v2/ReceiptsCaseFile";
import { ShareCardStudio } from "@/components/roaster-v2/ShareCardStudio";
import { RoastLabPanel } from "@/components/roaster-v2/RoastLabPanel";

export default function HomeV2() {
  const [repoUrl, setRepoUrl] = useState("");
  const [mode, setMode] = useState<"roast" | "praise">("roast");
  const [useLLM, setUseLLM] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [intensity, setIntensity] = useState<"mild" | "medium" | "savage">("medium");
  const [scanComplete, setScanComplete] = useState(false);

  // Check for repo in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setRepoUrl(repoParam.includes("/") ? `https://github.com/${repoParam}` : repoParam);
    }
  }, []);

  // Konami code easter egg
  useEffect(() => {
    let konamiCode = "";
    const konamiSequence = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiCode += e.key;
      if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
      }
      if (konamiCode === konamiSequence) {
        // Switch to arcade mode for 10 seconds
        const event = new CustomEvent("konami-activated");
        window.dispatchEvent(event);
        setTimeout(() => {
          const event2 = new CustomEvent("konami-deactivated");
          window.dispatchEvent(event2);
        }, 10000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    setScanComplete(false);

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

      // Wait for scan sequence to complete
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 3500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleCopyNarrative = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.narrative.text);
    alert("Narrative copied to clipboard!");
  };

  const handleShareCard = () => {
    // Handled in ShareCardStudio
  };

  return (
    <ThemeProvider>
      <div className="scroll-snap">
        {/* Chapter 1: Ignition */}
        <HeroIgnition
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          onAnalyze={handleAnalyze}
          previewMetrics={result?.metrics}
          previewScores={result?.scores}
        />

        {/* Chapter 2: Scan */}
        {loading && (
          <ScanSequence
            isActive={loading}
            onComplete={() => setScanComplete(true)}
          />
        )}

        {/* Error State */}
        {error && (
          <section className="min-h-screen flex items-center justify-center px-4 snap-start">
            <div className="max-w-2xl w-full text-center">
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-8">
                <div className="text-4xl mb-4">😕</div>
                <h2 className="text-2xl font-bold mb-2">Repo not found</h2>
                <p className="text-zinc-400 mb-4">
                  The roast can't locate its victim. {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Chapter 3: Reveal */}
        {result && (
          <>
            <RevealStage
              result={result}
              mode={mode}
              onCopy={handleCopyNarrative}
              onShare={handleShareCard}
            />

            {/* Chapter 4: Receipts */}
            <ReceiptsCaseFile
              repo={result.repo}
              metrics={result.metrics}
              scores={result.scores}
              claims={result.narrative.claims}
            />

            {/* Share Card Studio */}
            <ShareCardStudio result={result} mode={mode} />
          </>
        )}

        {/* Roast Lab Panel */}
        <RoastLabPanel
          mode={mode}
          setMode={setMode}
          useLLM={useLLM}
          setUseLLM={setUseLLM}
          intensity={intensity}
          setIntensity={setIntensity}
        />
      </div>
    </ThemeProvider>
  );
}

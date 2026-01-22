"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { showToast } from "./Toasts";
import { ExportMenu } from "./ExportMenu";
import { remixNarrative } from "@/lib/narrative";

interface RevealCardProps {
  analysis: Analysis;
  onRemix: () => void;
  onGeneratePoster: () => void;
}

export function RevealCard({ analysis, onRemix, onGeneratePoster }: RevealCardProps) {
  const { mode, setSelectedClaimId } = useAppStore();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < analysis.narrative.textWithCitations.length) {
        setDisplayText(analysis.narrative.textWithCitations.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [analysis.narrative.textWithCitations]);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.narrative.textWithCitations);
    showToast("Copied to clipboard!");
  };

  const handleCitationClick = (evidenceKey: string) => {
    setSelectedClaimId(analysis.claims.find((c) => c.evidenceKeys.includes(evidenceKey))?.id || null);
    // Scroll to receipts section
    setTimeout(() => {
      const receiptsSection = document.getElementById("receipts-section");
      receiptsSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const modeConfig = {
    roast: { color: "from-orange-600 to-red-600", title: "The Roast", emoji: "🔥" },
    praise: { color: "from-purple-600 to-pink-600", title: "The Praise", emoji: "✨" },
    audit: { color: "from-blue-600 to-cyan-600", title: "Audit Summary", emoji: "🧾" },
    investor: { color: "from-teal-600 to-emerald-600", title: "Investor Snapshot", emoji: "📈" },
  };

  const config = modeConfig[mode];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Card>
          {/* Header Gradient Bar */}
          <div className={`h-2 rounded-t-2xl bg-gradient-to-r ${config.color} -m-6 mb-6`} />

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.emoji}</span>
              <h2 className="text-3xl font-bold">{config.title}</h2>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-400 mb-1">{analysis.repo.fullName}</div>
              <Badge variant="default">{analysis.verdicts.personaBadge}</Badge>
            </div>
          </div>

          {/* Narrative with Citations */}
          <div className="mb-6 min-h-[120px]">
            <p className="text-lg md:text-xl text-zinc-200 leading-relaxed">
              {displayText.split(/(\[\d+\])/).map((part, i) => {
                if (part.match(/\[\d+\]/)) {
                  const citation = analysis.narrative.citations.find((c) => c.marker === part);
                  if (citation) {
                    return (
                      <button
                        key={i}
                        onClick={() => handleCitationClick(citation.evidenceKey)}
                        className="text-purple-400 hover:text-purple-300 underline font-mono text-sm"
                      >
                        {part}
                      </button>
                    );
                  }
                }
                return <span key={i}>{part}</span>;
              })}
              {isTyping && (
                <motion.span
                  className="inline-block w-1 h-5 ml-1 bg-purple-500"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </p>
          </div>

          {/* Vibe Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Vibe Score</span>
              <span className="text-2xl font-bold">{analysis.scores.vibeTotal}/100</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${analysis.scores.vibeTotal}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} variant="secondary" size="sm">
              📋 Copy
            </Button>
            <Button onClick={onRemix} variant="secondary" size="sm">
              🔄 Remix
            </Button>
            <Button onClick={onGeneratePoster} variant="primary" size="sm">
              🎴 Generate Poster
            </Button>
            <Button
              onClick={() => {
                const { addBookmark, bookmarkedRepos } = useAppStore.getState();
                const repoUrl = `https://github.com/${analysis.repo.fullName}`;
                const isBookmarked = bookmarkedRepos.some(b => b.repoUrl === repoUrl || b.repoUrl === analysis.repo.fullName);
                if (isBookmarked) {
                  showToast("Already bookmarked!");
                } else {
                  addBookmark({
                    repoUrl,
                    repoName: analysis.repo.fullName,
                    timestamp: Date.now(),
                    analysis,
                  });
                  showToast("Bookmarked!");
                }
              }}
              variant="secondary"
              size="sm"
            >
              ⭐ Bookmark
            </Button>
            <Button
              onClick={() => {
                const { addComparingRepo, comparingRepos } = useAppStore.getState();
                const repoUrl = `https://github.com/${analysis.repo.fullName}`;
                if (comparingRepos.includes(repoUrl) || comparingRepos.includes(analysis.repo.fullName)) {
                  showToast("Already in comparison!");
                } else if (comparingRepos.length >= 4) {
                  showToast("Max 4 repos for comparison!");
                } else {
                  addComparingRepo(repoUrl);
                  showToast("Added to comparison! Analyze more repos to compare.");
                }
              }}
              variant="secondary"
              size="sm"
            >
              🔀 Compare
            </Button>
            <Button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("repo", analysis.repo.fullName);
                url.searchParams.set("mode", mode);
                navigator.clipboard.writeText(url.toString());
                showToast("Share link copied!");
              }}
              variant="secondary"
              size="sm"
            >
              🔗 Share
            </Button>
            <ExportMenu analysis={analysis} mode={mode} />
            {mode === "investor" && (
              <Button onClick={handleCopy} variant="secondary" size="sm">
                📄 Copy Memo
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

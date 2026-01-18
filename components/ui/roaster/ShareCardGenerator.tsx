"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types";

interface ShareCardGeneratorProps {
  result: AnalysisResult;
  mode: "roast" | "praise";
}

export function ShareCardGenerator({ result, mode }: ShareCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#18181b",
        scale: 2,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `git-roaster-${result.repo.owner}-${result.repo.repo}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Failed to generate share card. Please try again.");
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#18181b",
        scale: 2,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          alert("Share card copied to clipboard!");
        }
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy share card. Please try again.");
    }
  };

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 mb-8">
      <motion.div
        className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold mb-4">Share Card</h3>

        {/* Share Card Preview */}
        <div
          ref={cardRef}
          className="bg-zinc-900 rounded-xl p-8 mb-4 border border-zinc-700"
          style={{ width: "600px", maxWidth: "100%" }}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{mode === "roast" ? "🔥" : "✨"}</div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">
              {result.repo.owner}/{result.repo.repo}
            </h2>
            <div className="text-6xl font-black text-purple-400 mb-2">
              {result.scores.vibe}
            </div>
            <div className="text-sm text-zinc-400">Vibe Score</div>
          </div>

          <div className="border-t border-zinc-700 pt-6 mb-6">
            <p className="text-lg text-zinc-200 mb-4 line-clamp-3">
              {result.narrative.text}
            </p>
          </div>

          <div className="flex justify-center gap-4 text-xs text-zinc-500">
            <div>💓 {result.scores.pulse}</div>
            <div>🧱 {result.scores.stability}</div>
            <div>🚌 {result.scores.busFactor}</div>
            <div>🧪 {result.scores.tests}</div>
            <div>📦 {result.scores.releases}</div>
            <div>📚 {result.scores.docs}</div>
          </div>

          <div className="text-center mt-6 text-xs text-zinc-600">
            Git Roaster
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleDownload}
            className="flex-1 px-6 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 Download
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="flex-1 px-6 py-3 rounded-lg border border-purple-600 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Copy Image
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types";
import { useTheme } from "./ThemeProvider";

interface ShareCardStudioProps {
  result: AnalysisResult;
  mode: "roast" | "praise";
}

export function ShareCardStudio({ result, mode }: ShareCardStudioProps) {
  const { config } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<"minimal" | "detailed" | "viral">("minimal");

  const handleDownload = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: config.effects.borders === "bold" ? "#ffffff" : "#18181b",
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
        backgroundColor: config.effects.borders === "bold" ? "#ffffff" : "#18181b",
        scale: 2,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          alert("Share card copied to clipboard!");
        }
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy share card. Please try again.");
    }
  };

  const topClaims = result.narrative.claims.slice(0, 3);

  return (
    <section className="min-h-screen py-20 px-4 snap-start">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Share Card Studio</h2>

        {/* Template Selector */}
        <div className="flex gap-2 mb-6">
          {(["minimal", "detailed", "viral"] as const).map((template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedTemplate === template
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400"
              }`}
            >
              {template.charAt(0).toUpperCase() + template.slice(1)}
            </button>
          ))}
        </div>

        {/* Share Card Preview */}
        <div
          ref={cardRef}
          className={`mb-6 rounded-xl p-8 ${
            config.effects.borders === "bold"
              ? "bg-white border-4 border-black"
              : "bg-zinc-900 border border-zinc-700"
          }`}
          style={{ width: "600px", maxWidth: "100%" }}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{mode === "roast" ? "🔥" : "✨"}</div>
            <h3 className="text-3xl font-bold mb-2" style={{ color: config.colors.text }}>
              {result.repo.owner}/{result.repo.repo}
            </h3>
            <div
              className="text-6xl font-black mb-2"
              style={{ color: config.colors.primary }}
            >
              {result.scores.vibe}
            </div>
            <div className="text-sm" style={{ color: config.colors.textMuted }}>
              Vibe Score
            </div>
          </div>

          <div className="border-t border-zinc-700 pt-6 mb-6">
            {selectedTemplate === "minimal" ? (
              <p className="text-lg mb-4" style={{ color: config.colors.text }}>
                {result.narrative.text.slice(0, 150)}...
              </p>
            ) : (
              <div className="space-y-2">
                {topClaims.map((claim, i) => (
                  <p key={i} className="text-sm" style={{ color: config.colors.text }}>
                    • {claim.text}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 text-xs" style={{ color: config.colors.textMuted }}>
            <div>💓 {result.scores.pulse}</div>
            <div>🧱 {result.scores.stability}</div>
            <div>🚌 {result.scores.busFactor}</div>
            <div>🧪 {result.scores.tests}</div>
            <div>📦 {result.scores.releases}</div>
            <div>📚 {result.scores.docs}</div>
          </div>

          <div className="text-center mt-6 text-xs" style={{ color: config.colors.textMuted }}>
            Git Roaster
          </div>
        </div>

        {/* Actions */}
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
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

const TEMPLATES = [
  { id: "minimal", label: "Minimal", preview: "🎨" },
  { id: "bold-neon", label: "Bold Neon", preview: "💥" },
  { id: "investor-memo", label: "Investor Memo", preview: "📊" },
  { id: "meme", label: "Meme", preview: "😂" },
  { id: "dark-glass", label: "Dark Glass", preview: "🌙" },
];

interface PosterStudioProps {
  analysis: Analysis | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PosterStudio({ analysis, isOpen, onClose }: PosterStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [includeReceipts, setIncludeReceipts] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!analysis) return null;

  const handleDownload = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `git-roaster-${analysis.repo.fullName}.png`;
      link.href = dataUrl;
      link.click();
      showToast("Poster downloaded!");
    } catch (error) {
      console.error("Failed to generate image:", error);
      showToast("Failed to generate poster", "error");
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(cardRef.current, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
      });
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        showToast("Poster copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy poster", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Poster Studio">
      <div className="space-y-6">
        {/* Template Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <div className="flex gap-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedTemplate === template.id
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                {template.preview} {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Toggle
            checked={includeReceipts}
            onChange={setIncludeReceipts}
            label="Include receipts"
          />
          <Toggle
            checked={showWatermark}
            onChange={setShowWatermark}
            label="Show watermark"
          />
        </div>

        {/* Preview */}
        <div
          ref={cardRef}
          className="bg-zinc-900 rounded-xl p-8 border border-zinc-700"
          style={{ width: "600px", maxWidth: "100%" }}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{analysis.narrative.mode === "roast" ? "🔥" : "✨"}</div>
            <h3 className="text-3xl font-bold mb-2">{analysis.repo.fullName}</h3>
            <div className="text-6xl font-black text-purple-400 mb-2">
              {analysis.scores.vibeTotal}
            </div>
            <div className="text-sm text-zinc-400">Vibe Score</div>
          </div>

          <div className="border-t border-zinc-700 pt-6 mb-6">
            <p className="text-lg text-zinc-200 mb-4 line-clamp-3">
              {analysis.narrative.textWithCitations.split(/(\[\d+\])/).slice(0, 6).join("")}...
            </p>
          </div>

          {includeReceipts && (
            <div className="flex justify-center gap-4 text-xs text-zinc-500 mb-6">
              <div>💓 {analysis.scores.pulse}</div>
              <div>🧱 {analysis.scores.churn}</div>
              <div>🚌 {analysis.scores.busFactor}</div>
            </div>
          )}

          {showWatermark && (
            <div className="text-center text-xs text-zinc-600">Git Roaster</div>
          )}

          {/* QR-like element */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-24 bg-zinc-800 border-2 border-zinc-700 rounded-lg flex items-center justify-center">
              <div className="text-xs text-zinc-500 font-mono">QR</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleDownload} variant="primary" className="flex-1">
            💾 Download
          </Button>
          <Button onClick={handleCopy} variant="secondary" className="flex-1">
            📋 Copy Image
          </Button>
        </div>
      </div>
    </Modal>
  );
}

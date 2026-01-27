"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface ComicPanel {
  id: number;
  image: string; // Emoji or icon representing the scene
  text: string;
  character: string;
}

interface ComicStripModeProps {
  analysis: Analysis;
}

export function ComicStripMode({ analysis }: ComicStripModeProps) {
  const [currentPanel, setCurrentPanel] = useState(0);

  const generateComicStrip = (): ComicPanel[] => {
    const vibe = analysis.scores.vibe;
    const health = analysis.scores.health;
    const repoName = analysis.repo.fullName;

    const panels: ComicPanel[] = [
      {
        id: 1,
        image: "🏛️",
        text: `Once upon a time, there was a repository called "${repoName.split("/")[1]}"...`,
        character: "Narrator",
      },
      {
        id: 2,
        image: health > 70 ? "💪" : health < 40 ? "😰" : "🤔",
        text: health > 70 
          ? "It was a healthy, thriving codebase!"
          : health < 40
          ? "But it was struggling... health was declining!"
          : "It was... okay. Could be better.",
        character: "Repo Health",
      },
      {
        id: 3,
        image: vibe > 70 ? "✨" : vibe < 40 ? "💀" : "😐",
        text: vibe > 70
          ? "The vibe was immaculate! Developers loved working on it."
          : vibe < 40
          ? "The vibe was... concerning. Something felt off."
          : "The vibe was neutral. Not great, not terrible.",
        character: "Vibe Checker",
      },
      {
        id: 4,
        image: analysis.scores.busFactor > 70 ? "👥" : "🚌",
        text: analysis.scores.busFactor > 70
          ? "Many contributors shared the load. No single point of failure!"
          : "Only a few people knew how it worked. Risky!",
        character: "Bus Factor",
      },
      {
        id: 5,
        image: analysis.scores.churn > 60 ? "🔄" : "📌",
        text: analysis.scores.churn > 60
          ? "Code changed constantly. Always evolving!"
          : "Code was stable. Rarely changed.",
        character: "Churn Meter",
      },
      {
        id: 6,
        image: analysis.verdicts.opsHealth === "Healthy" ? "🎉" : analysis.verdicts.opsHealth === "At Risk" ? "⚠️" : "💀",
        text: analysis.verdicts.opsHealth === "Healthy"
          ? "And they lived happily ever after... for now!"
          : analysis.verdicts.opsHealth === "At Risk"
          ? "The future was uncertain. Changes were needed!"
          : "The end was near. Major intervention required!",
        character: "Final Verdict",
      },
    ];

    return panels;
  };

  const panels = generateComicStrip();

  const nextPanel = () => {
    if (currentPanel < panels.length - 1) {
      setCurrentPanel(currentPanel + 1);
    }
  };

  const prevPanel = () => {
    if (currentPanel > 0) {
      setCurrentPanel(currentPanel - 1);
    }
  };

  const downloadComic = () => {
    showToast("Comic strip download (integrate canvas/image generation)");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📰</span>
          <div>
            <h3 className="text-xl font-bold">Comic Strip Mode</h3>
            <p className="text-sm text-zinc-400">Visual story format</p>
          </div>
        </div>
        <Button onClick={downloadComic} variant="secondary" size="sm">
          📥 Download
        </Button>
      </div>

      <div className="glass rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPanel}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md text-center space-y-4"
          >
            <div className="text-8xl mb-4">{panels[currentPanel].image}</div>
            <div className="glass rounded-lg p-4 border-2 border-white/20">
              <div className="text-sm text-zinc-400 mb-2">{panels[currentPanel].character}</div>
              <div className="text-lg font-medium leading-relaxed">{panels[currentPanel].text}</div>
            </div>
            <div className="text-xs text-zinc-500">
              Panel {currentPanel + 1} of {panels.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={prevPanel}
          disabled={currentPanel === 0}
          variant="secondary"
          size="sm"
        >
          ← Previous
        </Button>
        <div className="flex gap-1">
          {panels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPanel(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPanel ? "bg-purple-500 w-6" : "bg-zinc-600"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={nextPanel}
          disabled={currentPanel === panels.length - 1}
          variant="secondary"
          size="sm"
        >
          Next →
        </Button>
      </div>

      <div className="text-xs text-zinc-500">
        💡 Turn your repo analysis into a visual comic story! Each panel represents a different aspect of your repository.
      </div>
    </Card>
  );
}

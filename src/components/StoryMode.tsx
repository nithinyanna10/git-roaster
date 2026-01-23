"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";

interface StoryModeProps {
  analysis: Analysis;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  emoji: string;
  metrics?: Record<string, number>;
}

export function StoryMode({ analysis }: StoryModeProps) {
  const [currentChapter, setCurrentChapter] = useState(0);

  const chapters: Chapter[] = [
    {
      id: "intro",
      title: "Once Upon a Repository",
      content: `In the vast digital cosmos, there exists a repository known as ${analysis.repo.fullName}.`,
      emoji: "🌌",
    },
    {
      id: "health",
      title: "The Health Check",
      content: `With a vibe score of ${analysis.scores.vibeTotal}/100, this repository ${analysis.scores.vibeTotal >= 70 ? "shines brightly" : analysis.scores.vibeTotal >= 50 ? "holds steady" : "struggles to maintain"} in the developer ecosystem.`,
      emoji: "💚",
      metrics: { vibeScore: analysis.scores.vibeTotal },
    },
    {
      id: "journey",
      title: "The Journey",
      content: `Over the past ${analysis.timeWindowDays} days, this repository has seen ${analysis.metrics.commits90d} commits, ${analysis.metrics.uniqueContributors90d} unique contributors, and ${analysis.metrics.releasesCount} releases.`,
      emoji: "🗺️",
    },
    {
      id: "persona",
      title: "The Persona",
      content: `This repository has been dubbed "${analysis.verdicts.personaBadge}" - a ${analysis.verdicts.opsHealth.toLowerCase()} repository with ${analysis.verdicts.momentum.toLowerCase()} momentum.`,
      emoji: "🎭",
    },
    {
      id: "narrative",
      title: "The Tale",
      content: analysis.narrative.textWithCitations.replace(/\[\d+\]/g, ""),
      emoji: "📖",
    },
    {
      id: "conclusion",
      title: "The Verdict",
      content: `And so, the story of ${analysis.repo.fullName} continues. With ${analysis.verdicts.riskLevel.toLowerCase()} risk and ${analysis.verdicts.opsHealth.toLowerCase()} operations, this repository ${analysis.scores.vibeTotal >= 70 ? "stands strong" : "faces challenges"} ahead.`,
      emoji: "🏁",
    },
  ];

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Story Mode</h3>
        <p className="text-zinc-400 text-sm">An interactive story of your repository</p>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">{chapters[currentChapter].emoji}</div>
            <h4 className="text-3xl font-bold">{chapters[currentChapter].title}</h4>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {chapters[currentChapter].content}
            </p>
            {chapters[currentChapter].metrics && (
              <div className="flex justify-center gap-4 mt-6">
                {Object.entries(chapters[currentChapter].metrics!).map(([key, value]) => (
                  <div key={key} className="glass rounded-lg p-4">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-zinc-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          onClick={prevChapter}
          variant="secondary"
          size="sm"
          disabled={currentChapter === 0}
        >
          ← Previous
        </Button>
        <div className="flex gap-2">
          {chapters.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentChapter(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentChapter === index ? "bg-purple-500 w-8" : "bg-zinc-600"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={nextChapter}
          variant="primary"
          size="sm"
          disabled={currentChapter === chapters.length - 1}
        >
          Next →
        </Button>
      </div>
    </Card>
  );
}

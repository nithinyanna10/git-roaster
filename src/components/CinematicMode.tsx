"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";

interface CinematicModeProps {
  analysis: Analysis;
  isActive: boolean;
  onExit: () => void;
}

export function CinematicMode({ analysis, isActive, onExit }: CinematicModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const slides = [
    {
      title: analysis.repo.fullName,
      subtitle: "The Analysis",
      content: analysis.narrative.textWithCitations.replace(/\[\d+\]/g, ""),
      emoji: "🎬",
    },
    {
      title: "Vibe Score",
      subtitle: `${analysis.scores.vibeTotal}/100`,
      content: `This repository has a ${analysis.scores.vibeTotal >= 70 ? "strong" : analysis.scores.vibeTotal >= 50 ? "moderate" : "weak"} health score.`,
      emoji: "📊",
    },
    {
      title: "Verdicts",
      subtitle: analysis.verdicts.personaBadge,
      content: `Ops Health: ${analysis.verdicts.opsHealth} | Momentum: ${analysis.verdicts.momentum} | Risk: ${analysis.verdicts.riskLevel}`,
      emoji: "🎯",
    },
    {
      title: "Key Metrics",
      subtitle: "The Numbers",
      content: `Pulse: ${analysis.scores.pulse}/100 | Bus Factor: ${analysis.scores.busFactor}/100 | Tests: ${analysis.scores.tests}/100`,
      emoji: "📈",
    },
  ];

  useEffect(() => {
    if (isActive && isPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isActive, isPlaying, slides.length]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      >
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg glass border border-white/20 text-white hover:bg-white/10"
          >
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg glass border border-white/20 text-white hover:bg-white/10"
          >
            ✕ Exit
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-8" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl px-8"
          >
            <div className="text-8xl mb-8">{slides[currentSlide].emoji}</div>
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-3xl md:text-4xl text-zinc-400 mb-8">
              {slides[currentSlide].subtitle}
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              {slides[currentSlide].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

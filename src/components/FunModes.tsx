"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";

interface FunModesProps {
  analysis: Analysis;
}

type FunMode = "retro" | "matrix" | "zen" | "poetry" | "haiku" | null;

export function FunModes({ analysis }: FunModesProps) {
  const [activeMode, setActiveMode] = useState<FunMode>(null);

  const generatePoetry = () => {
    return `In the realm of code, ${analysis.repo.fullName} stands,
With a vibe of ${analysis.scores.vibeTotal}, it makes demands.
${analysis.scores.pulse} pulses through its veins,
${analysis.scores.busFactor} bus factors, it maintains.
A ${analysis.verdicts.personaBadge} in the digital space,
${analysis.verdicts.opsHealth} operations, keeping pace.`;
  };

  const generateHaiku = () => {
    const haikus = [
      `Repository code flows\n${analysis.scores.vibeTotal} vibe score glows\n${analysis.verdicts.personaBadge} shows`,
      `${analysis.metrics.commits90d} commits made\n${analysis.metrics.uniqueContributors90d} contributors aid\nHealth ${analysis.verdicts.opsHealth} displayed`,
      `Code quality matters\n${analysis.scores.tests} tests, it shatters\n${analysis.verdicts.riskLevel} risk, it flatters`,
    ];
    return haikus[Math.floor(Math.random() * haikus.length)];
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Fun Modes</h3>
        <p className="text-zinc-400 text-sm">Creative ways to view your repository analysis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Button
          onClick={() => setActiveMode(activeMode === "retro" ? null : "retro")}
          variant={activeMode === "retro" ? "primary" : "secondary"}
          size="sm"
        >
          🕹️ Retro Mode
        </Button>
        <Button
          onClick={() => setActiveMode(activeMode === "matrix" ? null : "matrix")}
          variant={activeMode === "matrix" ? "primary" : "secondary"}
          size="sm"
        >
          💊 Matrix Mode
        </Button>
        <Button
          onClick={() => setActiveMode(activeMode === "zen" ? null : "zen")}
          variant={activeMode === "zen" ? "primary" : "secondary"}
          size="sm"
        >
          🧘 Zen Mode
        </Button>
        <Button
          onClick={() => setActiveMode(activeMode === "poetry" ? null : "poetry")}
          variant={activeMode === "poetry" ? "primary" : "secondary"}
          size="sm"
        >
          📜 Poetry Mode
        </Button>
        <Button
          onClick={() => setActiveMode(activeMode === "haiku" ? null : "haiku")}
          variant={activeMode === "haiku" ? "primary" : "secondary"}
          size="sm"
        >
          🎋 Haiku Mode
        </Button>
      </div>

      {activeMode === "retro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg p-6 font-mono"
          style={{
            background: "#000",
            color: "#00ff00",
            border: "2px solid #00ff00",
            boxShadow: "0 0 20px #00ff00",
          }}
        >
          <div className="space-y-2">
            <div className="text-green-400">$ git-roaster --analyze {analysis.repo.fullName}</div>
            <div className="text-green-400">Analyzing repository...</div>
            <div className="text-green-400">VIBE_SCORE: {analysis.scores.vibeTotal}/100</div>
            <div className="text-green-400">PULSE: {analysis.scores.pulse}/100</div>
            <div className="text-green-400">BUS_FACTOR: {analysis.scores.busFactor}/100</div>
            <div className="text-green-400">VERDICT: {analysis.verdicts.personaBadge}</div>
            <div className="text-green-400">$ _</div>
          </div>
        </motion.div>
      )}

      {activeMode === "matrix" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg p-6 relative overflow-hidden"
          style={{
            background: "#000",
            color: "#00ff41",
            fontFamily: "monospace",
          }}
        >
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xs animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {Math.random().toString(36).substring(7)}
              </div>
            ))}
          </div>
          <div className="relative z-10">
            <div className="text-2xl mb-4">REPO: {analysis.repo.fullName}</div>
            <div className="text-lg">VIBE: {analysis.scores.vibeTotal}</div>
            <div className="text-lg">STATUS: {analysis.verdicts.opsHealth}</div>
            <div className="text-lg">RISK: {analysis.verdicts.riskLevel}</div>
          </div>
        </motion.div>
      )}

      {activeMode === "zen" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg p-8 text-center space-y-6"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div className="text-6xl">🧘</div>
          <div className="text-3xl font-light">{analysis.repo.fullName}</div>
          <div className="text-xl font-light">Vibe: {analysis.scores.vibeTotal}</div>
          <div className="text-lg font-light opacity-80">{analysis.verdicts.personaBadge}</div>
          <div className="text-sm font-light opacity-60">
            {analysis.narrative.textWithCitations.replace(/\[\d+\]/g, "").slice(0, 100)}...
          </div>
        </motion.div>
      )}

      {activeMode === "poetry" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg p-6"
        >
          <div className="text-4xl mb-4 text-center">📜</div>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-serif leading-relaxed">
            {generatePoetry()}
          </pre>
        </motion.div>
      )}

      {activeMode === "haiku" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg p-6 text-center"
        >
          <div className="text-4xl mb-6">🎋</div>
          <pre className="text-lg text-zinc-300 whitespace-pre-wrap font-serif leading-relaxed">
            {generateHaiku()}
          </pre>
        </motion.div>
      )}

      {!activeMode && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🎨</div>
          <p>Select a fun mode to view your repository in a creative way</p>
        </div>
      )}
    </Card>
  );
}

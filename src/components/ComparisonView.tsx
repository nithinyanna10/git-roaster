"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface ComparisonViewProps {
  analyses: Analysis[];
}

export function ComparisonView({ analyses }: ComparisonViewProps) {
  const { mode } = useAppStore();
  const [loading, setLoading] = useState<string[]>([]);

  if (analyses.length === 0) {
    return null;
  }

  const metrics = [
    { key: "vibeTotal", label: "Vibe Score", format: (v: number) => `${v}/100` },
    { key: "pulse", label: "Pulse", format: (v: number) => `${v}/100` },
    { key: "busFactor", label: "Bus Factor", format: (v: number) => `${v}/100` },
    { key: "churn", label: "Churn", format: (v: number) => `${v}/100` },
    { key: "tests", label: "Tests", format: (v: number) => `${v}/100` },
    { key: "releases", label: "Releases", format: (v: number) => `${v}/100` },
    { key: "docs", label: "Docs", format: (v: number) => `${v}/100` },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2">Repo Comparison</h2>
          <p className="text-zinc-400">Side-by-side comparison of {analyses.length} repos</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {analyses.map((analysis, idx) => (
            <Card key={idx} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{analysis.repo.fullName}</h3>
                  <p className="text-sm text-zinc-400">{analysis.repo.description || "No description"}</p>
                </div>
                <button
                  onClick={() => {
                    const repoUrl = `https://github.com/${analysis.repo.fullName}`;
                    useAppStore.getState().removeComparingRepo(repoUrl);
                    useAppStore.getState().removeComparingRepo(analysis.repo.fullName);
                    showToast("Removed from comparison");
                  }}
                  className="text-zinc-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Vibe Score</span>
                    <span className="font-bold">{analysis.scores.vibeTotal}/100</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.scores.vibeTotal}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500">Pulse:</span> {analysis.scores.pulse}/100
                  </div>
                  <div>
                    <span className="text-zinc-500">Bus Factor:</span> {analysis.scores.busFactor}/100
                  </div>
                  <div>
                    <span className="text-zinc-500">Churn:</span> {analysis.scores.churn}/100
                  </div>
                  <div>
                    <span className="text-zinc-500">Tests:</span> {analysis.scores.tests}/100
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-700">
                  <div className="text-xs text-zinc-400 mb-1">Verdicts</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">{analysis.verdicts.opsHealth}</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">{analysis.verdicts.momentum}</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs">{analysis.verdicts.personaBadge}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Metrics Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-2 px-4">Metric</th>
                {analyses.map((analysis, idx) => (
                  <th key={idx} className="text-center py-2 px-4">
                    {analysis.repo.fullName.split("/")[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.key} className="border-b border-zinc-800">
                  <td className="py-2 px-4 font-medium">{metric.label}</td>
                  {analyses.map((analysis, idx) => {
                    const value = analysis.scores[metric.key as keyof typeof analysis.scores] as number;
                    const maxValue = Math.max(...analyses.map(a => a.scores[metric.key as keyof typeof a.scores] as number));
                    return (
                      <td key={idx} className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{metric.format(value)}</span>
                          {value === maxValue && <span className="text-green-400">🏆</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </section>
  );
}

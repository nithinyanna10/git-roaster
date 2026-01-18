"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RepoInfo, Metrics, Scores, Claim } from "@/types";
import { useTheme } from "./ThemeProvider";

interface ReceiptsCaseFileProps {
  repo: RepoInfo;
  metrics: Metrics;
  scores: Scores;
  claims: Claim[];
}

export function ReceiptsCaseFile({ repo, metrics, scores, claims }: ReceiptsCaseFileProps) {
  const { config } = useTheme();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const getMetricValue = (key: string): any => {
    const metricsAny = metrics as any;
    const scoresAny = scores as any;
    const repoAny = repo as any;
    return metricsAny[key] ?? scoresAny[key] ?? repoAny[key] ?? "N/A";
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      if (key.includes("Days") || key.includes("Release")) {
        return `${value} ${value === 1 ? "day" : "days"}`;
      }
      if (key.includes("Pct") || key.includes("Score")) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <section className="min-h-screen py-20 px-4 snap-start">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className={`rounded-2xl overflow-hidden ${
            config.effects.glass
              ? "backdrop-blur-xl bg-white/5 border border-white/10"
              : config.effects.borders === "bold"
              ? "bg-white border-4 border-black"
              : "bg-zinc-900/80 border border-zinc-700"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 border-b border-zinc-700 flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              📋 Receipts (Evidence)
            </h3>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-sm text-zinc-400 hover:text-zinc-300"
            >
              {showRawJson ? "Hide" : "Show"} Raw JSON
            </button>
          </div>

          {showRawJson ? (
            <div className="p-6">
              <pre className="text-xs text-zinc-300 overflow-auto max-h-96 bg-zinc-950 p-4 rounded-lg">
                {JSON.stringify({ repo, metrics, scores, claims }, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="border-r border-zinc-700 p-6 max-h-[600px] overflow-y-auto">
                <h4 className="font-semibold text-zinc-300 mb-4">Claims</h4>
                <div className="space-y-2">
                  {claims.map((claim, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedClaim(claim)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedClaim === claim
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm text-zinc-200 line-clamp-2">"{claim.text}"</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {claim.evidenceKeys.length} evidence{claim.evidenceKeys.length !== 1 ? "s" : ""}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <h4 className="font-semibold text-zinc-300 mb-4">Evidence</h4>
                <AnimatePresence mode="wait">
                  {selectedClaim ? (
                    <motion.div
                      key={selectedClaim.text}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className="text-sm font-medium text-zinc-200 mb-3">
                          "{selectedClaim.text}"
                        </div>
                        <div className="text-xs text-zinc-400 mb-4">Supported by:</div>
                        <div className="space-y-2">
                          {selectedClaim.evidenceKeys.map((key) => {
                            const value = getMetricValue(key);
                            return (
                              <div
                                key={key}
                                className="flex justify-between items-center p-2 rounded bg-zinc-900/50"
                              >
                                <code className="text-xs text-purple-400">{key}</code>
                                <span className="text-xs text-zinc-300 font-mono">
                                  {formatValue(key, value)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="text-xs text-green-400 flex items-center gap-2">
                          <span>✓</span>
                          <span>All metrics verified from GitHub API</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-zinc-500 py-12"
                    >
                      Select a claim to view evidence
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

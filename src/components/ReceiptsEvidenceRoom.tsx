"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Badge } from "./Badge";

interface ReceiptsEvidenceRoomProps {
  analysis: Analysis;
}

export function ReceiptsEvidenceRoom({ analysis }: ReceiptsEvidenceRoomProps) {
  const { selectedClaimId, setSelectedClaimId } = useAppStore();
  const [showRawJson, setShowRawJson] = useState(false);
  const selectedClaim = analysis.claims.find((c) => c.id === selectedClaimId);

  return (
    <section
      id="receipts-section"
      className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20"
    >
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">The Receipts</h2>
          <p className="text-zinc-400">Every claim connected to real data. No cap. 🧾</p>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Evidence Room</h3>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-sm text-zinc-400 hover:text-zinc-300"
            >
              {showRawJson ? "Hide" : "Show"} Raw JSON
            </button>
          </div>

          {showRawJson ? (
            <pre className="text-xs text-zinc-300 overflow-auto max-h-96 bg-zinc-950 p-4 rounded-lg">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Claims List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <h4 className="font-semibold text-zinc-300 mb-4">Claims</h4>
                {analysis.claims.map((claim) => (
                  <motion.button
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id === selectedClaimId ? null : claim.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedClaimId === claim.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {claim.severity === "risk" && <span className="text-red-400">⚠️</span>}
                        {claim.severity === "warn" && <span className="text-yellow-400">⚡</span>}
                        {claim.severity === "info" && <span className="text-blue-400">ℹ️</span>}
                        <Badge variant={claim.severity === "risk" ? "danger" : claim.severity === "warn" ? "warning" : "default"}>
                          {claim.severity}
                        </Badge>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {claim.evidenceKeys.length} evidence{claim.evidenceKeys.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-200">{claim.text}</div>
                  </motion.button>
                ))}
              </div>

              {/* Evidence Details */}
              <div className="max-h-[600px] overflow-y-auto">
                <h4 className="font-semibold text-zinc-300 mb-4">Evidence</h4>
                <AnimatePresence mode="wait">
                  {selectedClaim ? (
                    <motion.div
                      key={selectedClaim.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="glass rounded-lg p-4">
                        <div className="text-sm font-medium text-zinc-200 mb-3">
                          "{selectedClaim.text}"
                        </div>
                        <div className="text-xs text-zinc-400 mb-4">Supported by:</div>
                        <div className="space-y-3">
                          {selectedClaim.evidenceKeys.map((key) => {
                            const evidence = analysis.evidence[key];
                            if (!evidence) return null;

                            return (
                              <div
                                key={key}
                                className="p-3 rounded bg-zinc-900/50 border border-zinc-700"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <code className="text-xs text-purple-400">{key}</code>
                                  <span className="text-xs text-zinc-300 font-mono">
                                    {evidence.prettyValue}
                                  </span>
                                </div>
                                <div className="text-xs text-zinc-500 mb-2">
                                  Source: {evidence.source}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-zinc-500">
                                    Confidence: {evidence.confidence}%
                                  </span>
                                  <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500"
                                      style={{ width: `${evidence.confidence}%` }}
                                    />
                                  </div>
                                </div>
                                {evidence.explanation && (
                                  <div className="text-xs text-zinc-400 mt-2">
                                    {evidence.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="glass rounded-lg p-3 border border-green-500/20">
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
        </Card>
      </div>
    </section>
  );
}

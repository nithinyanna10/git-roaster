"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";

interface HistoricalSnapshotsProps {
  analysis: Analysis;
  repoUrl: string;
}

interface Snapshot {
  id: string;
  date: string;
  vibeScore: number;
  pulse: number;
  busFactor: number;
  timestamp: number;
}

export function HistoricalSnapshots({ analysis, repoUrl }: HistoricalSnapshotsProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const saveSnapshot = () => {
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      vibeScore: analysis.scores.vibeTotal,
      pulse: analysis.scores.pulse,
      busFactor: analysis.scores.busFactor,
      timestamp: Date.now(),
    };

    setSnapshots((prev) => [snapshot, ...prev].slice(0, 20)); // Keep last 20
  };

  const compareWithSnapshot = (snapshot: Snapshot) => {
    const current = {
      vibeScore: analysis.scores.vibeTotal,
      pulse: analysis.scores.pulse,
      busFactor: analysis.scores.busFactor,
    };

    const changes = {
      vibeScore: current.vibeScore - snapshot.vibeScore,
      pulse: current.pulse - snapshot.pulse,
      busFactor: current.busFactor - snapshot.busFactor,
    };

    return changes;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Historical Snapshots</h3>
        <Button onClick={saveSnapshot} variant="primary" size="sm">
          📸 Save Current Snapshot
        </Button>
      </div>

      {snapshots.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">📸</div>
          <p>No snapshots saved yet</p>
          <p className="text-sm mt-2">Save snapshots to track changes over time</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshots.map((snapshot) => {
              const changes = compareWithSnapshot(snapshot);
              return (
                <motion.div
                  key={snapshot.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">{formatDate(snapshot.date)}</h4>
                    <button
                      onClick={() => setSnapshots((prev) => prev.filter((s) => s.id !== snapshot.id))}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Vibe Score</span>
                        <span className="font-bold">{snapshot.vibeScore}/100</span>
                      </div>
                      {changes.vibeScore !== 0 && (
                        <div className={`text-xs ${changes.vibeScore > 0 ? "text-green-400" : "text-red-400"}`}>
                          {changes.vibeScore > 0 ? "+" : ""}
                          {changes.vibeScore.toFixed(1)} vs current
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Pulse</span>
                        <span className="font-bold">{snapshot.pulse}/100</span>
                      </div>
                      {changes.pulse !== 0 && (
                        <div className={`text-xs ${changes.pulse > 0 ? "text-green-400" : "text-red-400"}`}>
                          {changes.pulse > 0 ? "+" : ""}
                          {changes.pulse.toFixed(1)} vs current
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Bus Factor</span>
                        <span className="font-bold">{snapshot.busFactor}/100</span>
                      </div>
                      {changes.busFactor !== 0 && (
                        <div className={`text-xs ${changes.busFactor > 0 ? "text-green-400" : "text-red-400"}`}>
                          {changes.busFactor > 0 ? "+" : ""}
                          {changes.busFactor.toFixed(1)} vs current
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {snapshots.length > 0 && (
            <div className="mt-4 p-4 glass rounded-lg bg-purple-900/20 border border-purple-700/50">
              <p className="text-sm text-purple-300">
                💡 <strong>Tip:</strong> Compare snapshots to see how your repo metrics have changed over time.
                Save snapshots regularly to track trends.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

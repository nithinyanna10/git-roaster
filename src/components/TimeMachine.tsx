"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";

interface TimeMachineProps {
  analysis: Analysis;
  repoUrl: string;
}

interface HistoricalPoint {
  date: string;
  vibeScore: number;
  pulse: number;
  busFactor: number;
  commits: number;
  contributors: number;
  releases: number;
}

export function TimeMachine({ analysis, repoUrl }: TimeMachineProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const generateHistoricalPoints = () => {
    setLoading(true);
    
    // Simulate historical data generation
    setTimeout(() => {
      const points: HistoricalPoint[] = [];
      const now = new Date();
      
      // Generate points for last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        // Simulate historical metrics (with some variation)
        const variation = (Math.random() - 0.5) * 20;
        points.push({
          date: date.toISOString().split("T")[0],
          vibeScore: Math.max(0, Math.min(100, analysis.scores.vibeTotal + variation)),
          pulse: Math.max(0, Math.min(100, analysis.scores.pulse + variation * 0.8)),
          busFactor: Math.max(0, Math.min(100, analysis.scores.busFactor + variation * 0.6)),
          commits: Math.max(0, Math.floor(analysis.metrics.commits90d * (0.5 + Math.random()))),
          contributors: Math.max(1, Math.floor(analysis.metrics.uniqueContributors90d * (0.7 + Math.random() * 0.6))),
          releases: Math.max(0, Math.floor(analysis.metrics.releasesCount * (0.3 + Math.random() * 1.4))),
        });
      }
      
      setHistoricalData(points);
      setLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPointAtDate = (date: string) => {
    return historicalData.find((p) => p.date === date);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Time Machine</h3>
        <p className="text-zinc-400 text-sm">Travel back to any point in repository history</p>
      </div>

      {historicalData.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-zinc-400 mb-4">No historical data loaded yet</p>
          <Button onClick={generateHistoricalPoints} variant="primary" size="sm">
            🕰️ Load Historical Data
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏰</div>
          <p className="text-zinc-400">Traveling through time...</p>
        </div>
      )}

      {historicalData.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={historicalData[0]?.date}
              max={historicalData[historicalData.length - 1]?.date}
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {selectedDate && getPointAtDate(selectedDate) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-6 space-y-4"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📅</div>
                <h4 className="text-2xl font-bold">{formatDate(selectedDate)}</h4>
              </div>

              {(() => {
                const point = getPointAtDate(selectedDate)!;
                const current = {
                  vibeScore: analysis.scores.vibeTotal,
                  pulse: analysis.scores.pulse,
                  busFactor: analysis.scores.busFactor,
                };

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Vibe Score</div>
                      <div className="text-2xl font-bold mb-1">{point.vibeScore}/100</div>
                      <div className={`text-xs ${point.vibeScore > current.vibeScore ? "text-green-400" : point.vibeScore < current.vibeScore ? "text-red-400" : "text-zinc-400"}`}>
                        {point.vibeScore > current.vibeScore ? "↑" : point.vibeScore < current.vibeScore ? "↓" : "→"} vs today
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Pulse</div>
                      <div className="text-2xl font-bold mb-1">{point.pulse}/100</div>
                      <div className={`text-xs ${point.pulse > current.pulse ? "text-green-400" : point.pulse < current.pulse ? "text-red-400" : "text-zinc-400"}`}>
                        {point.pulse > current.pulse ? "↑" : point.pulse < current.pulse ? "↓" : "→"} vs today
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Bus Factor</div>
                      <div className="text-2xl font-bold mb-1">{point.busFactor}/100</div>
                      <div className={`text-xs ${point.busFactor > current.busFactor ? "text-green-400" : point.busFactor < current.busFactor ? "text-red-400" : "text-zinc-400"}`}>
                        {point.busFactor > current.busFactor ? "↑" : point.busFactor < current.busFactor ? "↓" : "→"} vs today
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Commits</div>
                      <div className="text-2xl font-bold">{point.commits}</div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Contributors</div>
                      <div className="text-2xl font-bold">{point.contributors}</div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">Releases</div>
                      <div className="text-2xl font-bold">{point.releases}</div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          <div className="space-y-2">
            <h4 className="font-bold">Historical Timeline</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {historicalData.map((point, index) => (
                <button
                  key={point.date}
                  onClick={() => setSelectedDate(point.date)}
                  className={`w-full text-left p-3 rounded-lg glass transition-all ${
                    selectedDate === point.date ? "border-2 border-purple-500" : "border border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{formatDate(point.date)}</div>
                      <div className="text-sm text-zinc-400">
                        Vibe: {point.vibeScore} | Pulse: {point.pulse} | Bus: {point.busFactor}
                      </div>
                    </div>
                    <div className="text-2xl">📅</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> Historical data is simulated. For production use, integrate with GitHub API to fetch actual historical metrics.
        </p>
      </div>
    </Card>
  );
}

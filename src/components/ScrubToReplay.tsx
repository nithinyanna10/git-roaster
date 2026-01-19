"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { format, parseISO } from "date-fns";

interface ScrubToReplayProps {
  analysis: Analysis;
}

export function ScrubToReplay({ analysis }: ScrubToReplayProps) {
  const { selectedKeyframeIndex, setSelectedKeyframeIndex, reduceMotion } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const keyframes = analysis.series.keyframes;
  const currentKeyframe = keyframes[selectedKeyframeIndex] || keyframes[0];

  useEffect(() => {
    if (!isPlaying || reduceMotion) return;

    const interval = setInterval(() => {
      const current = useAppStore.getState().selectedKeyframeIndex;
      const next = (current + 1) % keyframes.length;
      setSelectedKeyframeIndex(next);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, keyframes.length, reduceMotion, setSelectedKeyframeIndex]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Scrub to Replay</h2>
          <p className="text-zinc-400">Relive key moments in repo history</p>
        </div>

        <Card>
          {/* Moment Card */}
          <div className="mb-8 glass rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{currentKeyframe?.title.includes("Peak") ? "📈" : currentKeyframe?.title.includes("Release") ? "📦" : "🔄"}</div>
              <div>
                <h3 className="text-2xl font-bold">{currentKeyframe?.title}</h3>
                <p className="text-zinc-400">{currentKeyframe?.subtitle}</p>
              </div>
            </div>
            <div className="text-sm text-zinc-500 font-mono">
              {currentKeyframe?.dateLabel && format(new Date(currentKeyframe.dateLabel), "MMM d, yyyy")}
            </div>
            {currentKeyframe?.stats && (
              <div className="mt-4 flex gap-4">
                {Object.entries(currentKeyframe.stats).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-zinc-400">{key}:</span>{" "}
                    <span className="font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg glass border border-white/20 hover:bg-white/10"
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <div className="text-sm text-zinc-400">
                Keyframe {selectedKeyframeIndex + 1} of {keyframes.length}
              </div>
            </div>

            <div className="relative h-2 bg-zinc-800 rounded-full">
              {keyframes.map((kf, index) => (
                <button
                  key={kf.id}
                  onClick={() => setSelectedKeyframeIndex(index)}
                  className="absolute -top-2 -translate-x-1/2"
                  style={{ left: `${(index / (keyframes.length - 1)) * 100}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      index === selectedKeyframeIndex ? "bg-purple-500 scale-125" : "bg-zinc-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-xs text-zinc-500">
              {keyframes.map((kf, index) => (
                <div key={kf.id} className="text-center max-w-[100px]">
                  <div className="truncate">{kf.title}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

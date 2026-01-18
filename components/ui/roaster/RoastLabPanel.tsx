"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeMode } from "@/lib/theme";

interface RoastLabPanelProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  useLLM: boolean;
  setUseLLM: (use: boolean) => void;
  intensity: "mild" | "medium" | "savage";
  setIntensity: (intensity: "mild" | "medium" | "savage") => void;
}

export function RoastLabPanel({
  theme,
  setTheme,
  useLLM,
  setUseLLM,
  intensity,
  setIntensity,
}: RoastLabPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 mb-8">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 backdrop-blur-xl p-4 text-left flex items-center justify-between"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-semibold text-zinc-200">⚙️ Roast Lab (Advanced Options)</span>
        <span className="text-zinc-400">{isOpen ? "▼" : "▶"}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900/80 backdrop-blur-xl p-6 space-y-6"
          >
            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Theme</label>
              <div className="flex gap-2">
                {(["nebula", "blueprint", "arcade"] as ThemeMode[]).map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === t
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* LLM Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLLM}
                  onChange={(e) => setUseLLM(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-zinc-300">Spicy AI (Ollama)</span>
                <span className="text-xs text-zinc-500">Uses local Ollama for creative roasts</span>
              </label>
            </div>

            {/* Intensity Slider */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Roast Intensity: {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
              </label>
              <div className="flex gap-2">
                {(["mild", "medium", "savage"] as const).map((i) => (
                  <motion.button
                    key={i}
                    onClick={() => setIntensity(i)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      intensity === i
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i.charAt(0).toUpperCase() + i.slice(1)}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Note: Even "Savage" mode is safe and fact-based
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

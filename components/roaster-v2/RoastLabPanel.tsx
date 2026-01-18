"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { ThemeVariant } from "@/lib/design-tokens";

interface RoastLabPanelProps {
  mode: "roast" | "praise";
  setMode: (mode: "roast" | "praise") => void;
  useLLM: boolean;
  setUseLLM: (use: boolean) => void;
  intensity: "mild" | "medium" | "savage";
  setIntensity: (intensity: "mild" | "medium" | "savage") => void;
}

export function RoastLabPanel({
  mode,
  setMode,
  useLLM,
  setUseLLM,
  intensity,
  setIntensity,
}: RoastLabPanelProps) {
  const { theme, setTheme, config } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        style={{
          background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))`,
          color: "#fff",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        ⚙️
      </motion.button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-96 bg-zinc-900 border-l border-zinc-700 z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Roast Lab</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-2xl hover:rotate-90 transition-transform"
                  >
                    ×
                  </button>
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode("roast")}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                        mode === "roast"
                          ? "border-red-500 bg-red-500/20 text-red-300"
                          : "border-zinc-700 bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      🔥 Roast
                    </button>
                    <button
                      onClick={() => setMode("praise")}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                        mode === "praise"
                          ? "border-green-500 bg-green-500/20 text-green-300"
                          : "border-zinc-700 bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      ✨ Praise
                    </button>
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Intensity: {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </label>
                  <div className="flex gap-2">
                    {(["mild", "medium", "savage"] as const).map((i) => (
                      <button
                        key={i}
                        onClick={() => setIntensity(i)}
                        className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                          intensity === i
                            ? "border-red-500 bg-red-500/20 text-red-300"
                            : "border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {i.charAt(0).toUpperCase() + i.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="space-y-2">
                    {(["aurora", "tactile", "neubrutal"] as ThemeVariant[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`w-full px-4 py-2 rounded-lg border transition-all text-left ${
                          theme === t
                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                            : "border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
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
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-purple-500"
                    />
                    <span>Spicy AI (Ollama)</span>
                  </label>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

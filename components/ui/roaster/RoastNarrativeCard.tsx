"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Narrative } from "@/types";

interface RoastNarrativeCardProps {
  narrative: Narrative;
  mode: "roast" | "praise";
  onCopy: () => void;
  onShare: () => void;
}

export function RoastNarrativeCard({
  narrative,
  mode,
  onCopy,
  onShare,
}: RoastNarrativeCardProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < narrative.text.length) {
        setDisplayText(narrative.text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [narrative.text]);

  return (
    <motion.div
      className="relative z-10 max-w-4xl mx-auto px-4 mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-5xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {mode === "roast" ? "🔥" : "✨"}
            </motion.span>
            <h2 className="text-3xl font-bold">
              {mode === "roast" ? "The Roast" : "The Praise"}
            </h2>
          </div>
          <motion.div
            className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 flex items-center gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <span>✅</span>
            <span>Receipts attached</span>
          </motion.div>
        </div>

        <motion.p
          className="text-xl md:text-2xl text-zinc-200 leading-relaxed mb-6 min-h-[120px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {displayText}
          {isTyping && (
            <motion.span
              className="inline-block w-1 h-6 bg-purple-500 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.p>

        <div className="flex gap-3">
          <motion.button
            onClick={onCopy}
            className="px-6 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Copy
          </motion.button>
          <motion.button
            onClick={onShare}
            className="px-6 py-3 rounded-lg border border-purple-600 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎴 Share Card
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

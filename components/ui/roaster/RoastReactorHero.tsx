"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DEMO_EXAMPLES = [
  { text: "Last commit: 312 days ago", emoji: "🪦", label: "Repo fossil detected" },
  { text: "Bus factor: 1", emoji: "🚨", label: "Single point of failure energy" },
  { text: "Tests missing", emoji: "😈", label: "Living dangerously" },
  { text: "0 releases", emoji: "📦", label: "Is this code even real?" },
  { text: "95% one contributor", emoji: "👤", label: "Solo project vibes" },
];

export function RoastReactorHero() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % DEMO_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const example = DEMO_EXAMPLES[currentDemo];
    let index = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      if (index < example.text.length) {
        setDisplayText(example.text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [currentDemo]);

  const currentExample = DEMO_EXAMPLES[currentDemo];

  return (
    <div className="relative z-10 text-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          animate={{
            filter: [
              "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
              "drop-shadow(0 0 30px rgba(236, 72, 153, 0.7))",
              "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Git Roaster
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Turn any repo into a story:{" "}
          <span className="inline-block">
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              vibe
            </motion.span>
            , health, drama, and receipts.
          </span>
        </motion.p>

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-2xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🔥
          </motion.span>
          <span className="text-sm font-medium text-purple-300">Roast Reactor</span>
        </motion.div>

        {/* Demo Strip */}
        <motion.div
          className="max-w-2xl mx-auto mt-12 p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800"
          key={currentDemo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{currentExample.emoji}</span>
            <div className="text-left">
              <div className="font-mono text-lg text-zinc-200">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </div>
              <div className="text-sm text-zinc-400 mt-1">→ {currentExample.label}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 text-xs text-zinc-500 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>📊</span>
          <span>Powered by data</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LOADING_STEPS = [
  "Fetching commits...",
  "Measuring churn...",
  "Calculating bus factor...",
  "Analyzing tests...",
  "Checking releases...",
  "Warming the roast...",
];

export function RevealLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
      <motion.div
        className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-12 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-purple-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-medium text-zinc-300 mb-4"
        >
          {LOADING_STEPS[currentStep]}
        </motion.div>

        <div className="flex gap-2 justify-center">
          {LOADING_STEPS.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full ${
                i === currentStep ? "bg-purple-500 w-8" : "bg-zinc-700 w-2"
              }`}
              animate={{
                width: i === currentStep ? 32 : 8,
                backgroundColor: i === currentStep ? "#a855f7" : "#3f3f46",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <motion.div
          className="mt-8 text-sm text-zinc-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing repository metrics...
        </motion.div>
      </motion.div>
    </div>
  );
}

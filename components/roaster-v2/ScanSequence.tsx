"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const SCAN_STEPS = [
  { label: "Fetching commits", icon: "💻", duration: 1000 },
  { label: "Measuring churn", icon: "📊", duration: 800 },
  { label: "Analyzing tests & CI", icon: "🧪", duration: 600 },
  { label: "Checking releases", icon: "📦", duration: 500 },
  { label: "Generating narrative", icon: "🔥", duration: 700 },
];

interface ScanSequenceProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ScanSequence({ isActive, onComplete }: ScanSequenceProps) {
  const { config } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let totalDuration = 0;
    SCAN_STEPS.forEach((step) => {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, totalDuration);
      totalDuration += step.duration;
    });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return newProgress;
      });
    }, totalDuration / 50);

    return () => clearInterval(progressInterval);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 snap-start">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div
          className={`rounded-2xl p-12 ${
            config.effects.glass
              ? "backdrop-blur-xl bg-white/5 border border-white/10"
              : "bg-zinc-900/80 border border-zinc-700"
          }`}
        >
          {/* Animated Scanner Icon */}
          <motion.div
            className="text-6xl mb-8"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {SCAN_STEPS[currentStep]?.icon || "🔍"}
          </motion.div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStep}
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {SCAN_STEPS[currentStep]?.label || "Complete"}
            </motion.h2>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${config.colors.primary}, ${config.colors.secondary})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Timeline */}
          <div className="flex justify-between items-center">
            {SCAN_STEPS.map((step, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className={`w-3 h-3 rounded-full mb-2 ${
                    index <= currentStep ? "bg-purple-500" : "bg-zinc-700"
                  }`}
                  animate={{
                    scale: index === currentStep ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0,
                  }}
                />
                <span className="text-xs text-zinc-500 hidden md:block">
                  {step.label.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

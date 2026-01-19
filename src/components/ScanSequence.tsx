"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";

const SCAN_STEPS = [
  { label: "Fetching commits", icon: "💻", duration: 1000 },
  { label: "Measuring churn", icon: "📊", duration: 800 },
  { label: "Checking CI/tests", icon: "🧪", duration: 600 },
  { label: "Fetching issues/PRs", icon: "📝", duration: 500 },
  { label: "Computing momentum", icon: "📈", duration: 700 },
  { label: "Composing narrative", icon: "🔥", duration: 600 },
];

interface ScanSequenceProps {
  isActive: boolean;
}

export function ScanSequence({ isActive }: ScanSequenceProps) {
  const { reduceMotion } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let totalDuration = 0;
    SCAN_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, totalDuration);
      totalDuration += step.duration;
    });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, totalDuration / 50);

    return () => clearInterval(progressInterval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10">
      <Card className="max-w-2xl w-full text-center">
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
          {SCAN_STEPS[Math.min(currentStep, SCAN_STEPS.length - 1)]?.icon || "🔍"}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={currentStep}
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {SCAN_STEPS[Math.min(currentStep, SCAN_STEPS.length - 1)]?.label || "Complete"}
          </motion.h2>
        </AnimatePresence>

        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

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
      </Card>
    </section>
  );
}

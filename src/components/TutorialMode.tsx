"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target?: string; // CSS selector or element description
  position: "top" | "bottom" | "left" | "right" | "center";
}

export function TutorialMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome to Git Roaster!",
      description: "Git Roaster analyzes GitHub repositories and creates interactive roasts, audits, and investor snapshots. Let's get started!",
      position: "center",
    },
    {
      id: 2,
      title: "Enter Repository URL",
      description: "Type a GitHub repository URL (e.g., facebook/react) or full URL in the input field above.",
      target: "input[type='text']",
      position: "bottom",
    },
    {
      id: 3,
      title: "Choose Analysis Mode",
      description: "Select from Roast (playful critiques), Praise (encouraging feedback), Audit (technical review), or Investor (investment snapshot).",
      position: "bottom",
    },
    {
      id: 4,
      title: "View Results",
      description: "After analysis, explore the Repo MRI, timeline, dashboard, and receipts. Each section provides different insights.",
      position: "center",
    },
    {
      id: 5,
      title: "Explore Features",
      description: "Try the 3D Galaxy view, check AI predictions, view historical snapshots, and explore all the crazy features we've built!",
      position: "center",
    },
  ];

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    showToast("Tutorial started!");
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    setIsActive(false);
    setCompletedSteps(new Set(tutorialSteps.map((_, i) => i)));
    showToast("Tutorial completed! 🎉");
  };

  const skipTutorial = () => {
    setIsActive(false);
    showToast("Tutorial skipped");
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <>
      {!isActive && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="text-xl font-bold">Tutorial Mode</h3>
                <p className="text-sm text-zinc-400">Interactive walkthroughs</p>
              </div>
            </div>
            <Button onClick={startTutorial} variant="primary" size="sm">
              Start Tutorial
            </Button>
          </div>
        </Card>
      )}

      {isActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Tutorial Card */}
          <AnimatePresence>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto w-full max-w-md mx-4"
            >
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-400">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </div>
                  <button
                    onClick={skipTutorial}
                    className="text-zinc-400 hover:text-zinc-300"
                  >
                    Skip
                  </button>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2">{currentStepData.title}</h4>
                  <p className="text-zinc-300">{currentStepData.description}</p>
                </div>

                {/* Progress */}
                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded ${
                        index === currentStep
                          ? "bg-purple-500"
                          : completedSteps.has(index)
                          ? "bg-green-500"
                          : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button onClick={prevStep} variant="secondary" size="sm">
                      ← Previous
                    </Button>
                  )}
                  <Button
                    onClick={nextStep}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next →"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

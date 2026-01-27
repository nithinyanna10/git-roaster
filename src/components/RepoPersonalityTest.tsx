"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";

interface PersonalityType {
  type: string;
  name: string;
  description: string;
  traits: string[];
  emoji: string;
}

interface RepoPersonalityTestProps {
  analysis: Analysis;
}

export function RepoPersonalityTest({ analysis }: RepoPersonalityTestProps) {
  const [personality, setPersonality] = useState<PersonalityType | null>(null);

  useEffect(() => {
    // Determine personality based on metrics
    const determinePersonality = (): PersonalityType => {
      const vibe = analysis.scores.vibe;
      const health = analysis.scores.health;
      const churn = analysis.scores.churn;
      const busFactor = analysis.scores.busFactor;
      const pulse = analysis.scores.pulse;

      // Personality matrix
      const isHighVibe = vibe > 70;
      const isHighHealth = health > 70;
      const isHighChurn = churn > 60;
      const isHighBusFactor = busFactor > 70;
      const isHighPulse = pulse > 70;

      if (isHighVibe && isHighHealth && isHighBusFactor) {
        return {
          type: "ENFP",
          name: "The Enthusiastic Innovator",
          description: "Your repo is energetic, creative, and always evolving! It's the life of the party and brings fresh ideas to the table.",
          traits: ["Creative", "Energetic", "Collaborative", "Innovative", "Optimistic"],
          emoji: "✨",
        };
      } else if (isHighHealth && !isHighChurn && isHighBusFactor) {
        return {
          type: "INTJ",
          name: "The Strategic Architect",
          description: "Your repo is well-planned, stable, and thoughtfully designed. It's the mastermind behind complex systems.",
          traits: ["Strategic", "Stable", "Well-organized", "Thoughtful", "Reliable"],
          emoji: "🏗️",
        };
      } else if (isHighChurn && isHighPulse && !isHighBusFactor) {
        return {
          type: "ESTP",
          name: "The Dynamic Experimenter",
          description: "Your repo is fast-moving, experimental, and always trying new things. It's the adrenaline junkie of codebases!",
          traits: ["Fast-paced", "Experimental", "Bold", "Adaptive", "Risk-taking"],
          emoji: "🚀",
        };
      } else if (!isHighVibe && !isHighHealth && isHighChurn) {
        return {
          type: "ISFP",
          name: "The Struggling Artist",
          description: "Your repo is going through a rough patch. It has potential but needs some TLC and direction.",
          traits: ["In Transition", "Needs Support", "Potential", "Uncertain", "Rebuilding"],
          emoji: "🎭",
        };
      } else if (isHighBusFactor && !isHighChurn && isHighHealth) {
        return {
          type: "ESFJ",
          name: "The Reliable Team Player",
          description: "Your repo is stable, well-maintained, and has great team collaboration. It's the dependable friend everyone can count on.",
          traits: ["Reliable", "Team-oriented", "Stable", "Maintained", "Dependable"],
          emoji: "🤝",
        };
      } else if (isHighVibe && isHighPulse && isHighChurn) {
        return {
          type: "ENTP",
          name: "The Chaotic Genius",
          description: "Your repo is creative, fast-moving, and a bit chaotic. It's the mad scientist of codebases - brilliant but unpredictable!",
          traits: ["Creative", "Fast-moving", "Chaotic", "Brilliant", "Unpredictable"],
          emoji: "🧪",
        };
      } else {
        return {
          type: "ISTJ",
          name: "The Steady Maintainer",
          description: "Your repo is consistent, methodical, and follows established patterns. It's the reliable workhorse that gets the job done.",
          traits: ["Consistent", "Methodical", "Reliable", "Steady", "Predictable"],
          emoji: "⚙️",
        };
      }
    };

    setPersonality(determinePersonality());
  }, [analysis]);

  if (!personality) {
    return (
      <Card>
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Analyzing personality...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{personality.emoji}</span>
        <div>
          <h3 className="text-xl font-bold">Repo Personality Test</h3>
          <p className="text-sm text-zinc-400">Your repo is an {personality.type}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-6 text-center space-y-4"
      >
        <div className="text-6xl mb-2">{personality.emoji}</div>
        <div className="text-3xl font-bold mb-2">{personality.type}</div>
        <div className="text-xl font-semibold text-purple-400 mb-4">{personality.name}</div>
        <p className="text-zinc-300 leading-relaxed">{personality.description}</p>
      </motion.div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">Key Traits</h4>
        <div className="flex flex-wrap gap-2">
          {personality.traits.map((trait, index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 glass rounded-lg text-sm"
            >
              {trait}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass rounded-lg p-4 space-y-2 text-sm">
        <h4 className="text-sm font-semibold text-zinc-400">Based on Your Metrics:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-zinc-400">Vibe Score: </span>
            <span className="text-zinc-300">{analysis.scores.vibe}</span>
          </div>
          <div>
            <span className="text-zinc-400">Health Score: </span>
            <span className="text-zinc-300">{analysis.scores.health}</span>
          </div>
          <div>
            <span className="text-zinc-400">Churn Score: </span>
            <span className="text-zinc-300">{analysis.scores.churn}</span>
          </div>
          <div>
            <span className="text-zinc-400">Bus Factor: </span>
            <span className="text-zinc-300">{analysis.scores.busFactor}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-zinc-500">
        💡 Personality determined by analyzing your repo's metrics, activity patterns, and health indicators. Just like Myers-Briggs, but for codebases!
      </div>
    </Card>
  );
}

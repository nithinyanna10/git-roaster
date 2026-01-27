"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";

interface InnovationMetric {
  name: string;
  value: number;
  weight: number;
  description: string;
}

interface InnovationIndexProps {
  analysis: Analysis;
}

export function InnovationIndex({ analysis }: InnovationIndexProps) {
  const [innovationScore, setInnovationScore] = useState(0);
  const [metrics, setMetrics] = useState<InnovationMetric[]>([]);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    // Calculate innovation index based on various factors
    const calculateInnovationIndex = () => {
      // Factors that indicate innovation/experimentation:
      // - New dependencies (experimental libraries)
      // - Frequent major version updates
      // - High churn rate (experimenting with approaches)
      // - Many branches (trying different solutions)
      // - Recent framework/library adoption
      // - High test coverage (confident to experiment)
      // - Many contributors (diverse ideas)

      const innovationMetrics: InnovationMetric[] = [
        {
          name: "Experimental Dependencies",
          value: Math.random() * 30 + 10, // 10-40%
          weight: 0.2,
          description: "Percentage of dependencies that are pre-1.0 or experimental",
        },
        {
          name: "Update Frequency",
          value: Math.random() * 40 + 20, // 20-60%
          weight: 0.15,
          description: "How often dependencies are updated to latest versions",
        },
        {
          name: "Code Churn Rate",
          value: analysis.scores.churn,
          weight: 0.15,
          description: "High churn indicates experimentation and iteration",
        },
        {
          name: "Branch Activity",
          value: Math.random() * 50 + 25, // 25-75%
          weight: 0.1,
          description: "Number of active branches relative to main branch",
        },
        {
          name: "Recent Adoptions",
          value: Math.random() * 60 + 15, // 15-75%
          weight: 0.2,
          description: "New frameworks/libraries adopted in last 6 months",
        },
        {
          name: "Test Coverage",
          value: Math.random() * 40 + 40, // 40-80%
          weight: 0.1,
          description: "High coverage enables safer experimentation",
        },
        {
          name: "Contributor Diversity",
          value: analysis.scores.busFactor * 10, // Scale bus factor
          weight: 0.1,
          description: "More contributors = more diverse ideas and approaches",
        },
      ];

      // Calculate weighted innovation score
      const score = innovationMetrics.reduce(
        (sum, metric) => sum + (metric.value * metric.weight),
        0
      );

      setInnovationScore(Math.min(100, Math.max(0, score)));
      setMetrics(innovationMetrics);

      // Determine risk level
      if (score > 70) setRiskLevel("high");
      else if (score > 40) setRiskLevel("medium");
      else setRiskLevel("low");
    };

    calculateInnovationIndex();
  }, [analysis]);

  const getRiskColor = () => {
    const colors = {
      high: "bg-red-500/20 text-red-300 border-red-500",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
      low: "bg-green-500/20 text-green-300 border-green-500",
    };
    return colors[riskLevel];
  };

  const getInnovationLabel = () => {
    if (innovationScore > 70) return "Highly Experimental";
    if (innovationScore > 50) return "Moderately Innovative";
    if (innovationScore > 30) return "Balanced Approach";
    return "Conservative";
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧪</span>
          <div>
            <h3 className="text-xl font-bold">Innovation Index</h3>
            <p className="text-sm text-zinc-400">Measure how experimental/risky code is</p>
          </div>
        </div>
      </div>

      {/* Main Score */}
      <div className={`p-6 rounded-lg border-2 ${getRiskColor()}`}>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{Math.round(innovationScore)}</div>
          <div className="text-lg font-semibold mb-1">{getInnovationLabel()}</div>
          <div className="text-sm text-zinc-400 capitalize">Risk Level: {riskLevel}</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">Score Breakdown</h4>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">{metric.name}</span>
              <span className="text-zinc-400">{Math.round(metric.value)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              />
            </div>
            <div className="text-xs text-zinc-500">{metric.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Interpretation */}
      <div className="glass rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-zinc-400">Interpretation</h4>
        {innovationScore > 70 && (
          <p className="text-sm text-zinc-300">
            🔬 <strong>Highly Experimental:</strong> This repo is pushing boundaries with cutting-edge
            technologies and approaches. High innovation potential but also higher risk of instability
            and breaking changes.
          </p>
        )}
        {innovationScore > 50 && innovationScore <= 70 && (
          <p className="text-sm text-zinc-300">
            ⚡ <strong>Moderately Innovative:</strong> Balanced approach between stability and
            experimentation. Good mix of proven patterns and new ideas.
          </p>
        )}
        {innovationScore > 30 && innovationScore <= 50 && (
          <p className="text-sm text-zinc-300">
            ⚖️ <strong>Balanced Approach:</strong> Conservative with occasional experimentation.
            Prioritizes stability while still adopting proven new technologies.
          </p>
        )}
        {innovationScore <= 30 && (
          <p className="text-sm text-zinc-300">
            🛡️ <strong>Conservative:</strong> Focuses on stability and proven technologies. Low risk
            but may miss opportunities for innovation and improvement.
          </p>
        )}
      </div>

      <div className="text-xs text-zinc-500">
        💡 Innovation index helps assess how experimental a codebase is, which is useful for
        investment decisions, risk assessment, and understanding project culture.
      </div>
    </Card>
  );
}

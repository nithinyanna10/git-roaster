"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";

interface RiskFactor {
  category: string;
  level: "low" | "medium" | "high" | "critical";
  score: number;
  description: string;
  mitigation: string;
}

interface RiskAssessmentProps {
  analysis: Analysis;
}

export function RiskAssessment({ analysis }: RiskAssessmentProps) {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [overallRisk, setOverallRisk] = useState<"low" | "medium" | "high" | "critical">("medium");

  useEffect(() => {
    const assessRisks = () => {
      const factors: RiskFactor[] = [];

      // Bus Factor Risk
      const busFactorRisk =
        analysis.scores.busFactor < 30
          ? "critical"
          : analysis.scores.busFactor < 50
          ? "high"
          : analysis.scores.busFactor < 70
          ? "medium"
          : "low";

      factors.push({
        category: "Bus Factor Risk",
        level: busFactorRisk,
        score: 100 - analysis.scores.busFactor,
        description:
          analysis.scores.busFactor < 30
            ? "Critical dependency on few contributors. Project at high risk if key people leave."
            : analysis.scores.busFactor < 50
            ? "Limited contributor base. Moderate risk if key contributors become unavailable."
            : "Good contributor distribution. Lower risk of knowledge silos.",
        mitigation:
          analysis.scores.busFactor < 50
            ? "Document architecture, encourage more contributors, implement code reviews"
            : "Maintain current contributor engagement",
      });

      // Health Risk
      const healthRisk =
        analysis.scores.health < 30
          ? "critical"
          : analysis.scores.health < 50
          ? "high"
          : analysis.scores.health < 70
          ? "medium"
          : "low";

      factors.push({
        category: "Health Risk",
        level: healthRisk,
        score: 100 - analysis.scores.health,
        description:
          analysis.scores.health < 30
            ? "Repository health is critically low. High risk of technical debt accumulation."
            : analysis.scores.health < 50
            ? "Health concerns detected. Risk of maintenance issues increasing."
            : "Repository health is acceptable but could be improved.",
        mitigation:
          analysis.scores.health < 50
            ? "Improve test coverage, update dependencies, enhance documentation"
            : "Maintain current health practices",
      });

      // Churn Risk
      const churnRisk =
        analysis.scores.churn > 80
          ? "high"
          : analysis.scores.churn > 60
          ? "medium"
          : analysis.scores.churn < 20
          ? "medium"
          : "low";

      factors.push({
        category: "Stability Risk",
        level: churnRisk,
        score: Math.abs(analysis.scores.churn - 50),
        description:
          analysis.scores.churn > 80
            ? "Very high code churn. Risk of instability and breaking changes."
            : analysis.scores.churn < 20
            ? "Very low churn. Risk of stagnation and outdated code."
            : "Churn rate is balanced. Good stability.",
        mitigation:
          analysis.scores.churn > 80
            ? "Implement better testing, code review processes, and change management"
            : analysis.scores.churn < 20
            ? "Encourage regular updates and modernization"
            : "Maintain current change cadence",
      });

      // Pulse Risk
      const pulseRisk =
        analysis.scores.pulse < 20
          ? "high"
          : analysis.scores.pulse < 40
          ? "medium"
          : "low";

      factors.push({
        category: "Activity Risk",
        level: pulseRisk,
        score: 100 - analysis.scores.pulse,
        description:
          analysis.scores.pulse < 20
            ? "Very low activity. Risk of project abandonment."
            : analysis.scores.pulse < 40
            ? "Low activity. Risk of becoming unmaintained."
            : "Good activity levels. Project appears active.",
        mitigation:
          analysis.scores.pulse < 40
            ? "Increase engagement, set up regular releases, encourage contributions"
            : "Maintain current activity levels",
      });

      setRiskFactors(factors);

      // Calculate overall risk
      const riskScores = factors.map((f) => {
        const scoreMap = { critical: 4, high: 3, medium: 2, low: 1 };
        return scoreMap[f.level];
      });
      const avgScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;

      if (avgScore >= 3.5) setOverallRisk("critical");
      else if (avgScore >= 2.5) setOverallRisk("high");
      else if (avgScore >= 1.5) setOverallRisk("medium");
      else setOverallRisk("low");
    };

    assessRisks();
  }, [analysis]);

  const getRiskColor = (level: RiskFactor["level"]) => {
    const colors = {
      critical: "bg-red-500/20 text-red-300 border-red-500",
      high: "bg-orange-500/20 text-orange-300 border-orange-500",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
      low: "bg-green-500/20 text-green-300 border-green-500",
    };
    return colors[level];
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚠️</span>
        <div>
          <h3 className="text-xl font-bold">Risk Assessment</h3>
          <p className="text-sm text-zinc-400">Enterprise risk scoring</p>
        </div>
      </div>

      {/* Overall Risk */}
      <div className={`p-6 rounded-lg border-2 ${getRiskColor(overallRisk)}`}>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 capitalize">{overallRisk}</div>
          <div className="text-lg">Overall Risk Level</div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">Risk Factors</h4>
        {riskFactors.map((factor, index) => (
          <motion.div
            key={factor.category}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-l-4 ${getRiskColor(factor.level)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">{factor.category}</h5>
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 capitalize">
                {factor.level}
              </span>
            </div>
            <p className="text-sm text-zinc-300 mb-2">{factor.description}</p>
            <div className="text-xs">
              <span className="text-zinc-400">Mitigation: </span>
              <span className="text-zinc-300">{factor.mitigation}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Summary */}
      <div className="glass rounded-lg p-4 space-y-2 text-sm">
        <h4 className="text-sm font-semibold text-zinc-400">Risk Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {riskFactors.map((factor) => (
            <div key={factor.category} className="flex justify-between">
              <span className="text-zinc-400">{factor.category}:</span>
              <span className={`capitalize ${
                factor.level === "critical" ? "text-red-400" :
                factor.level === "high" ? "text-orange-400" :
                factor.level === "medium" ? "text-yellow-400" :
                "text-green-400"
              }`}>
                {factor.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-zinc-500">
        💡 Risk assessment helps identify potential issues before they become critical problems. Use this for enterprise planning and resource allocation.
      </div>
    </Card>
  );
}

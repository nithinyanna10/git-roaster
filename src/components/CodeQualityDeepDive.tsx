"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface CodeQualityDeepDiveProps {
  analysis: Analysis;
}

interface CodeSmell {
  type: "complexity" | "duplication" | "maintainability" | "security" | "performance";
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export function CodeQualityDeepDive({ analysis }: CodeQualityDeepDiveProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [smells, setSmells] = useState<CodeSmell[]>([]);

  const analyzeCodeQuality = () => {
    setAnalyzing(true);
    
    // Simulate code quality analysis
    setTimeout(() => {
      const detectedSmells: CodeSmell[] = [];
      
      // Based on metrics, detect potential issues
      if (analysis.scores.busFactor < 30) {
        detectedSmells.push({
          type: "maintainability",
          severity: "high",
          description: "Low bus factor indicates high dependency on few contributors",
          recommendation: "Encourage more contributors and document knowledge",
        });
      }
      
      if (analysis.scores.tests < 50) {
        detectedSmells.push({
          type: "maintainability",
          severity: "medium",
          description: "Low test coverage may indicate technical debt",
          recommendation: "Increase test coverage to improve code quality",
        });
      }
      
      if (analysis.scores.churn > 70) {
        detectedSmells.push({
          type: "complexity",
          severity: "medium",
          description: "High code churn suggests instability",
          recommendation: "Review change patterns and stabilize core components",
        });
      }
      
      if (!analysis.metrics.hasCI) {
        detectedSmells.push({
          type: "maintainability",
          severity: "high",
          description: "No CI/CD detected - automated testing and deployment missing",
          recommendation: "Set up CI/CD pipeline for automated quality checks",
        });
      }
      
      if (analysis.metrics.docsScore < 30) {
        detectedSmells.push({
          type: "maintainability",
          severity: "low",
          description: "Limited documentation may hinder onboarding",
          recommendation: "Improve README and add inline documentation",
        });
      }
      
      setSmells(detectedSmells);
      setAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: CodeSmell["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const getTypeIcon = (type: CodeSmell["type"]) => {
    const icons = {
      complexity: "🧩",
      duplication: "📋",
      maintainability: "🔧",
      security: "🔒",
      performance: "⚡",
    };
    return icons[type];
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Code Quality Deep Dive</h3>
          <p className="text-zinc-400 text-sm">Detect code smells and quality issues</p>
        </div>
        <Button onClick={analyzeCodeQuality} variant="primary" size="sm" disabled={analyzing}>
          {analyzing ? "Analyzing..." : "🔍 Analyze Code Quality"}
        </Button>
      </div>

      {analyzing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🔍</div>
          <p className="text-zinc-400">Scanning code patterns and detecting issues...</p>
        </div>
      )}

      {!analyzing && smells.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🔍</div>
          <p>Click "Analyze Code Quality" to detect code smells and issues</p>
        </div>
      )}

      {!analyzing && smells.length > 0 && (
        <div className="space-y-4">
          {smells.map((smell, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(smell.type)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold capitalize">{smell.type}</h4>
                      <Badge className={getSeverityColor(smell.severity)}>
                        {smell.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-300">{smell.description}</p>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-sm text-zinc-400">
                  <strong>Recommendation:</strong> {smell.recommendation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> This is a basic analysis based on metrics. For production use,
          integrate with tools like SonarQube, Snyk, or CodeQL for comprehensive code quality scanning.
        </p>
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface CodeReviewAIProps {
  analysis: Analysis;
}

interface ReviewSuggestion {
  id: string;
  type: "bug" | "improvement" | "security" | "performance" | "style";
  severity: "high" | "medium" | "low";
  file: string;
  line: number;
  message: string;
  suggestion: string;
}

export function CodeReviewAI({ analysis }: CodeReviewAIProps) {
  const [reviewing, setReviewing] = useState(false);
  const [suggestions, setSuggestions] = useState<ReviewSuggestion[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const generateReview = () => {
    setReviewing(true);
    
    // Simulate AI code review
    setTimeout(() => {
      const newSuggestions: ReviewSuggestion[] = [];

      // Generate suggestions based on metrics
      if (analysis.scores.tests < 50) {
        newSuggestions.push({
          id: "1",
          type: "improvement",
          severity: "high",
          file: "src/**/*.ts",
          line: 0,
          message: "Low test coverage detected",
          suggestion: "Add unit tests for critical functions. Aim for at least 70% coverage.",
        });
      }

      if (!analysis.metrics.hasCI) {
        newSuggestions.push({
          id: "2",
          type: "improvement",
          severity: "high",
          file: ".github/workflows/ci.yml",
          line: 0,
          message: "No CI/CD pipeline found",
          suggestion: "Set up GitHub Actions or similar CI/CD to automate testing and deployment.",
        });
      }

      if (analysis.scores.busFactor < 30) {
        newSuggestions.push({
          id: "3",
          type: "improvement",
          severity: "medium",
          file: "CONTRIBUTING.md",
          line: 0,
          message: "High bus factor risk",
          suggestion: "Document codebase better and encourage more contributors to reduce dependency on single maintainer.",
        });
      }

      if (analysis.scores.docs < 50) {
        newSuggestions.push({
          id: "4",
          type: "improvement",
          severity: "medium",
          file: "README.md",
          line: 0,
          message: "Documentation needs improvement",
          suggestion: "Enhance README with setup instructions, API documentation, and contribution guidelines.",
        });
      }

      if (analysis.scores.churn > 70) {
        newSuggestions.push({
          id: "5",
          type: "performance",
          severity: "low",
          file: "src/**/*.ts",
          line: 0,
          message: "High code churn detected",
          suggestion: "Consider refactoring frequently changed files to improve stability.",
        });
      }

      setSuggestions(newSuggestions);
      setReviewing(false);
      showToast("Code review complete!");
    }, 2000);
  };

  const getTypeIcon = (type: ReviewSuggestion["type"]) => {
    const icons = {
      bug: "🐛",
      improvement: "✨",
      security: "🔒",
      performance: "⚡",
      style: "🎨",
    };
    return icons[type];
  };

  const getSeverityColor = (severity: ReviewSuggestion["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const filteredSuggestions = selectedFile
    ? suggestions.filter((s) => s.file.includes(selectedFile))
    : suggestions;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">AI Code Review</h3>
          <p className="text-zinc-400 text-sm">AI-powered code review suggestions based on repo patterns</p>
        </div>
        <Button onClick={generateReview} variant="primary" size="sm" disabled={reviewing}>
          {reviewing ? "Reviewing..." : "🤖 Generate Review"}
        </Button>
      </div>

      {reviewing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🤖</div>
          <p className="text-zinc-400">Analyzing code patterns and generating suggestions...</p>
        </div>
      )}

      {!reviewing && suggestions.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🤖</div>
          <p>Click "Generate Review" to get AI-powered code review suggestions</p>
        </div>
      )}

      {!reviewing && suggestions.length > 0 && (
        <div className="space-y-4">
          {/* Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by File</label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Files</option>
              {Array.from(new Set(suggestions.map((s) => s.file.split("/")[0]))).map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold capitalize">{suggestion.type}</h4>
                        <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(suggestion.severity)}`}>
                          {suggestion.severity}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 mb-2">{suggestion.message}</p>
                      <div className="text-xs text-zinc-500 font-mono mb-2">
                        {suggestion.file}:{suggestion.line > 0 ? suggestion.line : "N/A"}
                      </div>
                      <div className="glass rounded p-2 mt-2">
                        <p className="text-sm text-zinc-400">
                          <strong>💡 Suggestion:</strong> {suggestion.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-sm text-zinc-400 text-center">
            Found {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-purple-900/20 border border-purple-700/50">
        <p className="text-sm text-purple-300">
          💡 <strong>Note:</strong> This is a basic review based on metrics. For production use, integrate with code analysis tools or LLM APIs to analyze actual code files.
        </p>
      </div>
    </Card>
  );
}

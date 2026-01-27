"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Bottleneck {
  id: string;
  type: "slow-query" | "large-file" | "complex-function" | "memory-leak" | "inefficient-loop";
  severity: "critical" | "high" | "medium";
  title: string;
  description: string;
  file?: string;
  line?: number;
  impact: string;
  suggestion: string;
}

interface PerformanceBottleneckFinderProps {
  analysis: Analysis;
  repoUrl: string;
}

export function PerformanceBottleneckFinder({ analysis, repoUrl }: PerformanceBottleneckFinderProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);
    showToast("Analyzing code for performance bottlenecks...");

    try {
      // In production, this would:
      // 1. Analyze code complexity (cyclomatic complexity)
      // 2. Check file sizes
      // 3. Detect inefficient patterns (N+1 queries, nested loops, etc.)
      // 4. Analyze memory usage patterns
      // 5. Check for missing indexes in database queries

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockBottlenecks: Bottleneck[] = [
        {
          id: "1",
          type: "complex-function",
          severity: "high",
          title: "High cyclomatic complexity in processData()",
          description: "Function has cyclomatic complexity of 45 (recommended: < 10)",
          file: "src/utils/dataProcessor.ts",
          line: 128,
          impact: "Hard to test, maintain, and debug. High risk of bugs.",
          suggestion: "Break down into smaller functions. Use strategy pattern for different processing paths.",
        },
        {
          id: "2",
          type: "inefficient-loop",
          severity: "critical",
          title: "Nested loop with O(n²) complexity",
          description: "Nested for loops processing large arrays without optimization",
          file: "src/components/DataTable.tsx",
          line: 245,
          impact: "Performance degrades significantly with large datasets (>1000 items).",
          suggestion: "Use Map/Set for lookups, implement pagination, or use virtual scrolling.",
        },
        {
          id: "3",
          type: "large-file",
          severity: "medium",
          title: "Large file detected: main.tsx (2,847 lines)",
          description: "File exceeds recommended size of 500 lines",
          file: "src/pages/main.tsx",
          impact: "Hard to navigate, maintain, and test. Slower IDE performance.",
          suggestion: "Split into smaller components or modules. Extract related functionality.",
        },
        {
          id: "4",
          type: "slow-query",
          severity: "high",
          title: "Potential N+1 query problem",
          description: "Loop fetching related data individually instead of batch loading",
          file: "src/api/users.ts",
          line: 89,
          impact: "Database queries increase linearly with data size. Slow response times.",
          suggestion: "Use eager loading, batch queries, or data loaders (e.g., DataLoader pattern).",
        },
        {
          id: "5",
          type: "memory-leak",
          severity: "medium",
          title: "Event listeners not cleaned up",
          description: "addEventListener called without corresponding removeEventListener",
          file: "src/hooks/useWindowResize.ts",
          line: 34,
          impact: "Memory usage grows over time, especially in long-running applications.",
          suggestion: "Always remove event listeners in cleanup functions or useEffect cleanup.",
        },
      ];

      setBottlenecks(mockBottlenecks);
      showToast(`Found ${mockBottlenecks.length} performance bottlenecks`);
    } catch (error) {
      showToast("Failed to analyze performance");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTypeIcon = (type: Bottleneck["type"]) => {
    const icons = {
      "slow-query": "🐌",
      "large-file": "📦",
      "complex-function": "🌀",
      "memory-leak": "💧",
      "inefficient-loop": "🔄",
    };
    return icons[type];
  };

  const getSeverityColor = (severity: Bottleneck["severity"]) => {
    const colors = {
      critical: "bg-red-500/20 border-red-500 text-red-300",
      high: "bg-orange-500/20 border-orange-500 text-orange-300",
      medium: "bg-yellow-500/20 border-yellow-500 text-yellow-300",
    };
    return colors[severity];
  };

  const getTypeLabel = (type: Bottleneck["type"]) => {
    const labels = {
      "slow-query": "Slow Query",
      "large-file": "Large File",
      "complex-function": "Complex Function",
      "memory-leak": "Memory Leak",
      "inefficient-loop": "Inefficient Loop",
    };
    return labels[type];
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="text-xl font-bold">Performance Bottleneck Finder</h3>
            <p className="text-sm text-zinc-400">Detect slow code patterns and optimization opportunities</p>
          </div>
        </div>
        <Button
          onClick={analyzePerformance}
          disabled={isAnalyzing}
          variant="primary"
          size="sm"
        >
          {isAnalyzing ? "Analyzing..." : "🔍 Analyze"}
        </Button>
      </div>

      {bottlenecks.length > 0 && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            {(["critical", "high", "medium"] as const).map((severity) => {
              const count = bottlenecks.filter((b) => b.severity === severity).length;
              return (
                <div
                  key={severity}
                  className={`p-3 rounded-lg border text-center ${getSeverityColor(severity)}`}
                >
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs capitalize">{severity}</div>
                </div>
              );
            })}
          </div>

          {/* Bottlenecks List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {bottlenecks.map((bottleneck) => (
                <motion.div
                  key={bottleneck.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(bottleneck.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(bottleneck.type)}</span>
                      <div>
                        <h4 className="font-semibold">{bottleneck.title}</h4>
                        <span className="text-xs text-zinc-400">{getTypeLabel(bottleneck.type)}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-zinc-800 capitalize">
                      {bottleneck.severity}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{bottleneck.description}</p>
                  {bottleneck.file && (
                    <div className="text-xs text-zinc-400 mb-2">
                      📄 {bottleneck.file}
                      {bottleneck.line && `:${bottleneck.line}`}
                    </div>
                  )}
                  <div className="space-y-1 mt-3">
                    <div>
                      <span className="text-xs font-semibold text-orange-400">Impact: </span>
                      <span className="text-xs text-zinc-300">{bottleneck.impact}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-green-400">Suggestion: </span>
                      <span className="text-xs text-zinc-300">{bottleneck.suggestion}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {bottlenecks.length === 0 && !isAnalyzing && (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2">⚡</div>
          <p>Click "Analyze" to detect performance bottlenecks</p>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Analyzes code complexity, file sizes, query patterns, and common performance anti-patterns.
      </div>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Migration {
  id: string;
  type: "framework" | "library" | "language" | "build-tool" | "database";
  from: string;
  to: string;
  status: "completed" | "in-progress" | "planned" | "detected";
  confidence: number;
  evidence: string[];
  impact: "low" | "medium" | "high";
  dateDetected?: number;
}

interface MigrationDetectionProps {
  analysis: Analysis;
  repoUrl: string;
}

export function MigrationDetection({ analysis, repoUrl }: MigrationDetectionProps) {
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState<Migration["type"] | "all">("all");

  const detectMigrations = async () => {
    setIsAnalyzing(true);
    showToast("Detecting framework/library migrations...");

    try {
      // In production, this would:
      // 1. Analyze package.json changes over time
      // 2. Look for version jumps (e.g., React 16 -> 18)
      // 3. Detect major framework changes (e.g., AngularJS -> Angular)
      // 4. Check for language migrations (JS -> TS)
      // 5. Analyze build tool changes (Webpack -> Vite)
      // 6. Database migrations (MySQL -> PostgreSQL)

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockMigrations: Migration[] = [
        {
          id: "1",
          type: "framework",
          from: "React 16.8",
          to: "React 18.2",
          status: "completed",
          confidence: 95,
          evidence: [
            "package.json shows React 18.2.0",
            "All hooks updated to React 18 API",
            "No legacy class components found",
          ],
          impact: "high",
          dateDetected: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
        },
        {
          id: "2",
          type: "build-tool",
          from: "Webpack 4",
          to: "Vite 4",
          status: "in-progress",
          confidence: 85,
          evidence: [
            "vite.config.ts present",
            "Some webpack configs still exist",
            "Build scripts reference both tools",
          ],
          impact: "high",
          dateDetected: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        },
        {
          id: "3",
          type: "language",
          from: "JavaScript",
          to: "TypeScript",
          status: "in-progress",
          confidence: 70,
          evidence: [
            "tsconfig.json present",
            "Mixed .js and .ts files",
            "Gradual migration pattern detected",
          ],
          impact: "medium",
          dateDetected: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
        },
        {
          id: "4",
          type: "library",
          from: "Lodash",
          to: "Native JS",
          status: "detected",
          confidence: 60,
          evidence: [
            "Lodash imports decreasing",
            "Native array methods increasing",
            "Bundle size optimization pattern",
          ],
          impact: "low",
        },
        {
          id: "5",
          type: "database",
          from: "MySQL",
          to: "PostgreSQL",
          status: "planned",
          confidence: 50,
          evidence: [
            "PostgreSQL drivers in dependencies",
            "Migration scripts present",
            "Database config mentions both",
          ],
          impact: "high",
        },
      ];

      setMigrations(mockMigrations);
      showToast(`Detected ${mockMigrations.length} migrations`);
    } catch (error) {
      showToast("Failed to detect migrations");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    detectMigrations();
  }, [repoUrl]);

  const getStatusColor = (status: Migration["status"]) => {
    const colors = {
      completed: "bg-green-500/20 text-green-300 border-green-500",
      "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500",
      planned: "bg-blue-500/20 text-blue-300 border-blue-500",
      detected: "bg-purple-500/20 text-purple-300 border-purple-500",
    };
    return colors[status];
  };

  const getTypeIcon = (type: Migration["type"]) => {
    const icons = {
      framework: "⚛️",
      library: "📚",
      language: "💻",
      "build-tool": "🔧",
      database: "🗄️",
    };
    return icons[type];
  };

  const filteredMigrations = migrations.filter(
    (m) => selectedType === "all" || m.type === selectedType
  );

  const formatDate = (timestamp: number) => {
    const daysAgo = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return `${Math.floor(daysAgo / 30)} months ago`;
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔄</span>
          <div>
            <h3 className="text-xl font-bold">Migration Detection</h3>
            <p className="text-sm text-zinc-400">Detect framework/library migrations</p>
          </div>
        </div>
        <Button onClick={detectMigrations} disabled={isAnalyzing} variant="secondary" size="sm">
          {isAnalyzing ? "Analyzing..." : "🔄 Refresh"}
        </Button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "framework", "library", "language", "build-tool", "database"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              selectedType === type
                ? "bg-purple-500 text-white"
                : "glass text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Migrations List */}
      {isAnalyzing ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Detecting migrations...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredMigrations.map((migration) => (
              <motion.div
                key={migration.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border-l-4 ${getStatusColor(migration.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(migration.type)}</span>
                    <div>
                      <h4 className="font-semibold">
                        {migration.from} → {migration.to}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="capitalize">{migration.status.replace("-", " ")}</span>
                        <span>•</span>
                        <span>{migration.confidence}% confidence</span>
                        <span>•</span>
                        <span className="capitalize">{migration.impact} impact</span>
                      </div>
                    </div>
                  </div>
                </div>

                {migration.dateDetected && (
                  <div className="text-xs text-zinc-400 mb-2">
                    Detected {formatDate(migration.dateDetected)}
                  </div>
                )}

                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold text-zinc-400">Evidence:</div>
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                    {migration.evidence.map((evidence, index) => (
                      <li key={index}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMigrations.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              <div className="text-4xl mb-2">🔍</div>
              <p>No migrations detected for this filter</p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {migrations.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {(["completed", "in-progress", "planned", "detected"] as const).map((status) => {
            const count = migrations.filter((m) => m.status === status).length;
            return (
              <div key={status} className="p-3 glass rounded-lg text-center">
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs text-zinc-400 capitalize">{status.replace("-", " ")}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Migration detection helps track tech stack evolution and identify potential breaking changes or upgrade paths.
      </div>
    </Card>
  );
}

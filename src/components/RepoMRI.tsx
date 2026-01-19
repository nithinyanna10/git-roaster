"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";

const MRI_SECTIONS = [
  { key: "pulse", label: "Pulse", color: "#8b5cf6" },
  { key: "churn", label: "Churn", color: "#ec4899" },
  { key: "issues", label: "Issues", color: "#f59e0b" },
  { key: "prs", label: "PRs", color: "#06b6d4" },
  { key: "releases", label: "Releases", color: "#10b981" },
  { key: "ci", label: "CI/Tests", color: "#3b82f6" },
  { key: "docs", label: "Docs", color: "#a855f7" },
  { key: "momentum", label: "Momentum", color: "#fbbf24" },
];

interface RepoMRIProps {
  analysis: Analysis;
}

export function RepoMRI({ analysis }: RepoMRIProps) {
  const { selectedMRISection, setSelectedMRISection, reduceMotion } = useAppStore();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const getScore = (key: string): number => {
    const scores: Record<string, number> = {
      pulse: analysis.scores.pulse,
      churn: analysis.scores.churn,
      issues: analysis.scores.issues,
      prs: analysis.scores.prs,
      releases: analysis.scores.releases,
      ci: (analysis.scores.ci + analysis.scores.tests) / 2,
      docs: analysis.scores.docs,
      momentum: analysis.scores.momentum,
    };
    return scores[key] || 0;
  };

  const getExplanation = (key: string): string => {
    const explanations: Record<string, string> = {
      pulse: `Activity score based on ${analysis.metrics.commits30d} commits (30d) and ${analysis.metrics.daysSinceLastCommit} days since last commit`,
      churn: `Stability score: ${analysis.metrics.churn30d.toLocaleString()} lines changed (30d)`,
      issues: `Issue health: ${analysis.metrics.issuesOpened30d} opened, ${analysis.metrics.issuesClosed30d} closed, ${analysis.metrics.medianIssueFirstResponseHours}h response time`,
      prs: `PR metrics: ${analysis.metrics.prsMerged30d}/${analysis.metrics.prsOpened30d} merged, ${(analysis.metrics.prMergeRate * 100).toFixed(0)}% merge rate`,
      releases: `${analysis.metrics.releasesCount} releases, last ${analysis.metrics.lastReleaseDays || "never"} days ago`,
      ci: `${analysis.metrics.hasCI ? "CI" : "No CI"} detected, ${analysis.metrics.hasTests ? "tests" : "no tests"} present`,
      docs: `Documentation score: ${analysis.scores.docs}/100`,
      momentum: `${analysis.verdicts.momentum} momentum with ${analysis.metrics.stars30d} stars (30d)`,
    };
    return explanations[key] || "";
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 snap-start relative z-10 py-20">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Repo MRI</h2>
          <p className="text-zinc-400">Interactive health scan. Hover rings to explore.</p>
        </div>

        <Card className="relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* MRI Visualization */}
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Center Orb */}
                <circle cx="100" cy="100" r="30" fill="url(#orbGradient)" opacity="0.8">
                  <animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite" />
                </circle>
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  className="text-2xl font-bold fill-white"
                  fontSize="24"
                >
                  {analysis.scores.vibeTotal}
                </text>

                {/* Rings */}
                {MRI_SECTIONS.map((section, index) => {
                  const angle = (index / MRI_SECTIONS.length) * Math.PI * 2;
                  const radius = 60;
                  const x = 100 + Math.cos(angle) * radius;
                  const y = 100 + Math.sin(angle) * radius;
                  const score = getScore(section.key);
                  const isHovered = hoveredSection === section.key;
                  const isSelected = selectedMRISection === section.key;

                  return (
                    <g key={section.key}>
                      {/* Ring Segment */}
                      <path
                        d={`M 100 100 L ${x} ${y} A ${radius} ${radius} 0 0 1 ${
                          100 + Math.cos(angle + (Math.PI * 2) / MRI_SECTIONS.length) * radius
                        } ${100 + Math.sin(angle + (Math.PI * 2) / MRI_SECTIONS.length) * radius} Z`}
                        fill={section.color}
                        opacity={isHovered || isSelected ? 0.8 : score / 100}
                        onMouseEnter={() => setHoveredSection(section.key)}
                        onMouseLeave={() => setHoveredSection(null)}
                        onClick={() => setSelectedMRISection(isSelected ? null : section.key)}
                        style={{ cursor: "pointer" }}
                      />
                      {/* Label */}
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-white pointer-events-none"
                        fontSize="10"
                      >
                        {section.label}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Explanation Panel */}
            {(hoveredSection || selectedMRISection) && (
              <motion.div
                className="flex-1 glass rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {MRI_SECTIONS.find((s) => s.key === (hoveredSection || selectedMRISection))?.label}
                </h3>
                <div className="text-3xl font-bold mb-2" style={{
                  color: MRI_SECTIONS.find((s) => s.key === (hoveredSection || selectedMRISection))?.color
                }}>
                  {getScore(hoveredSection || selectedMRISection || "")}/100
                </div>
                <p className="text-sm text-zinc-400">
                  {getExplanation(hoveredSection || selectedMRISection || "")}
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

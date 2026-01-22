"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

interface AdvancedVisualizationsProps {
  analysis: Analysis;
}

export function AdvancedVisualizations({ analysis }: AdvancedVisualizationsProps) {
  const [activeTab, setActiveTab] = useState<"heatmap" | "correlation" | "flow">("heatmap");

  // Generate correlation matrix data
  const correlationData = [
    { metric: "Pulse", pulse: 1, churn: -0.3, busFactor: 0.5, tests: 0.4, releases: 0.6, docs: 0.2 },
    { metric: "Churn", pulse: -0.3, churn: 1, busFactor: -0.2, tests: -0.1, releases: -0.4, docs: -0.1 },
    { metric: "Bus Factor", pulse: 0.5, churn: -0.2, busFactor: 1, tests: 0.3, releases: 0.4, docs: 0.2 },
    { metric: "Tests", pulse: 0.4, churn: -0.1, busFactor: 0.3, tests: 1, releases: 0.5, docs: 0.6 },
    { metric: "Releases", pulse: 0.6, churn: -0.4, busFactor: 0.4, tests: 0.5, releases: 1, docs: 0.3 },
    { metric: "Docs", pulse: 0.2, churn: -0.1, busFactor: 0.2, tests: 0.6, releases: 0.3, docs: 1 },
  ];

  // Generate heat map data (file activity over time)
  const heatmapData = Array.from({ length: 12 }, (_, month) => ({
    month: new Date(2024, month).toLocaleDateString("en-US", { month: "short" }),
    high: Math.floor(Math.random() * 30) + 20,
    medium: Math.floor(Math.random() * 30) + 10,
    low: Math.floor(Math.random() * 20) + 5,
  }));

  // Generate flow diagram data (contributor flow)
  const flowData = [
    { name: "Core Team", value: analysis.scores.busFactor * 0.8, color: "#8b5cf6" },
    { name: "Contributors", value: analysis.scores.busFactor * 0.5, color: "#ec4899" },
    { name: "Casual", value: analysis.scores.busFactor * 0.3, color: "#06b6d4" },
  ];

  const getCorrelationColor = (value: number) => {
    if (value > 0.5) return "#10b981"; // Green
    if (value > 0) return "#3b82f6"; // Blue
    if (value > -0.5) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Advanced Visualizations</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setActiveTab("heatmap")}
            variant={activeTab === "heatmap" ? "primary" : "secondary"}
            size="sm"
          >
            🔥 Heat Map
          </Button>
          <Button
            onClick={() => setActiveTab("correlation")}
            variant={activeTab === "correlation" ? "primary" : "secondary"}
            size="sm"
          >
            📊 Correlation Matrix
          </Button>
          <Button
            onClick={() => setActiveTab("flow")}
            variant={activeTab === "flow" ? "primary" : "secondary"}
            size="sm"
          >
            🌊 Flow Diagram
          </Button>
        </div>
      </div>

      {activeTab === "heatmap" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="font-bold text-lg">Activity Heat Map (Last 12 Months)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Activity" />
              <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium Activity" />
              <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Activity" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {activeTab === "correlation" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="font-bold text-lg">Metric Correlation Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-zinc-700">Metric</th>
                  <th className="text-center p-2 border-b border-zinc-700">Pulse</th>
                  <th className="text-center p-2 border-b border-zinc-700">Churn</th>
                  <th className="text-center p-2 border-b border-zinc-700">Bus Factor</th>
                  <th className="text-center p-2 border-b border-zinc-700">Tests</th>
                  <th className="text-center p-2 border-b border-zinc-700">Releases</th>
                  <th className="text-center p-2 border-b border-zinc-700">Docs</th>
                </tr>
              </thead>
              <tbody>
                {correlationData.map((row) => (
                  <tr key={row.metric} className="border-b border-zinc-800">
                    <td className="p-2 font-medium">{row.metric}</td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.pulse) + "20",
                          color: getCorrelationColor(row.pulse),
                        }}
                      >
                        {row.pulse.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.churn) + "20",
                          color: getCorrelationColor(row.churn),
                        }}
                      >
                        {row.churn.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.busFactor) + "20",
                          color: getCorrelationColor(row.busFactor),
                        }}
                      >
                        {row.busFactor.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.tests) + "20",
                          color: getCorrelationColor(row.tests),
                        }}
                      >
                        {row.tests.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.releases) + "20",
                          color: getCorrelationColor(row.releases),
                        }}
                      >
                        {row.releases.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: getCorrelationColor(row.docs) + "20",
                          color: getCorrelationColor(row.docs),
                        }}
                      >
                        {row.docs.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Values range from -1 (strong negative correlation) to +1 (strong positive correlation)
          </p>
        </motion.div>
      )}

      {activeTab === "flow" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="font-bold text-lg">Contributor Flow</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={flowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6">
                {flowData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </Card>
  );
}

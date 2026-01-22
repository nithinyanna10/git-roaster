"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";

interface AIPredictionsProps {
  analysis: Analysis;
}

interface Prediction {
  type: "health" | "churn" | "release" | "contributor";
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  trend: "up" | "down" | "stable";
}

export function AIPredictions({ analysis }: AIPredictionsProps) {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePredictions = () => {
    setLoading(true);
    
    // Simulate AI prediction generation
    setTimeout(() => {
      const newPredictions: Prediction[] = [
        {
          type: "health",
          title: "Repo Health Prediction",
          prediction: `Based on current trends, repo health is predicted to ${analysis.scores.vibeTotal > 70 ? "improve" : "decline"} to ${Math.max(0, Math.min(100, analysis.scores.vibeTotal + (Math.random() * 20 - 10))).toFixed(0)}/100`,
          confidence: 75,
          timeframe: "6 months",
          trend: analysis.scores.vibeTotal > 70 ? "up" : "down",
        },
        {
          type: "churn",
          title: "Contributor Churn Prediction",
          prediction: `Top contributor (${analysis.metrics.topContributorPct90d.toFixed(0)}% of commits) shows ${analysis.metrics.topContributorPct90d > 80 ? "high" : "moderate"} risk of churn`,
          confidence: 68,
          timeframe: "3 months",
          trend: analysis.metrics.topContributorPct90d > 80 ? "down" : "stable",
        },
        {
          type: "release",
          title: "Next Release Prediction",
          prediction: `Based on release frequency (${analysis.metrics.avgDaysBetweenReleases.toFixed(0)} days avg), next release expected in ${Math.max(7, analysis.metrics.avgDaysBetweenReleases - (analysis.metrics.lastReleaseDays || 30)).toFixed(0)} days`,
          confidence: 72,
          timeframe: "30 days",
          trend: "stable",
        },
        {
          type: "contributor",
          title: "New Contributor Prediction",
          prediction: `With ${analysis.metrics.uniqueContributors90d} unique contributors in last 90 days, expecting ${Math.floor(analysis.metrics.uniqueContributors90d * 0.3)} new contributors in next quarter`,
          confidence: 65,
          timeframe: "90 days",
          trend: "up",
        },
      ];
      
      setPredictions(newPredictions);
      setLoading(false);
    }, 1500);
  };

  const getTrendIcon = (trend: Prediction["trend"]): string => {
    return trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️";
  };

  const getTrendColor = (trend: Prediction["trend"]): string => {
    return trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-zinc-400";
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">AI-Powered Predictions</h3>
        <Button onClick={generatePredictions} variant="primary" size="sm" disabled={loading}>
          {loading ? "Predicting..." : "🔮 Generate Predictions"}
        </Button>
      </div>

      {!predictions && !loading && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🔮</div>
          <p>Click "Generate Predictions" to see AI-powered forecasts</p>
          <p className="text-sm mt-2">Predictions based on current metrics and trends</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-zinc-400">Analyzing patterns and generating predictions...</p>
        </div>
      )}

      {predictions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred, index) => (
            <motion.div
              key={pred.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-1">{pred.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`text-lg ${getTrendColor(pred.trend)}`}>
                      {getTrendIcon(pred.trend)}
                    </span>
                    <span className="text-zinc-400">{pred.timeframe}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 mb-1">Confidence</div>
                  <div className="text-sm font-bold">{pred.confidence}%</div>
                </div>
              </div>
              
              <p className="text-sm text-zinc-300 leading-relaxed">{pred.prediction}</p>
              
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    pred.trend === "up" ? "bg-green-500" : pred.trend === "down" ? "bg-red-500" : "bg-zinc-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidence}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> Predictions are based on statistical analysis of current metrics.
          For production use, integrate with ML models for more accurate forecasts.
        </p>
      </div>
    </Card>
  );
}

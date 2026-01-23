"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SentimentAnalysisProps {
  analysis: Analysis;
}

interface SentimentData {
  sentiment: "positive" | "neutral" | "negative";
  count: number;
  percentage: number;
}

export function SentimentAnalysis({ analysis }: SentimentAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);

  const analyzeSentiment = () => {
    setAnalyzing(true);
    
    // Simulate sentiment analysis based on metrics
    setTimeout(() => {
      // Generate sentiment data based on repo health
      const isHealthy = analysis.scores.vibeTotal >= 70;
      const isStruggling = analysis.scores.vibeTotal < 50;
      
      const data: SentimentData[] = [
        {
          sentiment: "positive",
          count: isHealthy ? 65 : isStruggling ? 20 : 40,
          percentage: isHealthy ? 65 : isStruggling ? 20 : 40,
        },
        {
          sentiment: "neutral",
          count: isHealthy ? 25 : isStruggling ? 30 : 35,
          percentage: isHealthy ? 25 : isStruggling ? 30 : 35,
        },
        {
          sentiment: "negative",
          count: isHealthy ? 10 : isStruggling ? 50 : 25,
          percentage: isHealthy ? 10 : isStruggling ? 50 : 25,
        },
      ];
      
      setSentimentData(data);
      setOverallSentiment(
        isHealthy ? "positive" : isStruggling ? "negative" : "neutral"
      );
      setAnalyzing(false);
    }, 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#10b981";
      case "neutral":
        return "#f59e0b";
      case "negative":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "neutral":
        return "😐";
      case "negative":
        return "😟";
      default:
        return "❓";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Emotional Sentiment Analysis</h3>
          <p className="text-zinc-400 text-sm">Analyze commit messages and communication patterns</p>
        </div>
        <Button onClick={analyzeSentiment} variant="primary" size="sm" disabled={analyzing}>
          {analyzing ? "Analyzing..." : "🧠 Analyze Sentiment"}
        </Button>
      </div>

      {analyzing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🧠</div>
          <p className="text-zinc-400">Analyzing commit messages and communication patterns...</p>
        </div>
      )}

      {!analyzing && sentimentData.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-6xl mb-4">🧠</div>
          <p>Click "Analyze Sentiment" to analyze emotional patterns</p>
        </div>
      )}

      {!analyzing && sentimentData.length > 0 && (
        <div className="space-y-6">
          {overallSentiment && (
            <div className="text-center">
              <div className="text-6xl mb-4">{getSentimentEmoji(overallSentiment)}</div>
              <h4 className="text-2xl font-bold mb-2 capitalize">Overall Sentiment: {overallSentiment}</h4>
              <p className="text-zinc-400">
                Based on commit messages and communication patterns
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="sentiment" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="percentage" fill="#8b5cf6">
                {sentimentData.map((entry, index) => (
                  <Bar key={index} dataKey="percentage" fill={getSentimentColor(entry.sentiment)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4">
            {sentimentData.map((data, index) => (
              <motion.div
                key={data.sentiment}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg p-4 text-center"
              >
                <div className="text-3xl mb-2">{getSentimentEmoji(data.sentiment)}</div>
                <div className="text-2xl font-bold mb-1">{data.percentage}%</div>
                <div className="text-sm text-zinc-400 capitalize">{data.sentiment}</div>
                <div className="text-xs text-zinc-500 mt-1">{data.count} instances</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 glass rounded-lg p-4 bg-purple-900/20 border border-purple-700/50">
        <p className="text-sm text-purple-300">
          💡 <strong>Note:</strong> Sentiment analysis is simulated based on repo health metrics.
          For production use, integrate with NLP models to analyze actual commit messages and PR discussions.
        </p>
      </div>
    </Card>
  );
}

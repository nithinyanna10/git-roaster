"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface AskYourRepoProps {
  analysis: Analysis;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function AskYourRepo({ analysis }: AskYourRepoProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuery = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response based on query
    setTimeout(() => {
      const response = generateResponse(input, analysis);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (query: string, analysis: Analysis): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("most active") || lowerQuery.includes("active week")) {
      return `Based on the analysis, this repository had ${analysis.metrics.commits90d} commits in the last 90 days, with an average of ${Math.floor(analysis.metrics.commits90d / 12)} commits per week. The most active period would be when the commit trend was ${analysis.metrics.commitsTrend}.`;
    }

    if (lowerQuery.includes("contributor") || lowerQuery.includes("who")) {
      return `The repository has ${analysis.metrics.uniqueContributors90d} unique contributors in the last 90 days. The top contributor accounts for ${analysis.metrics.topContributorPct90d.toFixed(1)}% of commits, which indicates ${analysis.scores.busFactor < 30 ? "a high bus factor risk" : "good contributor distribution"}.`;
    }

    if (lowerQuery.includes("security") || lowerQuery.includes("vulnerability")) {
      return `Security analysis shows: ${analysis.metrics.hasCI ? "CI/CD is configured" : "No CI/CD detected"}, ${analysis.metrics.hasTests ? "tests are present" : "limited test coverage"}. The risk level is ${analysis.verdicts.riskLevel.toLowerCase()}. For detailed security scanning, integrate with tools like Snyk or CodeQL.`;
    }

    if (lowerQuery.includes("health") || lowerQuery.includes("vibe")) {
      return `The repository has a vibe score of ${analysis.scores.vibeTotal}/100, indicating ${analysis.scores.vibeTotal >= 70 ? "excellent" : analysis.scores.vibeTotal >= 50 ? "good" : "needs improvement"} health. Operations are ${analysis.verdicts.opsHealth.toLowerCase()} with ${analysis.verdicts.momentum.toLowerCase()} momentum.`;
    }

    if (lowerQuery.includes("release") || lowerQuery.includes("version")) {
      return `The repository has ${analysis.metrics.releasesCount} releases. ${analysis.metrics.lastReleaseDays ? `Last release was ${analysis.metrics.lastReleaseDays} days ago.` : "No recent releases."} Average time between releases: ${analysis.metrics.avgDaysBetweenReleases.toFixed(0)} days.`;
    }

    if (lowerQuery.includes("test") || lowerQuery.includes("coverage")) {
      return `${analysis.metrics.hasTests ? "Tests are present" : "No tests detected"}. Test signal score: ${analysis.metrics.testsSignalScore}/100. ${analysis.metrics.hasCI ? `${analysis.metrics.ciWorkflowsCount} CI workflows detected.` : "No CI/CD workflows found."}`;
    }

    // Default response
    return `Based on the analysis of ${analysis.repo.fullName}, I can tell you that it has a vibe score of ${analysis.scores.vibeTotal}/100, ${analysis.metrics.commits90d} commits in the last 90 days, and ${analysis.metrics.uniqueContributors90d} contributors. The repository is ${analysis.verdicts.opsHealth.toLowerCase()} with ${analysis.verdicts.momentum.toLowerCase()} momentum. How can I help you learn more about this repository?`;
  };

  const exampleQueries = [
    "When did we have the most active week?",
    "Which contributor has the highest code quality?",
    "Show me all security-related commits",
    "What's the repository health?",
    "How many releases do we have?",
  ];

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Ask Your Repo</h3>
        <p className="text-zinc-400 text-sm">Chat interface to query repo data in plain English</p>
      </div>

      <div className="space-y-4">
        {/* Example Queries */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setInput(query)}
                className="px-3 py-1 rounded-lg glass border border-zinc-700 text-xs text-zinc-300 hover:border-purple-500 transition-all"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 glass rounded-lg">
          {messages.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              <div className="text-6xl mb-4">💬</div>
              <p>Ask me anything about this repository!</p>
              <p className="text-sm mt-2">Try the example queries above or type your own question.</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "glass border border-zinc-700 text-zinc-300"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleQuery()}
            placeholder="Ask anything about this repository..."
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button onClick={handleQuery} variant="primary" size="sm" disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </div>

      <div className="mt-4 glass rounded-lg p-4 bg-purple-900/20 border border-purple-700/50">
        <p className="text-sm text-purple-300">
          💡 <strong>Note:</strong> This is a basic implementation. For production use, integrate with LLM APIs (GPT-4, Claude, Gemini) for more intelligent responses.
        </p>
      </div>
    </Card>
  );
}

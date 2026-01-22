"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { showToast } from "./Toasts";

interface LiveEvent {
  id: string;
  type: "commit" | "pr" | "issue" | "release" | "star";
  message: string;
  timestamp: number;
  author?: string;
  url?: string;
}

interface LiveMonitoringProps {
  analysis: Analysis | null;
  repoUrl: string;
}

export function LiveMonitoring({ analysis, repoUrl }: LiveMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMonitoring && repoUrl) {
      // Simulate live updates (in production, this would use WebSocket)
      intervalRef.current = setInterval(() => {
        // Simulate random events
        const eventTypes: LiveEvent["type"][] = ["commit", "pr", "issue", "star"];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const newEvent: LiveEvent = {
          id: Date.now().toString(),
          type: randomType,
          message: getEventMessage(randomType),
          timestamp: Date.now(),
          author: "simulated-user",
        };

        setEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50
        setLastUpdate(new Date());
      }, 5000); // Update every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isMonitoring, repoUrl]);

  const getEventMessage = (type: LiveEvent["type"]): string => {
    const messages = {
      commit: "New commit pushed",
      pr: "Pull request opened",
      issue: "Issue created",
      release: "New release published",
      star: "Repository starred",
    };
    return messages[type];
  };

  const getEventIcon = (type: LiveEvent["type"]): string => {
    const icons = {
      commit: "💾",
      pr: "🔀",
      issue: "🐛",
      release: "🚀",
      star: "⭐",
    };
    return icons[type];
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      showToast("Live monitoring started");
    } else {
      showToast("Live monitoring stopped");
    }
  };

  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">Live Monitoring</h3>
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
        </div>
        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded-lg border transition-all ${
            isMonitoring
              ? "border-red-500 bg-red-500/20 text-red-300"
              : "border-green-500 bg-green-500/20 text-green-300"
          }`}
        >
          {isMonitoring ? "Stop" : "Start"} Monitoring
        </button>
      </div>

      {isMonitoring && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 glass rounded-lg"
              >
                <span className="text-2xl">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{event.message}</div>
                  <div className="text-xs text-zinc-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-8">
              Waiting for events... (Simulated updates every 5 seconds)
            </p>
          )}
        </div>
      )}

      {!isMonitoring && (
        <div className="text-zinc-400 text-sm text-center py-8">
          Click "Start Monitoring" to watch for live repository events
        </div>
      )}

      {lastUpdate && isMonitoring && (
        <div className="mt-4 text-xs text-zinc-500 text-center">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </Card>
  );
}

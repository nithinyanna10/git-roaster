"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

interface ScheduledScan {
  id: string;
  repoUrl: string;
  repoName: string;
  frequency: "daily" | "weekly" | "monthly";
  mode: "roast" | "praise" | "audit" | "investor";
  enabled: boolean;
  lastRun: number | null;
  nextRun: number;
}

interface ChangeAlert {
  id: string;
  repoUrl: string;
  metric: string;
  threshold: number;
  direction: "above" | "below";
  triggered: boolean;
  lastTriggered: number | null;
}

interface TrendAlert {
  id: string;
  repoUrl: string;
  message: string;
  severity: "info" | "warning" | "critical";
  timestamp: number;
}

interface ContinuousAnalysisProps {
  analysis: Analysis | null;
  repoUrl: string;
}

export function ContinuousAnalysis({ analysis, repoUrl }: ContinuousAnalysisProps) {
  const [scheduledScans, setScheduledScans] = useState<ScheduledScan[]>([]);
  const [changeAlerts, setChangeAlerts] = useState<ChangeAlert[]>([]);
  const [trendAlerts, setTrendAlerts] = useState<TrendAlert[]>([]);
  const [showAddScan, setShowAddScan] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newScan, setNewScan] = useState({
    frequency: "weekly" as ScheduledScan["frequency"],
    mode: "roast" as ScheduledScan["mode"],
  });
  const [newAlert, setNewAlert] = useState({
    metric: "vibeScore",
    threshold: 50,
    direction: "below" as ChangeAlert["direction"],
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedScans = localStorage.getItem("gitRoaster_scheduledScans");
    const savedAlerts = localStorage.getItem("gitRoaster_changeAlerts");
    const savedTrendAlerts = localStorage.getItem("gitRoaster_trendAlerts");

    if (savedScans) setScheduledScans(JSON.parse(savedScans));
    if (savedAlerts) setChangeAlerts(JSON.parse(savedAlerts));
    if (savedTrendAlerts) setTrendAlerts(JSON.parse(savedTrendAlerts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("gitRoaster_scheduledScans", JSON.stringify(scheduledScans));
  }, [scheduledScans]);

  useEffect(() => {
    localStorage.setItem("gitRoaster_changeAlerts", JSON.stringify(changeAlerts));
  }, [changeAlerts]);

  useEffect(() => {
    localStorage.setItem("gitRoaster_trendAlerts", JSON.stringify(trendAlerts));
  }, [trendAlerts]);

  // Check for scheduled scans
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      
      // Check scheduled scans
      setScheduledScans((scans) =>
        scans.map((scan) => {
          if (scan.enabled && scan.nextRun <= now) {
            // Trigger scan (in production, this would call API)
            showToast(`Scheduled scan triggered for ${scan.repoName}`);
            const nextRun = calculateNextRun(scan.frequency, now);
            return { ...scan, lastRun: now, nextRun };
          }
          return scan;
        })
      );

      // Check change alerts
      if (analysis) {
        setChangeAlerts((alerts) =>
          alerts.map((alert) => {
            if (alert.repoUrl === repoUrl) {
              const metricValue = getMetricValue(analysis, alert.metric);
              const shouldTrigger =
                (alert.direction === "above" && metricValue >= alert.threshold) ||
                (alert.direction === "below" && metricValue <= alert.threshold);

              if (shouldTrigger && !alert.triggered) {
                const newTrendAlert: TrendAlert = {
                  id: Date.now().toString(),
                  repoUrl: alert.repoUrl,
                  message: `${alert.metric} is ${alert.direction === "above" ? "above" : "below"} threshold (${alert.threshold})`,
                  severity: "warning",
                  timestamp: now,
                };
                setTrendAlerts((prev) => [newTrendAlert, ...prev].slice(0, 50));
                showToast(`Alert: ${newTrendAlert.message}`);
                return { ...alert, triggered: true, lastTriggered: now };
              }
              return alert;
            }
            return alert;
          })
        );
      }
    }, 60000); // Check every minute

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [analysis, repoUrl]);

  const calculateNextRun = (frequency: ScheduledScan["frequency"], from: number): number => {
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const month = 30 * day;

    switch (frequency) {
      case "daily":
        return from + day;
      case "weekly":
        return from + week;
      case "monthly":
        return from + month;
    }
  };

  const getMetricValue = (analysis: Analysis, metric: string): number => {
    const metricMap: Record<string, number> = {
      vibeScore: analysis.scores.vibe,
      healthScore: analysis.scores.health,
      pulseScore: analysis.scores.pulse,
      churnScore: analysis.scores.churn,
      busFactorScore: analysis.scores.busFactor,
    };
    return metricMap[metric] || 0;
  };

  const addScheduledScan = () => {
    if (!repoUrl || !analysis) {
      showToast("Please analyze a repository first");
      return;
    }

    const scan: ScheduledScan = {
      id: Date.now().toString(),
      repoUrl,
      repoName: analysis.repo.fullName,
      frequency: newScan.frequency,
      mode: newScan.mode,
      enabled: true,
      lastRun: null,
      nextRun: calculateNextRun(newScan.frequency, Date.now()),
    };

    setScheduledScans((prev) => [...prev, scan]);
    setShowAddScan(false);
    showToast("Scheduled scan added!");
  };

  const addChangeAlert = () => {
    if (!repoUrl || !analysis) {
      showToast("Please analyze a repository first");
      return;
    }

    const alert: ChangeAlert = {
      id: Date.now().toString(),
      repoUrl,
      metric: newAlert.metric,
      threshold: newAlert.threshold,
      direction: newAlert.direction,
      triggered: false,
      lastTriggered: null,
    };

    setChangeAlerts((prev) => [...prev, alert]);
    setShowAddAlert(false);
    showToast("Change alert added!");
  };

  const toggleScan = (id: string) => {
    setScheduledScans((scans) =>
      scans.map((scan) => (scan.id === id ? { ...scan, enabled: !scan.enabled } : scan))
    );
  };

  const removeScan = (id: string) => {
    setScheduledScans((scans) => scans.filter((scan) => scan.id !== id));
    showToast("Scheduled scan removed");
  };

  const removeAlert = (id: string) => {
    setChangeAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    showToast("Change alert removed");
  };

  const removeTrendAlert = (id: string) => {
    setTrendAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Continuous Analysis</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddScan(true)} size="sm" variant="secondary">
            + Schedule Scan
          </Button>
          <Button onClick={() => setShowAddAlert(true)} size="sm" variant="secondary">
            + Add Alert
          </Button>
        </div>
      </div>

      {/* Scheduled Scans */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-400 mb-3">Scheduled Scans</h4>
        <div className="space-y-2">
          <AnimatePresence>
            {scheduledScans
              .filter((scan) => scan.repoUrl === repoUrl)
              .map((scan) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Toggle
                      checked={scan.enabled}
                      onChange={() => toggleScan(scan.id)}
                    />
                    <div>
                      <div className="font-medium">{scan.repoName}</div>
                      <div className="text-xs text-zinc-400">
                        {scan.frequency} • {scan.mode} • Next: {formatDate(scan.nextRun)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeScan(scan.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
          {scheduledScans.filter((scan) => scan.repoUrl === repoUrl).length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-4">
              No scheduled scans. Add one to auto-analyze this repo.
            </p>
          )}
        </div>
      </div>

      {/* Change Alerts */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-400 mb-3">Change Detection Alerts</h4>
        <div className="space-y-2">
          <AnimatePresence>
            {changeAlerts
              .filter((alert) => alert.repoUrl === repoUrl)
              .map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {alert.metric} {alert.direction === "above" ? ">" : "<"} {alert.threshold}
                    </div>
                    {alert.lastTriggered && (
                      <div className="text-xs text-zinc-400">
                        Last triggered: {formatDate(alert.lastTriggered)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
          {changeAlerts.filter((alert) => alert.repoUrl === repoUrl).length === 0 && (
            <p className="text-zinc-400 text-sm text-center py-4">
              No change alerts. Add one to monitor metric thresholds.
            </p>
          )}
        </div>
      </div>

      {/* Trend Alerts */}
      {trendAlerts.filter((alert) => alert.repoUrl === repoUrl).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-zinc-400 mb-3">Recent Trend Alerts</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {trendAlerts
                .filter((alert) => alert.repoUrl === repoUrl)
                .slice(0, 10)
                .map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 glass rounded-lg border-l-4 ${
                      alert.severity === "critical"
                        ? "border-red-500"
                        : alert.severity === "warning"
                        ? "border-yellow-500"
                        : "border-blue-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-xs text-zinc-400">{formatDate(alert.timestamp)}</div>
                      </div>
                      <button
                        onClick={() => removeTrendAlert(alert.id)}
                        className="text-zinc-400 hover:text-zinc-300 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Add Scan Modal */}
      {showAddScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-md w-full space-y-4"
          >
            <h4 className="text-lg font-bold">Schedule Scan</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Frequency</label>
                <select
                  value={newScan.frequency}
                  onChange={(e) =>
                    setNewScan({ ...newScan, frequency: e.target.value as ScheduledScan["frequency"] })
                  }
                  className="w-full px-3 py-2 glass rounded-lg border border-white/20"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Mode</label>
                <select
                  value={newScan.mode}
                  onChange={(e) =>
                    setNewScan({ ...newScan, mode: e.target.value as ScheduledScan["mode"] })
                  }
                  className="w-full px-3 py-2 glass rounded-lg border border-white/20"
                >
                  <option value="roast">Roast</option>
                  <option value="praise">Praise</option>
                  <option value="audit">Audit</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addScheduledScan} className="flex-1">
                Add
              </Button>
              <Button onClick={() => setShowAddScan(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Alert Modal */}
      {showAddAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-md w-full space-y-4"
          >
            <h4 className="text-lg font-bold">Add Change Alert</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Metric</label>
                <select
                  value={newAlert.metric}
                  onChange={(e) => setNewAlert({ ...newAlert, metric: e.target.value })}
                  className="w-full px-3 py-2 glass rounded-lg border border-white/20"
                >
                  <option value="vibeScore">Vibe Score</option>
                  <option value="healthScore">Health Score</option>
                  <option value="pulseScore">Pulse Score</option>
                  <option value="churnScore">Churn Score</option>
                  <option value="busFactorScore">Bus Factor Score</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Direction</label>
                <select
                  value={newAlert.direction}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, direction: e.target.value as ChangeAlert["direction"] })
                  }
                  className="w-full px-3 py-2 glass rounded-lg border border-white/20"
                >
                  <option value="above">Above threshold</option>
                  <option value="below">Below threshold</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Threshold</label>
                <input
                  type="number"
                  value={newAlert.threshold}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, threshold: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 glass rounded-lg border border-white/20"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addChangeAlert} className="flex-1">
                Add
              </Button>
              <Button onClick={() => setShowAddAlert(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Card>
  );
}

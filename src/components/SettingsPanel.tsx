"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "./Modal";
import { Toggle } from "./Toggle";
import { Button } from "./Button";
import { showToast } from "./Toasts";
import { CustomMetricsPanel } from "./CustomMetricsPanel";
import { EmailReportsPanel } from "./EmailReportsPanel";
import { RSSFeedsPanel } from "./RSSFeedsPanel";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    soundEnabled,
    setSoundEnabled,
    reduceMotion,
    setReduceMotion,
    cursorMode,
    setCursorMode,
    theme,
    setTheme,
    liveGithub,
    setLiveGithub,
    token,
    setToken,
    clearHistory,
    history,
    customMetrics,
    emailReports,
    rssSubscriptions,
  } = useAppStore();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showCustomMetrics, setShowCustomMetrics] = useState(false);
  const [showEmailReports, setShowEmailReports] = useState(false);
  const [showRSSFeeds, setShowRSSFeeds] = useState(false);

  const shortcuts = [
    { key: "1/2/3/4", action: "Switch analysis modes" },
    { key: "I", action: "Toggle inspector cursor" },
    { key: "A", action: "Toggle arcade cursor" },
    { key: "R", action: "Remix narrative" },
    { key: "P", action: "Open poster studio" },
    { key: "Esc", action: "Close modals" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                theme === "dark"
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400"
              }`}
            >
              🌙 Dark
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                theme === "light"
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400"
              }`}
            >
              ☀️ Light
            </button>
          </div>
        </div>

        {/* Cursor Mode */}
        <div>
          <label className="block text-sm font-medium mb-2">Cursor Mode</label>
          <div className="flex gap-2">
            {(["normal", "inspector", "arcade"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCursorMode(mode)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  cursorMode === mode
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <Toggle
            checked={soundEnabled}
            onChange={setSoundEnabled}
            label="Sound Effects"
          />
          <Toggle
            checked={reduceMotion}
            onChange={setReduceMotion}
            label="Reduce Motion"
          />
          <Toggle
            checked={liveGithub}
            onChange={setLiveGithub}
            label="Live GitHub Mode"
          />
        </div>

        {/* GitHub Token */}
        <div>
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-sm text-zinc-400 hover:text-zinc-300 mb-2"
          >
            {showTokenInput ? "▼" : "▶"} GitHub Token (optional)
          </button>
          {showTokenInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">
                For private repos and higher rate limits
              </p>
            </motion.div>
          )}
        </div>

        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Search History</label>
            <span className="text-xs text-zinc-500">{history.length} entries</span>
          </div>
          {history.length > 0 && (
            <Button
              onClick={() => {
                clearHistory();
                showToast("History cleared");
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              Clear History
            </Button>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <label className="block text-sm font-medium mb-2">Keyboard Shortcuts</label>
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex justify-between items-center py-2 border-b border-zinc-700"
              >
                <span className="text-zinc-400 text-sm">{shortcut.action}</span>
                <kbd className="px-2 py-1 rounded bg-zinc-800 text-xs font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Export Settings */}
        <div>
          <label className="block text-sm font-medium mb-2">Data Export</label>
          <Button
            onClick={() => {
              const settings = {
                theme,
                cursorMode,
                soundEnabled,
                reduceMotion,
                liveGithub,
                history: history.slice(0, 10), // Last 10 entries
              };
              const blob = new Blob([JSON.stringify(settings, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "git-roaster-settings.json";
              a.click();
              showToast("Settings exported!");
            }}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            💾 Export Settings
          </Button>
        </div>

        {/* Custom Metrics */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Custom Metrics</label>
            <span className="text-xs text-zinc-500">{customMetrics.length} metrics</span>
          </div>
          <Button
            onClick={() => setShowCustomMetrics(true)}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            📊 Manage Custom Metrics
          </Button>
        </div>

        {/* Email Reports */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Email Reports</label>
            <span className="text-xs text-zinc-500">{emailReports.length} scheduled</span>
          </div>
          <Button
            onClick={() => setShowEmailReports(true)}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            📧 Manage Email Reports
          </Button>
        </div>

        {/* RSS Feeds */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">RSS Feeds</label>
            <span className="text-xs text-zinc-500">{rssSubscriptions.length} subscriptions</span>
          </div>
          <Button
            onClick={() => setShowRSSFeeds(true)}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            📡 Manage RSS Feeds
          </Button>
        </div>
      </div>

      <CustomMetricsPanel isOpen={showCustomMetrics} onClose={() => setShowCustomMetrics(false)} />
      <EmailReportsPanel isOpen={showEmailReports} onClose={() => setShowEmailReports(false)} />
      <RSSFeedsPanel isOpen={showRSSFeeds} onClose={() => setShowRSSFeeds(false)} />
    </Modal>
  );
}

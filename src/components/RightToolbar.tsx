"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "./Modal";
import { SettingsPanel } from "./SettingsPanel";
import { showToast } from "./Toasts";

export function RightToolbar() {
  const {
    soundEnabled,
    setSoundEnabled,
    reduceMotion,
    setReduceMotion,
    cursorMode,
    setCursorMode,
    comparingRepos,
    clearComparing,
    theme,
    setTheme,
  } = useAppStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const shortcuts = [
    { key: "1/2/3/4", action: "Switch modes" },
    { key: "I", action: "Toggle inspector cursor" },
    { key: "A", action: "Toggle arcade cursor" },
    { key: "R", action: "Remix narrative" },
    { key: "P", action: "Open poster studio" },
    { key: "Esc", action: "Close modals" },
  ];

  return (
    <>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        <motion.button
          onClick={() => setShowSettingsPanel(true)}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Settings"
        >
          ⚙️
        </motion.button>
        <motion.button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10 ${
            soundEnabled ? "text-yellow-400" : "text-zinc-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🔊
        </motion.button>
        <motion.button
          onClick={() => setReduceMotion(!reduceMotion)}
          className={`w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10 ${
            reduceMotion ? "text-green-400" : "text-zinc-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🎬
        </motion.button>
        <motion.button
          onClick={() => setShowHelp(true)}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ❓
        </motion.button>
        <motion.button
          onClick={() => {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.toString());
            showToast("Share link copied!");
          }}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Copy shareable link"
        >
          🔗
        </motion.button>
        <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </motion.button>
        {comparingRepos.length > 0 && (
          <motion.button
            onClick={() => setShowComparison(true)}
            className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View comparison"
          >
            🔀
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-xs flex items-center justify-center">
              {comparingRepos.length}
            </span>
          </motion.button>
        )}
      </div>

      <SettingsPanel isOpen={showSettingsPanel} onClose={() => setShowSettingsPanel(false)} />

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Keyboard Shortcuts">
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">{shortcut.action}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-800 text-xs font-mono">{shortcut.key}</kbd>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showComparison} onClose={() => setShowComparison(false)} title="Comparison Queue">
        <div className="space-y-2">
          {comparingRepos.length === 0 ? (
            <p className="text-zinc-400 text-sm">No repos in comparison. Click "Compare" on any analysis to add it.</p>
          ) : (
            <>
              <p className="text-zinc-400 text-sm mb-4">Analyze these repos to compare them side-by-side:</p>
              {comparingRepos.map((repoUrl) => (
                <div key={repoUrl} className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span className="text-zinc-300 text-sm truncate">{repoUrl}</span>
                  <button
                    onClick={() => {
                      useAppStore.getState().removeComparingRepo(repoUrl);
                      if (comparingRepos.length === 1) setShowComparison(false);
                    }}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  clearComparing();
                  setShowComparison(false);
                  showToast("Comparison cleared");
                }}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/50"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

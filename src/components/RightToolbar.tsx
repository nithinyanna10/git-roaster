"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "./Modal";

export function RightToolbar() {
  const {
    soundEnabled,
    setSoundEnabled,
    reduceMotion,
    setReduceMotion,
    cursorMode,
    setCursorMode,
  } = useAppStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
          onClick={() => setShowSettings(!showSettings)}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert("Share link copied!");
          }}
          className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-xl hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🔗
        </motion.button>
      </div>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cursor Mode</label>
            <div className="flex gap-2">
              {(["normal", "inspector", "arcade"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCursorMode(mode)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
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
        </div>
      </Modal>

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
    </>
  );
}

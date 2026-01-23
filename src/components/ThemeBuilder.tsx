"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

export function ThemeBuilder() {
  const { theme, setTheme } = useAppStore();
  const [customTheme, setCustomTheme] = useState({
    primary: "#8b5cf6",
    secondary: "#ec4899",
    accent: "#06b6d4",
    background: theme === "dark" ? "#0a0a0a" : "#ffffff",
    foreground: theme === "dark" ? "#ededed" : "#1a1a1a",
  });

  const applyTheme = () => {
    // Apply custom theme via CSS variables
    document.documentElement.style.setProperty("--primary", customTheme.primary);
    document.documentElement.style.setProperty("--secondary", customTheme.secondary);
    document.documentElement.style.setProperty("--accent", customTheme.accent);
    document.documentElement.style.setProperty("--background", customTheme.background);
    document.documentElement.style.setProperty("--foreground", customTheme.foreground);
    showToast("Custom theme applied!");
  };

  const resetTheme = () => {
    setCustomTheme({
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: theme === "dark" ? "#0a0a0a" : "#ffffff",
      foreground: theme === "dark" ? "#ededed" : "#1a1a1a",
    });
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--secondary");
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--background");
    document.documentElement.style.removeProperty("--foreground");
    showToast("Theme reset to default");
  };

  const presetThemes = [
    {
      name: "Purple Dream",
      colors: { primary: "#8b5cf6", secondary: "#ec4899", accent: "#06b6d4" },
    },
    {
      name: "Ocean Blue",
      colors: { primary: "#3b82f6", secondary: "#06b6d4", accent: "#10b981" },
    },
    {
      name: "Sunset",
      colors: { primary: "#f59e0b", secondary: "#ef4444", accent: "#ec4899" },
    },
    {
      name: "Forest",
      colors: { primary: "#10b981", secondary: "#059669", accent: "#34d399" },
    },
  ];

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Theme Builder</h3>
        <p className="text-zinc-400 text-sm">Create custom themes with color picker</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.primary}
                onChange={(e) => setCustomTheme({ ...customTheme, primary: e.target.value })}
                className="w-16 h-10 rounded border border-zinc-700"
              />
              <input
                type="text"
                value={customTheme.primary}
                onChange={(e) => setCustomTheme({ ...customTheme, primary: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.secondary}
                onChange={(e) => setCustomTheme({ ...customTheme, secondary: e.target.value })}
                className="w-16 h-10 rounded border border-zinc-700"
              />
              <input
                type="text"
                value={customTheme.secondary}
                onChange={(e) => setCustomTheme({ ...customTheme, secondary: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.accent}
                onChange={(e) => setCustomTheme({ ...customTheme, accent: e.target.value })}
                className="w-16 h-10 rounded border border-zinc-700"
              />
              <input
                type="text"
                value={customTheme.accent}
                onChange={(e) => setCustomTheme({ ...customTheme, accent: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.background}
                onChange={(e) => setCustomTheme({ ...customTheme, background: e.target.value })}
                className="w-16 h-10 rounded border border-zinc-700"
              />
              <input
                type="text"
                value={customTheme.background}
                onChange={(e) => setCustomTheme({ ...customTheme, background: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={applyTheme} variant="primary" size="sm">
            🎨 Apply Theme
          </Button>
          <Button onClick={resetTheme} variant="secondary" size="sm">
            🔄 Reset
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preset Themes</label>
          <div className="grid grid-cols-2 gap-2">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setCustomTheme({
                    ...customTheme,
                    primary: preset.colors.primary,
                    secondary: preset.colors.secondary,
                    accent: preset.colors.accent,
                  });
                }}
                className="p-3 rounded-lg glass border border-zinc-700 hover:border-purple-500 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <div className="text-sm font-medium">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-4 bg-purple-900/20 border border-purple-700/50">
          <p className="text-sm text-purple-300">
            💡 <strong>Preview:</strong> Your custom theme will be applied immediately. Use preset themes for quick styling.
          </p>
        </div>
      </div>
    </Card>
  );
}

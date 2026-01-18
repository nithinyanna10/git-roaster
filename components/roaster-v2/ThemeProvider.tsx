"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeVariant, ThemeConfig, themes } from "@/lib/design-tokens";

interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  config: ThemeConfig;
  reduceMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeVariant>("aurora");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduce motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Konami code handler
  useEffect(() => {
    const handleKonami = () => {
      setTheme("neubrutal");
    };
    const handleKonamiOff = () => {
      setTheme("aurora");
    };

    window.addEventListener("konami-activated", handleKonami);
    window.addEventListener("konami-deactivated", handleKonamiOff);
    return () => {
      window.removeEventListener("konami-activated", handleKonami);
      window.removeEventListener("konami-deactivated", handleKonamiOff);
    };
  }, []);

  const config = themes[theme];

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", config.colors.primary);
    root.style.setProperty("--theme-secondary", config.colors.secondary);
    root.style.setProperty("--theme-accent", config.colors.accent);
    root.style.setProperty("--theme-background", config.colors.background);
    root.style.setProperty("--theme-surface", config.colors.surface);
    root.style.setProperty("--theme-text", config.colors.text);
    root.style.setProperty("--theme-text-muted", config.colors.textMuted);
    root.style.setProperty("--theme-border", config.colors.border);
    root.style.setProperty("--theme-glow", config.colors.glow);

    // Apply grain if tactile theme
    if (config.effects.grain) {
      root.classList.add("theme-grain");
    } else {
      root.classList.remove("theme-grain");
    }

    // Apply glass if aurora theme
    if (config.effects.glass) {
      root.classList.add("theme-glass");
    } else {
      root.classList.remove("theme-glass");
    }

    // Apply neubrutal borders
    if (config.effects.borders === "bold") {
      root.classList.add("theme-neubrutal");
    } else {
      root.classList.remove("theme-neubrutal");
    }
  }, [config]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config, reduceMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

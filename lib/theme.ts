export type ThemeMode = "nebula" | "blueprint" | "arcade";

export interface Theme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  particles: boolean;
  animations: {
    intensity: "low" | "medium" | "high";
    style: string;
  };
}

export const themes: Record<ThemeMode, Theme> = {
  nebula: {
    name: "Nebula",
    description: "Cosmic gradients with floating particles",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      surface: "rgba(139, 92, 246, 0.1)",
      text: "#e4e4e7",
      textMuted: "#a1a1aa",
    },
    particles: true,
    animations: {
      intensity: "medium",
      style: "smooth",
    },
  },
  blueprint: {
    name: "Blueprint",
    description: "Engineering HUD with gridlines",
    colors: {
      primary: "#10b981",
      secondary: "#3b82f6",
      accent: "#f59e0b",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
      surface: "rgba(16, 185, 129, 0.1)",
      text: "#d1d5db",
      textMuted: "#6b7280",
    },
    particles: false,
    animations: {
      intensity: "low",
      style: "precise",
    },
  },
  arcade: {
    name: "Arcade",
    description: "Neon vibes with comic energy",
    colors: {
      primary: "#ef4444",
      secondary: "#fbbf24",
      accent: "#a855f7",
      background: "linear-gradient(135deg, #1a0000 0%, #330033 50%, #000033 100%)",
      surface: "rgba(239, 68, 68, 0.15)",
      text: "#fef3c7",
      textMuted: "#fde68a",
    },
    particles: true,
    animations: {
      intensity: "high",
      style: "bouncy",
    },
  },
};

export function getVibeColors(vibeScore: number, theme: ThemeMode): { primary: string; secondary: string } {
  const themeColors = themes[theme];
  
  if (vibeScore >= 80) {
    return {
      primary: theme === "nebula" ? "#10b981" : theme === "blueprint" ? "#10b981" : "#22c55e",
      secondary: theme === "nebula" ? "#06b6d4" : theme === "blueprint" ? "#3b82f6" : "#fbbf24",
    };
  } else if (vibeScore >= 60) {
    return {
      primary: theme === "nebula" ? "#f59e0b" : theme === "blueprint" ? "#f59e0b" : "#fbbf24",
      secondary: theme === "nebula" ? "#ec4899" : theme === "blueprint" ? "#3b82f6" : "#ef4444",
    };
  } else {
    return {
      primary: theme === "nebula" ? "#ef4444" : theme === "blueprint" ? "#ef4444" : "#ef4444",
      secondary: theme === "nebula" ? "#f97316" : theme === "blueprint" ? "#f59e0b" : "#f97316",
    };
  }
}

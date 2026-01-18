export const designTokens = {
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  typography: {
    fontFamily: {
      display: "var(--font-display, system-ui, sans-serif)",
      body: "var(--font-body, system-ui, sans-serif)",
      mono: "var(--font-mono, 'Courier New', monospace)",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  animation: {
    duration: {
      fast: "0.15s",
      normal: "0.3s",
      slow: "0.5s",
      slower: "0.8s",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: "0 0 20px rgba(139, 92, 246, 0.5)",
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export type ThemeVariant = "aurora" | "tactile" | "neubrutal";

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textMuted: string;
    border: string;
    glow: string;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    weight: {
      normal: number;
      bold: number;
      black: number;
    };
  };
  effects: {
    grain: boolean;
    glass: boolean;
    shadows: boolean;
    borders: "soft" | "bold" | "none";
  };
  animations: {
    intensity: "low" | "medium" | "high";
    style: "smooth" | "bouncy" | "sharp";
  };
}

export const themes: Record<ThemeVariant, ThemeConfig> = {
  aurora: {
    name: "Aurora Lab",
    description: "Aurora gradients + glass layers + premium tech feel",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      surface: "rgba(139, 92, 246, 0.1)",
      surfaceElevated: "rgba(139, 92, 246, 0.2)",
      text: "#e4e4e7",
      textMuted: "#a1a1aa",
      border: "rgba(139, 92, 246, 0.3)",
      glow: "rgba(139, 92, 246, 0.5)",
    },
    typography: {
      displayFont: "system-ui, sans-serif",
      bodyFont: "system-ui, sans-serif",
      weight: {
        normal: 400,
        bold: 700,
        black: 900,
      },
    },
    effects: {
      grain: false,
      glass: true,
      shadows: true,
      borders: "soft",
    },
    animations: {
      intensity: "medium",
      style: "smooth",
    },
  },
  tactile: {
    name: "Tactile Craft",
    description: "Grain overlay, paper texture, warm human feel",
    colors: {
      primary: "#f59e0b",
      secondary: "#ef4444",
      accent: "#10b981",
      background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      surface: "rgba(245, 158, 11, 0.15)",
      surfaceElevated: "rgba(245, 158, 11, 0.25)",
      text: "#fef3c7",
      textMuted: "#fde68a",
      border: "rgba(245, 158, 11, 0.4)",
      glow: "rgba(245, 158, 11, 0.3)",
    },
    typography: {
      displayFont: "system-ui, sans-serif",
      bodyFont: "system-ui, sans-serif",
      weight: {
        normal: 400,
        bold: 700,
        black: 900,
      },
    },
    effects: {
      grain: true,
      glass: false,
      shadows: true,
      borders: "soft",
    },
    animations: {
      intensity: "low",
      style: "smooth",
    },
  },
  neubrutal: {
    name: "Neubrutal Roast",
    description: "Bold blocks, high contrast, raw playful energy",
    colors: {
      primary: "#ef4444",
      secondary: "#fbbf24",
      accent: "#a855f7",
      background: "#ffffff",
      surface: "#000000",
      surfaceElevated: "#000000",
      text: "#000000",
      textMuted: "#666666",
      border: "#000000",
      glow: "transparent",
    },
    typography: {
      displayFont: "system-ui, sans-serif",
      bodyFont: "system-ui, sans-serif",
      weight: {
        normal: 700,
        bold: 800,
        black: 900,
      },
    },
    effects: {
      grain: false,
      glass: false,
      shadows: false,
      borders: "bold",
    },
    animations: {
      intensity: "high",
      style: "sharp",
    },
  },
};

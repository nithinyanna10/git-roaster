"use client";

import { motion } from "framer-motion";
import { Metrics, Scores } from "@/types";

interface RepoPersonaAvatarProps {
  metrics: Metrics;
  scores: Scores;
  size?: "sm" | "md" | "lg";
}

type PersonaType = "sleepy" | "chaotic" | "sturdy" | "active" | "quiet";

function determinePersona(metrics: Metrics, scores: Scores): PersonaType {
  if (metrics.daysSinceLastCommit > 180) return "sleepy";
  if (metrics.churnRatio > 500 && metrics.commitsLast30Days > 20) return "chaotic";
  if (scores.tests > 80 && scores.releases > 60 && scores.stability > 70) return "sturdy";
  if (metrics.commitsLast30Days > 30) return "active";
  return "quiet";
}

function getPersonaConfig(persona: PersonaType) {
  const configs = {
    sleepy: {
      color: "#6b7280",
      eyeShape: "closed",
      mouthShape: "zzz",
      expression: "tired",
      animation: "float",
    },
    chaotic: {
      color: "#ef4444",
      eyeShape: "wide",
      mouthShape: "open",
      expression: "excited",
      animation: "bounce",
    },
    sturdy: {
      color: "#10b981",
      eyeShape: "normal",
      mouthShape: "smile",
      expression: "confident",
      animation: "pulse",
    },
    active: {
      color: "#3b82f6",
      eyeShape: "normal",
      mouthShape: "smile",
      expression: "happy",
      animation: "wiggle",
    },
    quiet: {
      color: "#8b5cf6",
      eyeShape: "normal",
      mouthShape: "neutral",
      expression: "calm",
      animation: "float",
    },
  };
  return configs[persona];
}

export function RepoPersonaAvatar({ metrics, scores, size = "md" }: RepoPersonaAvatarProps) {
  const persona = determinePersona(metrics, scores);
  const config = getPersonaConfig(persona);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const getAnimation = () => {
    switch (config.animation) {
      case "float":
        return {
          y: [0, -10, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "bounce":
        return {
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "pulse":
        return {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "wiggle":
        return {
          rotate: [0, 5, -5, 0],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={getAnimation()}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Blob body */}
        <motion.path
          d="M50,20 C70,20 85,35 85,50 C85,65 70,80 50,80 C30,80 15,65 15,50 C15,35 30,20 50,20 Z"
          fill={config.color}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Eyes */}
        {config.eyeShape === "closed" ? (
          <>
            <line x1="35" y1="45" x2="45" y2="45" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <line x1="55" y1="45" x2="65" y2="45" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : config.eyeShape === "wide" ? (
          <>
            <circle cx="40" cy="45" r="8" fill="#fff" />
            <circle cx="60" cy="45" r="8" fill="#fff" />
            <circle cx="40" cy="45" r="4" fill={config.color} />
            <circle cx="60" cy="45" r="4" fill={config.color} />
          </>
        ) : (
          <>
            <circle cx="40" cy="45" r="6" fill="#fff" />
            <circle cx="60" cy="45" r="6" fill="#fff" />
            <motion.circle
              cx="40"
              cy="45"
              r="3"
              fill={config.color}
              animate={{
                cy: [45, 43, 45],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.circle
              cx="60"
              cy="45"
              r="3"
              fill={config.color}
              animate={{
                cy: [45, 43, 45],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Mouth */}
        {config.mouthShape === "zzz" ? (
          <text x="50" y="70" fontSize="12" fill="#fff" textAnchor="middle">zzz</text>
        ) : config.mouthShape === "open" ? (
          <ellipse cx="50" cy="65" rx="8" ry="10" fill="#fff" />
        ) : config.mouthShape === "smile" ? (
          <path
            d="M 35 60 Q 50 70 65 60"
            stroke="#fff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line x1="40" y1="60" x2="60" y2="60" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  );
}

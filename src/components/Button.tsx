"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const { reduceMotion } = useAppStore();

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500",
    secondary: "glass border border-white/20 text-white hover:bg-white/10",
    ghost: "text-zinc-400 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const motionProps: HTMLMotionProps<"button"> = !reduceMotion
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.button
      className={`rounded-lg font-medium transition-all ${variants[variant]} ${sizes[size]} ${className}`}
      {...(motionProps as any)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition-colors ${
            checked ? "bg-purple-600" : "bg-zinc-700"
          } ${disabled ? "opacity-50" : ""}`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full mt-0.5 ml-0.5"
            animate={{ x: checked ? 24 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
      {label && <span className="text-sm text-zinc-300">{label}</span>}
    </label>
  );
}

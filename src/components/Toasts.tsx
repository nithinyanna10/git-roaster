"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: Array<() => void> = [];

export function showToast(message: string, type: Toast["type"] = "success") {
  const id = `toast-${toastId++}`;
  toasts.push({ id, message, type });
  listeners.forEach((listener) => listener());
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach((listener) => listener());
    }
  }, 3000);
}

export function Toasts() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const update = () => setCurrentToasts([...toasts]);
    listeners.push(update);
    update();
    return () => {
      const index = listeners.indexOf(update);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {currentToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-lg px-4 py-3 min-w-[200px]"
          >
            <div className="text-sm text-white">{toast.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

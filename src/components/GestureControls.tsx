"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

export function GestureControls() {
  const [enabled, setEnabled] = useState(false);
  const [gestures, setGestures] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            setGestures((prev) => [...prev, "Swipe Right"]);
            showToast("Swipe Right detected");
          } else {
            setGestures((prev) => [...prev, "Swipe Left"]);
            showToast("Swipe Left detected");
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            setGestures((prev) => [...prev, "Swipe Down"]);
            showToast("Swipe Down detected");
          } else {
            setGestures((prev) => [...prev, "Swipe Up"]);
            showToast("Swipe Up detected");
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled]);

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Gesture Controls</h3>
        <p className="text-zinc-400 text-sm">Swipe, pinch, rotate on touch devices</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium mb-1">Enable Gesture Controls</div>
            <div className="text-sm text-zinc-400">Touch gestures for navigation</div>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-4 space-y-3"
          >
            <h4 className="font-bold">Supported Gestures</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span>👆</span>
                <span>Swipe Left/Right</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👆</span>
                <span>Swipe Up/Down</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🤏</span>
                <span>Pinch (Coming soon)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span>Rotate (Coming soon)</span>
              </div>
            </div>
          </motion.div>
        )}

        {gestures.length > 0 && (
          <div className="glass rounded-lg p-4">
            <h4 className="font-bold mb-2">Recent Gestures</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {gestures.slice(-10).reverse().map((gesture, index) => (
                <div key={index} className="text-sm text-zinc-400">
                  {gesture}
                </div>
              ))}
            </div>
            <button
              onClick={() => setGestures([])}
              className="mt-2 text-xs text-purple-400 hover:text-purple-300"
            >
              Clear
            </button>
          </div>
        )}

        {!enabled && (
          <div className="text-center py-8 text-zinc-400">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm">Enable gesture controls to use touch gestures</p>
          </div>
        )}
      </div>

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> Gesture controls work best on touch devices. Pinch and rotate gestures require additional implementation.
        </p>
      </div>
    </Card>
  );
}

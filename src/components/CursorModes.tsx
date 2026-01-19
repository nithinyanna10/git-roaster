"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function CursorModes() {
  const { cursorMode, reduceMotion } = useAppStore();

  useEffect(() => {
    if (reduceMotion) {
      document.body.className = document.body.className.replace(/cursor-\w+/g, "");
      return;
    }

    document.body.className = document.body.className.replace(/cursor-\w+/g, "");
    if (cursorMode === "inspector") {
      document.body.classList.add("cursor-inspector");
    } else if (cursorMode === "arcade") {
      document.body.classList.add("cursor-arcade");
    }

    if (cursorMode === "arcade" && !reduceMotion) {
      const trail: Array<{ x: number; y: number; opacity: number }> = [];
      const maxTrail = 10;

      const handleMouseMove = (e: MouseEvent) => {
        trail.push({ x: e.clientX, y: e.clientY, opacity: 1 });
        if (trail.length > maxTrail) trail.shift();

        trail.forEach((point, i) => {
          const element = document.createElement("div");
          element.className = "arcade-trail";
          element.style.left = `${point.x}px`;
          element.style.top = `${point.y}px`;
          element.style.opacity = `${point.opacity * (i / trail.length)}`;
          document.body.appendChild(element);

          setTimeout(() => {
            element.remove();
          }, 200);
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [cursorMode, reduceMotion]);

  return null;
}

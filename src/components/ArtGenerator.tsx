"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface ArtGeneratorProps {
  analysis: Analysis;
}

export function ArtGenerator({ analysis }: ArtGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [artStyle, setArtStyle] = useState<"abstract" | "geometric" | "flow">("abstract");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateArt();
  }, [analysis, artStyle]);

  const generateArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsGenerating(true);

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const metrics = [
      analysis.scores.vibe,
      analysis.scores.health,
      analysis.scores.pulse,
      analysis.scores.churn,
      analysis.scores.busFactor,
    ];

    if (artStyle === "abstract") {
      // Abstract art: circles and lines based on metrics
      metrics.forEach((metric, index) => {
        const x = (canvas.width / metrics.length) * index + canvas.width / (metrics.length * 2);
        const y = canvas.height / 2;
        const radius = (metric / 100) * 80;
        const hue = (metric / 100) * 360;

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw connecting lines
        if (index > 0) {
          const prevX = (canvas.width / metrics.length) * (index - 1) + canvas.width / (metrics.length * 2);
          ctx.beginPath();
          ctx.moveTo(prevX, canvas.height / 2);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `hsl(${hue}, 50%, 40%)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    } else if (artStyle === "geometric") {
      // Geometric patterns
      const cellSize = canvas.width / metrics.length;
      metrics.forEach((metric, index) => {
        const x = index * cellSize;
        const y = 0;
        const width = cellSize;
        const height = (metric / 100) * canvas.height;
        const hue = (metric / 100) * 360;

        // Draw rectangle
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(x, canvas.height - height, width, height);

        // Add pattern
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 10) {
          ctx.beginPath();
          ctx.moveTo(x + i, canvas.height - height);
          ctx.lineTo(x + i, canvas.height);
          ctx.stroke();
        }
      });
    } else if (artStyle === "flow") {
      // Flow/particle effect
      const points: Array<{ x: number; y: number; vx: number; vy: number; hue: number }> = [];
      
      metrics.forEach((metric, index) => {
        for (let i = 0; i < 5; i++) {
          points.push({
            x: (canvas.width / metrics.length) * index + Math.random() * 50,
            y: canvas.height / 2 + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            hue: (metric / 100) * 360,
          });
        }
      });

      // Animate particles
      const animate = () => {
        ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        points.forEach((point) => {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
          if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${point.hue}, 70%, 50%)`;
          ctx.fill();
        });
      };

      // Draw initial frame
      animate();
    }

    setIsGenerating(false);
  };

  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${analysis.repo.fullName.replace("/", "_")}_art.png`;
    link.href = canvas.toDataURL();
    link.click();
    showToast("Artwork downloaded!");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎨</span>
          <div>
            <h3 className="text-xl font-bold">Art Generator</h3>
            <p className="text-sm text-zinc-400">Create abstract art from commit patterns</p>
          </div>
        </div>
        <Button onClick={downloadArt} variant="secondary" size="sm">
          📥 Download
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Art Style</label>
          <div className="flex gap-2">
            {(["abstract", "geometric", "flow"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setArtStyle(style)}
                className={`px-3 py-1 rounded-lg text-sm transition-all capitalize ${
                  artStyle === style
                    ? "bg-purple-500 text-white"
                    : "glass text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-4 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded-lg"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Generating artwork...</span>
          </div>
        )}
      </div>

      <div className="text-xs text-zinc-500 space-y-1">
        <p>💡 Art generated from repository metrics:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Colors based on metric values (hue mapping)</li>
          <li>Sizes based on score percentages</li>
          <li>Patterns reflect repository characteristics</li>
        </ul>
      </div>
    </Card>
  );
}

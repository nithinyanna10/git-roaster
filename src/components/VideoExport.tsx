"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface VideoExportProps {
  analysis: Analysis;
}

export function VideoExport({ analysis }: VideoExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateVideo = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // In production, this would use a video generation library or service
      // For now, we'll create a canvas-based animation and export it
      showToast("Generating video... (This is a demo - integrate with video generation service)");

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            showToast("Video generated! (Demo mode - integrate video service for production)");
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // In production, you would:
      // 1. Use a library like remotion, ffmpeg.wasm, or a service like Loom, Wistia
      // 2. Create frames from the analysis data
      // 3. Animate charts, metrics, and narrative
      // 4. Export as MP4, WebM, or GIF

    } catch (error) {
      showToast("Failed to generate video");
      console.error(error);
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    // In production, download the generated video
    showToast("Video download (integrate with video generation service)");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎬</span>
          <div>
            <h3 className="text-xl font-bold">Video Export</h3>
            <p className="text-sm text-zinc-400">Generate animated video summaries</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateVideo}
            disabled={isGenerating}
            variant="primary"
            size="sm"
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
          {progress === 100 && (
            <Button onClick={downloadVideo} variant="secondary" size="sm">
              ⬇️ Download
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Generating video...</span>
            <span className="text-purple-400">{progress}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="glass rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">Video Preview</h4>
        <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: progress === 100 ? "block" : "none" }}
          />
          {progress < 100 && (
            <div className="text-center text-zinc-500">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-sm">Video preview will appear here</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-zinc-500 space-y-1">
        <p>💡 Video will include:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Animated charts and metrics</li>
          <li>Narrative text overlays</li>
          <li>Repo health visualization</li>
          <li>Key findings highlights</li>
        </ul>
        <p className="mt-2">
          🔧 Integration options: Remotion, ffmpeg.wasm, or video generation APIs (Loom, Wistia, etc.)
        </p>
      </div>
    </Card>
  );
}

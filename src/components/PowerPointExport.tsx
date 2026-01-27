"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface PowerPointExportProps {
  analysis: Analysis;
}

export function PowerPointExport({ analysis }: PowerPointExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePowerPoint = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      showToast("Generating PowerPoint presentation...");

      // In production, this would use a library like:
      // - pptxgenjs (for browser-based generation)
      // - python-pptx (for server-side generation)
      // - Or a service like Google Slides API

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            showToast("PowerPoint generated! (Demo mode - integrate pptxgenjs for production)");
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // In production, you would:
      // 1. Create slides with pptxgenjs
      // 2. Add title slide with repo name and vibe score
      // 3. Add metrics slides with charts
      // 4. Add narrative slides
      // 5. Add visualization slides
      // 6. Export as .pptx file

    } catch (error) {
      showToast("Failed to generate PowerPoint");
      console.error(error);
      setIsGenerating(false);
    }
  };

  const downloadPowerPoint = () => {
    // In production, download the generated .pptx file
    showToast("PowerPoint download (integrate pptxgenjs for production)");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-xl font-bold">PowerPoint Export</h3>
            <p className="text-sm text-zinc-400">Presentation-ready slides</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generatePowerPoint}
            disabled={isGenerating}
            variant="primary"
            size="sm"
          >
            {isGenerating ? "Generating..." : "Generate PPTX"}
          </Button>
          {progress === 100 && (
            <Button onClick={downloadPowerPoint} variant="secondary" size="sm">
              ⬇️ Download
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Creating slides...</span>
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
        <h4 className="text-sm font-semibold text-zinc-400">Presentation Structure</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span>1️⃣</span>
            <span>Title Slide: {analysis.repo.fullName} Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span>2️⃣</span>
            <span>Executive Summary: Vibe Score & Key Metrics</span>
          </div>
          <div className="flex items-center gap-2">
            <span>3️⃣</span>
            <span>Health Metrics Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span>4️⃣</span>
            <span>Narrative & Findings</span>
          </div>
          <div className="flex items-center gap-2">
            <span>5️⃣</span>
            <span>Visualizations & Charts</span>
          </div>
          <div className="flex items-center gap-2">
            <span>6️⃣</span>
            <span>Recommendations & Next Steps</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-zinc-500 space-y-1">
        <p>💡 PowerPoint will include:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Professional slide layouts</li>
          <li>Charts and visualizations</li>
          <li>Key metrics and insights</li>
          <li>Branded with your theme</li>
        </ul>
        <p className="mt-2">
          🔧 Integration: Use <code className="bg-zinc-800 px-1 rounded">pptxgenjs</code> for browser-based generation or python-pptx for server-side.
        </p>
      </div>
    </Card>
  );
}

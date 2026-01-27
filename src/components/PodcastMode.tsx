"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface PodcastModeProps {
  analysis: Analysis;
}

export function PodcastMode({ analysis }: PodcastModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Generate transcript from analysis
    const generateTranscript = () => {
      const lines = [
        `Welcome to the Git Roaster podcast. Today we're analyzing ${analysis.repo.fullName}.`,
        `The vibe score is ${analysis.scores.vibe} out of 100.`,
        analysis.narrative.split("\n").slice(0, 5).join(" "),
        `The repository has a health score of ${analysis.scores.health}.`,
        `Key metrics include a pulse score of ${analysis.scores.pulse}, churn score of ${analysis.scores.churn}, and bus factor of ${analysis.scores.busFactor}.`,
        `The verdict is: ${analysis.verdicts.opsHealth}.`,
      ];
      return lines.join(" ");
    };

    setTranscript(generateTranscript());
  }, [analysis]);

  const generateAudio = async () => {
    setIsGenerating(true);
    showToast("Generating audio narration...");

    try {
      // In production, this would call a text-to-speech API
      // For now, we'll use the Web Speech API as a fallback
      if ("speechSynthesis" in window) {
        // Use browser's built-in TTS
        const utterance = new SpeechSynthesisUtterance(transcript);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Create a blob URL for the audio (simulated)
        // In production, you'd use a TTS service like ElevenLabs, Google TTS, etc.
        const simulatedAudioUrl = URL.createObjectURL(
          new Blob([], { type: "audio/mpeg" })
        );
        
        setAudioUrl(simulatedAudioUrl);
        showToast("Audio generated! (Using browser TTS - install TTS service for production)");
      } else {
        showToast("Text-to-speech not supported in this browser");
      }
    } catch (error) {
      showToast("Failed to generate audio");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Use browser's speech synthesis as fallback
      if ("speechSynthesis" in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel();
        } else {
          const utterance = new SpeechSynthesisUtterance(transcript);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          utterance.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${analysis.repo.fullName.replace("/", "_")}_podcast.mp3`;
      a.click();
      showToast("Audio downloaded!");
    } else {
      showToast("Generate audio first");
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎙️</span>
          <div>
            <h3 className="text-xl font-bold">Podcast Mode</h3>
            <p className="text-sm text-zinc-400">AI-generated audio narration</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!audioUrl && (
            <Button
              onClick={generateAudio}
              disabled={isGenerating}
              variant="secondary"
              size="sm"
            >
              {isGenerating ? "Generating..." : "Generate Audio"}
            </Button>
          )}
          <Button onClick={togglePlay} variant="primary" size="sm">
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </Button>
          {audioUrl && (
            <Button onClick={downloadAudio} variant="secondary" size="sm">
              ⬇️ Download
            </Button>
          )}
        </div>
      </div>

      {audioUrl && (
        <div className="space-y-2">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={(e) => {
              const audio = e.currentTarget;
              setCurrentTime(audio.currentTime);
              setDuration(audio.duration || 0);
            }}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
            }}
            onEnded={() => setIsPlaying(false)}
            className="w-full"
          />
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, "0")}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, "0")}</span>
          </div>
        </div>
      )}

      <div className="glass rounded-lg p-4 max-h-64 overflow-y-auto">
        <h4 className="text-sm font-semibold text-zinc-400 mb-2">Transcript</h4>
        <p className="text-sm leading-relaxed">{transcript}</p>
      </div>

      <div className="text-xs text-zinc-500">
        💡 Tip: In production, integrate with ElevenLabs, Google Cloud TTS, or Azure Speech Services for high-quality narration.
      </div>
    </Card>
  );
}

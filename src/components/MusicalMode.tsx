"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface MusicalModeProps {
  analysis: Analysis;
}

export function MusicalMode({ analysis }: MusicalModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [instrument, setInstrument] = useState<"piano" | "synth" | "drums">("piano");
  const audioContextRef = useRef<AudioContext | null>(null);
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    // Generate musical notes from repo metrics
    const generateMusic = () => {
      const metrics = [
        analysis.scores.vibe,
        analysis.scores.health,
        analysis.scores.pulse,
        analysis.scores.churn,
        analysis.scores.busFactor,
      ];

      // Map metrics to musical notes (C major scale)
      const scale = ["C", "D", "E", "F", "G", "A", "B"];
      const generatedNotes: string[] = [];

      metrics.forEach((metric) => {
        const noteIndex = Math.floor((metric / 100) * scale.length);
        const note = scale[Math.min(noteIndex, scale.length - 1)];
        generatedNotes.push(note);
      });

      setNotes(generatedNotes);
    };

    generateMusic();
  }, [analysis]);

  const playMusic = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    setIsPlaying(true);
    showToast("Playing music generated from repo metrics...");

    // In production, this would use Web Audio API to generate actual tones
    // For now, we'll simulate the music generation
    const frequencies: Record<string, number> = {
      C: 261.63,
      D: 293.66,
      E: 329.63,
      F: 349.23,
      G: 392.00,
      A: 440.00,
      B: 493.88,
    };

    const playNote = (note: string, duration: number, delay: number) => {
      setTimeout(() => {
        if (!audioContextRef.current) return;
        
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.value = frequencies[note] || 440;
        oscillator.type = instrument === "drums" ? "square" : instrument === "synth" ? "sawtooth" : "sine";

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + duration);
      }, delay);
    };

    // Play notes in sequence
    notes.forEach((note, index) => {
      playNote(note, 0.5, index * (60000 / tempo));
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, (notes.length * 60000) / tempo);
  };

  const stopMusic = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎵</span>
          <div>
            <h3 className="text-xl font-bold">Musical Mode</h3>
            <p className="text-sm text-zinc-400">Generate music from repo patterns</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isPlaying ? (
            <Button onClick={playMusic} variant="primary" size="sm">
              ▶️ Play
            </Button>
          ) : (
            <Button onClick={stopMusic} variant="secondary" size="sm">
              ⏹️ Stop
            </Button>
          )}
        </div>
      </div>

      <div className="glass rounded-lg p-4 space-y-4">
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Instrument</label>
          <div className="flex gap-2">
            {(["piano", "synth", "drums"] as const).map((inst) => (
              <button
                key={inst}
                onClick={() => setInstrument(inst)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  instrument === inst
                    ? "bg-purple-500 text-white"
                    : "glass text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {inst.charAt(0).toUpperCase() + inst.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Tempo: {tempo} BPM</label>
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Generated Notes</label>
          <div className="flex gap-2 flex-wrap">
            {notes.map((note, index) => (
              <div
                key={index}
                className="px-3 py-2 glass rounded-lg text-lg font-mono"
              >
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-zinc-400 space-y-1">
          <p>🎼 Music generated from:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Vibe Score → {notes[0] || "C"}</li>
            <li>Health Score → {notes[1] || "D"}</li>
            <li>Pulse Score → {notes[2] || "E"}</li>
            <li>Churn Score → {notes[3] || "F"}</li>
            <li>Bus Factor → {notes[4] || "G"}</li>
          </ul>
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-2 text-sm text-purple-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span>Playing music...</span>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Each metric is mapped to a musical note. Higher scores = higher notes. Uses Web Audio API for real-time synthesis.
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface TherapistMessage {
  id: string;
  speaker: "therapist" | "repo";
  text: string;
}

interface AIRepoTherapistProps {
  analysis: Analysis;
}

export function AIRepoTherapist({ analysis }: AIRepoTherapistProps) {
  const [conversation, setConversation] = useState<TherapistMessage[]>([]);
  const [isActive, setIsActive] = useState(false);

  const startSession = () => {
    setIsActive(true);
    const repoName = analysis.repo.fullName.split("/")[1];
    const health = analysis.scores.health;
    const vibe = analysis.scores.vibe;

    const initialMessages: TherapistMessage[] = [
      {
        id: "1",
        speaker: "therapist",
        text: `Hello, I'm Dr. Code. I understand you're ${repoName}, is that correct?`,
      },
      {
        id: "2",
        speaker: "repo",
        text: health < 50
          ? "Yes... I've been feeling a bit down lately. My health score is only " + health + "."
          : vibe < 50
          ? "Yes, that's me. I'm not feeling great about my vibe score of " + vibe + "."
          : "Yes, that's me! I'm doing okay, but I wanted to talk about some things.",
      },
      {
        id: "3",
        speaker: "therapist",
        text: health < 50
          ? "I see. Can you tell me more about what's been affecting your health?"
          : "That's completely valid. What would you like to discuss today?",
      },
    ];

    setConversation(initialMessages);
  };

  const addTherapistResponse = () => {
    const health = analysis.scores.health;
    const vibe = analysis.scores.vibe;
    const churn = analysis.scores.churn;
    const busFactor = analysis.scores.busFactor;

    let response = "";

    if (health < 40) {
      response =
        "I hear you're struggling with your health. Low test coverage, outdated dependencies, or lack of documentation can really weigh on a repository. Have you considered setting up CI/CD or improving your test suite?";
    } else if (vibe < 40) {
      response =
        "Your vibe score suggests you might be feeling disconnected. Are your contributors engaged? Sometimes a good README or clear contribution guidelines can help improve the overall feeling of a project.";
    } else if (busFactor < 30) {
      response =
        "I notice your bus factor is quite low. That must feel isolating - having only a few people who understand you. Have you thought about documenting your architecture or encouraging more contributors?";
    } else if (churn > 70) {
      response =
        "You're experiencing high churn - a lot of change. That can be stressful. Are these changes planned, or do you feel like you're constantly being rewritten? Stability can be important too.";
    } else {
      response =
        "You seem to be in a relatively good place! But even healthy repos have room for growth. What's one thing you'd like to improve about yourself?";
    }

    setConversation((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        speaker: "therapist",
        text: response,
      },
    ]);
  };

  const addRepoResponse = (response: string) => {
    setConversation((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        speaker: "repo",
        text: response,
      },
    ]);
  };

  const endSession = () => {
    setIsActive(false);
    setConversation([]);
    showToast("Therapy session ended");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛋️</span>
          <div>
            <h3 className="text-xl font-bold">AI Repo Therapist</h3>
            <p className="text-sm text-zinc-400">Repo tells you its problems in first person</p>
          </div>
        </div>
        {!isActive ? (
          <Button onClick={startSession} variant="primary" size="sm">
            Start Session
          </Button>
        ) : (
          <Button onClick={endSession} variant="secondary" size="sm">
            End Session
          </Button>
        )}
      </div>

      {isActive && (
        <div className="space-y-4">
          <div className="glass rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
            <AnimatePresence>
              {conversation.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.speaker === "therapist" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.speaker === "therapist"
                        ? "bg-purple-500/20 text-purple-200"
                        : "bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">
                      {msg.speaker === "therapist" ? "Dr. Code" : analysis.repo.fullName.split("/")[1]}
                    </div>
                    <div className="text-sm">{msg.text}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            <Button onClick={addTherapistResponse} variant="secondary" size="sm">
              💬 Therapist Responds
            </Button>
            <Button
              onClick={() => addRepoResponse("I'm not sure what to say...")}
              variant="secondary"
              size="sm"
            >
              💭 Repo Responds
            </Button>
          </div>
        </div>
      )}

      {!isActive && (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2">🛋️</div>
          <p>Click "Start Session" to begin a therapy session with your repository</p>
          <p className="text-xs mt-2">Your repo will share its feelings and concerns in first person</p>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 In production, integrate with an LLM (GPT-4, Claude) to generate dynamic, contextual responses based on your repo's actual metrics and history.
      </div>
    </Card>
  );
}

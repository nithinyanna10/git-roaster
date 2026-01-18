"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseGitHubUrl } from "@/lib/utils";

const EXAMPLE_REPOS = [
  { name: "vercel/next.js", url: "https://github.com/vercel/next.js" },
  { name: "facebook/react", url: "https://github.com/facebook/react" },
  { name: "microsoft/vscode", url: "https://github.com/microsoft/vscode" },
  { name: "torvalds/linux", url: "https://github.com/torvalds/linux" },
  { name: "golang/go", url: "https://github.com/golang/go" },
];

interface RepoInputConsoleProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  mode: "roast" | "praise";
  setMode: (mode: "roast" | "praise") => void;
  onAnalyze: () => void;
  loading: boolean;
  showTokenInput: boolean;
  setShowTokenInput: (show: boolean) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
}

export function RepoInputConsole({
  repoUrl,
  setRepoUrl,
  mode,
  setMode,
  onAnalyze,
  loading,
  showTokenInput,
  setShowTokenInput,
  githubToken,
  setGithubToken,
}: RepoInputConsoleProps) {
  const [parsed, setParsed] = useState<{ owner: string; repo: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  const handleUrlChange = (value: string) => {
    setRepoUrl(value);
    const result = parseGitHubUrl(value);
    setParsed(result);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
    } catch (err) {
      console.error("Failed to read clipboard");
    }
  };

  const handleExampleSelect = (url: string) => {
    handleUrlChange(url);
    setShowExamples(false);
  };

  const isValid = parsed !== null;

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4">
      <motion.div
        className="rounded-2xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            GitHub Repository URL
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && isValid && !loading && onAnalyze()}
                placeholder="https://github.com/owner/repo"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-950/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-mono text-sm"
              />
              {parsed && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  ✓ {parsed.owner}/{parsed.repo}
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={handlePaste}
              className="px-4 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📋 Paste
            </motion.button>
            <motion.button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-3 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 Examples
            </motion.button>
          </div>

          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 rounded-lg border border-zinc-700 bg-zinc-950/80 overflow-hidden"
              >
                {EXAMPLE_REPOS.map((example) => (
                  <button
                    key={example.name}
                    onClick={() => handleExampleSelect(example.url)}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors font-mono"
                  >
                    {example.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-zinc-400">Mode:</span>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setMode("roast")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === "roast"
                  ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/50"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔥 Roast
            </motion.button>
            <motion.button
              onClick={() => setMode("praise")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === "praise"
                  ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/50"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ Praise
            </motion.button>
          </div>
        </div>

        {/* Token Input */}
        <motion.button
          onClick={() => setShowTokenInput(!showTokenInput)}
          className="text-sm text-zinc-400 hover:text-zinc-300 mb-2"
        >
          {showTokenInput ? "▼" : "▶"} Add GitHub Token (optional)
        </motion.button>

        <AnimatePresence>
          {showTokenInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-lg border border-zinc-600 bg-zinc-950/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Increases rate limits and allows access to private repos
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <motion.button
          onClick={onAnalyze}
          disabled={!isValid || loading}
          className={`w-full rounded-lg px-6 py-4 font-bold text-lg transition-all ${
            isValid && !loading
              ? mode === "roast"
                ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-500/50"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/50"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
          whileHover={isValid && !loading ? { scale: 1.02 } : {}}
          whileTap={isValid && !loading ? { scale: 0.98 } : {}}
        >
          {loading
            ? "Analyzing..."
            : mode === "roast"
            ? "🔥 Ignite Roast"
            : "✨ Generate Praise"}
        </motion.button>
      </motion.div>
    </div>
  );
}

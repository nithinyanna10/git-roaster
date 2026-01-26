"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./Card";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

type LLMProvider = "openai" | "anthropic" | "google" | "ollama" | "none";

interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  enabled: boolean;
}

export function MultiLLMSupport() {
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>("none");
  const [configs, setConfigs] = useState<Record<LLMProvider, LLMConfig>>({
    openai: {
      provider: "openai",
      model: "gpt-4",
      apiKey: "",
      enabled: false,
    },
    anthropic: {
      provider: "anthropic",
      model: "claude-3-opus",
      apiKey: "",
      enabled: false,
    },
    google: {
      provider: "google",
      model: "gemini-pro",
      apiKey: "",
      enabled: false,
    },
    ollama: {
      provider: "ollama",
      model: "llama2",
      apiKey: "",
      enabled: false,
    },
    none: {
      provider: "none",
      model: "template",
      apiKey: "",
      enabled: true,
    },
  });

  const providers = [
    { id: "openai" as const, name: "OpenAI", models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"], icon: "🤖" },
    { id: "anthropic" as const, name: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"], icon: "🧠" },
    { id: "google" as const, name: "Google", models: ["gemini-pro", "gemini-ultra"], icon: "🔮" },
    { id: "ollama" as const, name: "Ollama", models: ["llama2", "mistral", "codellama"], icon: "🦙" },
    { id: "none" as const, name: "Template (No LLM)", models: ["template"], icon: "📝" },
  ];

  const updateConfig = (provider: LLMProvider, updates: Partial<LLMConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], ...updates },
    }));
  };

  const testConnection = (provider: LLMProvider) => {
    if (provider === "none") {
      showToast("Template mode doesn't require API connection");
      return;
    }

    const config = configs[provider];
    if (!config.apiKey) {
      showToast("Please enter an API key first");
      return;
    }

    showToast(`Testing ${providers.find((p) => p.id === provider)?.name} connection...`);
    // In production, this would make an actual API call
    setTimeout(() => {
      showToast("Connection successful! (Simulated)");
    }, 1500);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Multi-LLM Support</h3>
        <p className="text-zinc-400 text-sm">Switch between GPT-4, Claude, Gemini, and Ollama models</p>
      </div>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select LLM Provider</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedProvider === provider.id
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                <div className="text-2xl mb-1">{provider.icon}</div>
                <div className="font-bold text-sm">{provider.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">
                {providers.find((p) => p.id === selectedProvider)?.icon}{" "}
                {providers.find((p) => p.id === selectedProvider)?.name}
              </h4>
              <Toggle
                checked={configs[selectedProvider].enabled}
                onChange={(enabled) => updateConfig(selectedProvider, { enabled })}
              />
            </div>

            {selectedProvider !== "none" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <select
                    value={configs[selectedProvider].model}
                    onChange={(e) => updateConfig(selectedProvider, { model: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {providers
                      .find((p) => p.id === selectedProvider)
                      ?.models.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={configs[selectedProvider].apiKey}
                    onChange={(e) => updateConfig(selectedProvider, { apiKey: e.target.value })}
                    placeholder={`Enter ${providers.find((p) => p.id === selectedProvider)?.name} API key`}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <Button
                  onClick={() => testConnection(selectedProvider)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  🔌 Test Connection
                </Button>
              </>
            )}

            {selectedProvider === "none" && (
              <div className="text-sm text-zinc-400">
                Template mode uses predefined roast/praise templates without LLM integration. This is the default mode.
              </div>
            )}
          </motion.div>
        )}

        {/* Active Provider Status */}
        <div className="glass rounded-lg p-4 bg-green-900/20 border border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-green-300 mb-1">Active Provider</div>
              <div className="text-sm text-green-300/80">
                {providers.find((p) => p.id === selectedProvider && configs[selectedProvider].enabled)?.icon}{" "}
                {providers.find((p) => p.id === selectedProvider)?.name} - {configs[selectedProvider].model}
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mt-6 glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Note:</strong> LLM integration requires API keys and backend implementation. Currently supports configuration UI only.
        </p>
      </div>
    </Card>
  );
}

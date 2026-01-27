"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Contributor {
  id: string;
  name: string;
  expertise: string[];
  contributions: number;
  files: string[];
  languages: string[];
}

interface KnowledgeGraphProps {
  analysis: Analysis;
}

export function KnowledgeGraph({ analysis }: KnowledgeGraphProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate knowledge graph from analysis
    // In production, this would analyze actual contributor data from GitHub API
    const generateKnowledgeGraph = async () => {
      setIsLoading(true);
      
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockContributors: Contributor[] = [
        {
          id: "1",
          name: "alice-dev",
          expertise: ["TypeScript", "React", "Frontend Architecture"],
          contributions: 234,
          files: ["src/components/", "src/hooks/", "src/utils/"],
          languages: ["TypeScript", "TSX", "CSS"],
        },
        {
          id: "2",
          name: "bob-backend",
          expertise: ["Node.js", "API Design", "Database"],
          contributions: 189,
          files: ["src/api/", "src/db/", "src/middleware/"],
          languages: ["TypeScript", "SQL", "JavaScript"],
        },
        {
          id: "3",
          name: "charlie-ops",
          expertise: ["DevOps", "CI/CD", "Infrastructure"],
          contributions: 67,
          files: [".github/", "docker/", "scripts/"],
          languages: ["YAML", "Bash", "Dockerfile"],
        },
        {
          id: "4",
          name: "diana-design",
          expertise: ["UI/UX", "Design Systems", "Accessibility"],
          contributions: 145,
          files: ["src/styles/", "src/components/ui/"],
          languages: ["CSS", "SCSS", "TSX"],
        },
      ];

      setContributors(mockContributors);
      setIsLoading(false);
    };

    generateKnowledgeGraph();
  }, [analysis]);

  const getExpertiseColor = (expertise: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500/20 text-blue-300",
      React: "bg-cyan-500/20 text-cyan-300",
      "Frontend Architecture": "bg-purple-500/20 text-purple-300",
      "Node.js": "bg-green-500/20 text-green-300",
      "API Design": "bg-yellow-500/20 text-yellow-300",
      Database: "bg-orange-500/20 text-orange-300",
      DevOps: "bg-red-500/20 text-red-300",
      "CI/CD": "bg-pink-500/20 text-pink-300",
      Infrastructure: "bg-indigo-500/20 text-indigo-300",
      "UI/UX": "bg-rose-500/20 text-rose-300",
      "Design Systems": "bg-violet-500/20 text-violet-300",
      Accessibility: "bg-teal-500/20 text-teal-300",
    };
    return colors[expertise] || "bg-zinc-500/20 text-zinc-300";
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="text-xl font-bold">Knowledge Graph</h3>
            <p className="text-sm text-zinc-400">Map contributor expertise areas</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Analyzing contributor expertise...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contributors.map((contributor) => (
            <motion.div
              key={contributor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedContributor(contributor)}
              className={`p-4 glass rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                selectedContributor?.id === contributor.id ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">{contributor.name}</h4>
                <span className="text-xs text-zinc-400">{contributor.contributions} contributions</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-zinc-400 mb-2">Expertise Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {contributor.expertise.map((exp) => (
                      <span
                        key={exp}
                        className={`px-2 py-1 rounded text-xs ${getExpertiseColor(exp)}`}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 mb-2">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {contributor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 mb-1">Key Files</div>
                  <div className="text-xs text-zinc-500 truncate">
                    {contributor.files.slice(0, 3).join(", ")}
                    {contributor.files.length > 3 && "..."}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedContributor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4 border border-purple-500/50"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">{selectedContributor.name}</h4>
            <button
              onClick={() => setSelectedContributor(null)}
              className="text-zinc-400 hover:text-zinc-300"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-400">Total Contributions: </span>
              <span className="font-semibold">{selectedContributor.contributions}</span>
            </div>
            <div>
              <span className="text-zinc-400">Primary Files: </span>
              <span className="text-zinc-300">{selectedContributor.files.join(", ")}</span>
            </div>
            <div>
              <span className="text-zinc-400">Expertise: </span>
              <span className="text-zinc-300">{selectedContributor.expertise.join(", ")}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-xs text-zinc-500">
        💡 In production, analyze actual commit history, file ownership, and code review patterns to build accurate expertise maps.
      </div>
    </Card>
  );
}

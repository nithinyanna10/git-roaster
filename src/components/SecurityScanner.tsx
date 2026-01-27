"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface Vulnerability {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  file?: string;
  line?: number;
  cwe?: string;
  source: "snyk" | "sonarqube" | "github" | "custom";
}

interface SecurityScannerProps {
  analysis: Analysis;
  repoUrl: string;
}

export function SecurityScanner({ analysis, repoUrl }: SecurityScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedSource, setSelectedSource] = useState<"snyk" | "sonarqube" | "github" | "all">("all");

  const scanForVulnerabilities = async () => {
    setIsScanning(true);
    showToast("Scanning for security vulnerabilities...");

    try {
      // In production, this would integrate with:
      // - Snyk API
      // - SonarQube API
      // - GitHub Security Advisories API
      // - Custom security scanning tools

      // Simulated vulnerabilities for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockVulnerabilities: Vulnerability[] = [
        {
          id: "1",
          severity: "high",
          title: "Outdated dependency: lodash@4.17.20",
          description: "lodash version 4.17.20 has known security vulnerabilities. Update to 4.17.21 or later.",
          source: "snyk",
          cwe: "CWE-79",
        },
        {
          id: "2",
          severity: "medium",
          title: "Hardcoded API key detected",
          description: "Potential API key found in source code. Consider using environment variables.",
          file: "src/config.ts",
          line: 42,
          source: "sonarqube",
          cwe: "CWE-798",
        },
        {
          id: "3",
          severity: "critical",
          title: "SQL Injection vulnerability",
          description: "User input not properly sanitized in database queries.",
          file: "src/db/queries.ts",
          line: 128,
          source: "github",
          cwe: "CWE-89",
        },
        {
          id: "4",
          severity: "low",
          title: "Missing security headers",
          description: "Consider adding security headers like CSP, X-Frame-Options, etc.",
          source: "custom",
        },
      ];

      setVulnerabilities(mockVulnerabilities);
      showToast(`Found ${mockVulnerabilities.length} potential vulnerabilities`);
    } catch (error) {
      showToast("Failed to scan for vulnerabilities");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: Vulnerability["severity"]) => {
    const colors = {
      critical: "bg-red-500/20 border-red-500 text-red-300",
      high: "bg-orange-500/20 border-orange-500 text-orange-300",
      medium: "bg-yellow-500/20 border-yellow-500 text-yellow-300",
      low: "bg-blue-500/20 border-blue-500 text-blue-300",
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: Vulnerability["severity"]) => {
    const icons = {
      critical: "🔴",
      high: "🟠",
      medium: "🟡",
      low: "🔵",
    };
    return icons[severity];
  };

  const filteredVulnerabilities = vulnerabilities.filter(
    (v) => selectedSource === "all" || v.source === selectedSource
  );

  const severityCounts = {
    critical: vulnerabilities.filter((v) => v.severity === "critical").length,
    high: vulnerabilities.filter((v) => v.severity === "high").length,
    medium: vulnerabilities.filter((v) => v.severity === "medium").length,
    low: vulnerabilities.filter((v) => v.severity === "low").length,
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="text-xl font-bold">Security Vulnerability Scanner</h3>
            <p className="text-sm text-zinc-400">Integration with Snyk, SonarQube, GitHub</p>
          </div>
        </div>
        <Button
          onClick={scanForVulnerabilities}
          disabled={isScanning}
          variant="primary"
          size="sm"
        >
          {isScanning ? "Scanning..." : "🔍 Scan Now"}
        </Button>
      </div>

      {vulnerabilities.length > 0 && (
        <>
          {/* Severity Summary */}
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(severityCounts).map(([severity, count]) => (
              <div
                key={severity}
                className={`p-3 rounded-lg border text-center ${getSeverityColor(severity as Vulnerability["severity"])}`}
              >
                <div className="text-2xl mb-1">
                  {getSeverityIcon(severity as Vulnerability["severity"])}
                </div>
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs capitalize">{severity}</div>
              </div>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex gap-2">
            {(["all", "snyk", "sonarqube", "github"] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  selectedSource === source
                    ? "bg-purple-500 text-white"
                    : "glass text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </button>
            ))}
          </div>

          {/* Vulnerabilities List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredVulnerabilities.map((vuln) => (
                <motion.div
                  key={vuln.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(vuln.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getSeverityIcon(vuln.severity)}</span>
                      <h4 className="font-semibold">{vuln.title}</h4>
                    </div>
                    <span className="text-xs text-zinc-400 capitalize">{vuln.source}</span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{vuln.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    {vuln.file && (
                      <span>
                        📄 {vuln.file}
                        {vuln.line && `:${vuln.line}`}
                      </span>
                    )}
                    {vuln.cwe && <span>🔗 CWE-{vuln.cwe}</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {vulnerabilities.length === 0 && !isScanning && (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2">🔍</div>
          <p>Click "Scan Now" to check for security vulnerabilities</p>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Integrate with Snyk API, SonarQube API, or GitHub Security Advisories for real-time scanning.
      </div>
    </Card>
  );
}

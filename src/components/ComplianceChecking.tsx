"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface ComplianceRule {
  id: string;
  name: string;
  standard: "SOC2" | "ISO27001" | "GDPR" | "HIPAA" | "PCI-DSS" | "Custom";
  status: "pass" | "fail" | "warning";
  description: string;
  requirement: string;
}

interface ComplianceCheckingProps {
  analysis: Analysis;
}

export function ComplianceChecking({ analysis }: ComplianceCheckingProps) {
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceRule["standard"] | "all">("all");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkCompliance();
  }, [analysis]);

  const checkCompliance = async () => {
    setIsChecking(true);

    // Simulate compliance checking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockRules: ComplianceRule[] = [
      {
        id: "1",
        name: "Access Control",
        standard: "SOC2",
        status: analysis.scores.busFactor > 50 ? "pass" : "warning",
        description: "Multiple contributors with access controls",
        requirement: "At least 3 active contributors",
      },
      {
        id: "2",
        name: "Data Encryption",
        standard: "ISO27001",
        status: "warning",
        description: "Check for encryption in transit and at rest",
        requirement: "All sensitive data encrypted",
      },
      {
        id: "3",
        name: "Audit Logging",
        standard: "SOC2",
        status: analysis.scores.pulse > 40 ? "pass" : "fail",
        description: "Commit history provides audit trail",
        requirement: "Complete audit log of all changes",
      },
      {
        id: "4",
        name: "Documentation",
        standard: "ISO27001",
        status: analysis.scores.health > 60 ? "pass" : "warning",
        description: "README and documentation present",
        requirement: "Comprehensive documentation",
      },
      {
        id: "5",
        name: "Security Testing",
        standard: "PCI-DSS",
        status: "warning",
        description: "Security vulnerability scanning",
        requirement: "Regular security testing",
      },
      {
        id: "6",
        name: "Privacy Policy",
        standard: "GDPR",
        status: "fail",
        description: "Privacy policy and data handling documentation",
        requirement: "GDPR-compliant privacy policy",
      },
      {
        id: "7",
        name: "Code Review Process",
        standard: "SOC2",
        status: analysis.scores.busFactor > 40 ? "pass" : "warning",
        description: "Pull request reviews and code quality",
        requirement: "Mandatory code reviews",
      },
      {
        id: "8",
        name: "Backup & Recovery",
        standard: "ISO27001",
        status: "warning",
        description: "Backup and disaster recovery procedures",
        requirement: "Regular backups and recovery plan",
      },
    ];

    setRules(mockRules);
    setIsChecking(false);
  };

  const getStatusColor = (status: ComplianceRule["status"]) => {
    const colors = {
      pass: "bg-green-500/20 text-green-300 border-green-500",
      fail: "bg-red-500/20 text-red-300 border-red-500",
      warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    };
    return colors[status];
  };

  const getStatusIcon = (status: ComplianceRule["status"]) => {
    const icons = {
      pass: "✅",
      fail: "❌",
      warning: "⚠️",
    };
    return icons[status];
  };

  const filteredRules = rules.filter(
    (rule) => selectedStandard === "all" || rule.standard === selectedStandard
  );

  const passCount = rules.filter((r) => r.status === "pass").length;
  const failCount = rules.filter((r) => r.status === "fail").length;
  const warningCount = rules.filter((r) => r.status === "warning").length;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="text-xl font-bold">Compliance Checking</h3>
            <p className="text-sm text-zinc-400">Ensure repos meet company standards</p>
          </div>
        </div>
        <Button onClick={checkCompliance} disabled={isChecking} variant="secondary" size="sm">
          {isChecking ? "Checking..." : "🔄 Recheck"}
        </Button>
      </div>

      {/* Summary */}
      {rules.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 glass rounded-lg text-center border border-green-500/50">
            <div className="text-2xl font-bold text-green-400">{passCount}</div>
            <div className="text-xs text-zinc-400">Pass</div>
          </div>
          <div className="p-3 glass rounded-lg text-center border border-yellow-500/50">
            <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-zinc-400">Warning</div>
          </div>
          <div className="p-3 glass rounded-lg text-center border border-red-500/50">
            <div className="text-2xl font-bold text-red-400">{failCount}</div>
            <div className="text-xs text-zinc-400">Fail</div>
          </div>
        </div>
      )}

      {/* Standard Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "SOC2", "ISO27001", "GDPR", "HIPAA", "PCI-DSS"] as const).map((standard) => (
          <button
            key={standard}
            onClick={() => setSelectedStandard(standard)}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              selectedStandard === standard
                ? "bg-purple-500 text-white"
                : "glass text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {standard}
          </button>
        ))}
      </div>

      {/* Compliance Rules */}
      {isChecking ? (
        <div className="text-center py-8 text-zinc-400">
          <div className="text-4xl mb-2 animate-spin">🌀</div>
          <p>Checking compliance...</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border-l-4 ${getStatusColor(rule.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStatusIcon(rule.status)}</span>
                    <div>
                      <h5 className="font-semibold">{rule.name}</h5>
                      <span className="text-xs text-zinc-400">{rule.standard}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-zinc-800 capitalize">
                    {rule.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mb-2">{rule.description}</p>
                <div className="text-xs">
                  <span className="text-zinc-400">Requirement: </span>
                  <span className="text-zinc-300">{rule.requirement}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Compliance checking helps ensure your repository meets industry standards and company policies. Customize rules based on your organization's requirements.
      </div>
    </Card>
  );
}

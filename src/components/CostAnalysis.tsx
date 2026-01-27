"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";

interface CostBreakdown {
  category: string;
  monthly: number;
  annual: number;
  description: string;
  percentage: number;
}

interface CostAnalysisProps {
  analysis: Analysis;
}

export function CostAnalysis({ analysis }: CostAnalysisProps) {
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);

  useEffect(() => {
    // Estimate maintenance costs based on repo metrics
    const calculateCosts = () => {
      const linesOfCode = 50000; // Estimated, would come from actual analysis
      const contributors = analysis.scores.busFactor / 10; // Rough estimate
      const complexity = analysis.scores.churn;
      const health = analysis.scores.health;

      // Base costs
      const developerHourlyRate = 100; // $100/hour average
      const hoursPerMonth = 40; // Full-time equivalent

      // Calculate costs based on metrics
      const maintenanceCost = Math.max(
        1000,
        (linesOfCode / 1000) * 50 + (complexity / 100) * 500
      );
      const infrastructureCost = 200 + (health < 50 ? 300 : 0); // Higher if unhealthy
      const supportCost = contributors * developerHourlyRate * hoursPerMonth * 0.1; // 10% of FTE
      const technicalDebtCost = health < 50 ? 1500 : health < 70 ? 800 : 300;
      const testingCost = 500 + (analysis.scores.pulse / 100) * 300;

      const breakdown: CostBreakdown[] = [
        {
          category: "Maintenance & Bug Fixes",
          monthly: maintenanceCost,
          annual: maintenanceCost * 12,
          description: "Ongoing maintenance, bug fixes, and small improvements",
          percentage: (maintenanceCost / (maintenanceCost + infrastructureCost + supportCost + technicalDebtCost + testingCost)) * 100,
        },
        {
          category: "Infrastructure",
          monthly: infrastructureCost,
          annual: infrastructureCost * 12,
          description: "CI/CD, hosting, monitoring, and DevOps tools",
          percentage: (infrastructureCost / (maintenanceCost + infrastructureCost + supportCost + technicalDebtCost + testingCost)) * 100,
        },
        {
          category: "Support & Documentation",
          monthly: supportCost,
          annual: supportCost * 12,
          description: "Developer support, documentation, and onboarding",
          percentage: (supportCost / (maintenanceCost + infrastructureCost + supportCost + technicalDebtCost + testingCost)) * 100,
        },
        {
          category: "Technical Debt",
          monthly: technicalDebtCost,
          annual: technicalDebtCost * 12,
          description: "Refactoring, modernization, and debt reduction",
          percentage: (technicalDebtCost / (maintenanceCost + infrastructureCost + supportCost + technicalDebtCost + testingCost)) * 100,
        },
        {
          category: "Testing & QA",
          monthly: testingCost,
          annual: testingCost * 12,
          description: "Test development, QA, and quality assurance",
          percentage: (testingCost / (maintenanceCost + infrastructureCost + supportCost + technicalDebtCost + testingCost)) * 100,
        },
      ];

      const monthly = breakdown.reduce((sum, item) => sum + item.monthly, 0);
      const annual = breakdown.reduce((sum, item) => sum + item.annual, 0);

      setCostBreakdown(breakdown);
      setTotalMonthly(monthly);
      setTotalAnnual(annual);
    };

    calculateCosts();
  }, [analysis]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💰</span>
        <div>
          <h3 className="text-xl font-bold">Cost Analysis</h3>
          <p className="text-sm text-zinc-400">Estimate maintenance costs</p>
        </div>
      </div>

      {/* Total Costs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {formatCurrency(totalMonthly)}
          </div>
          <div className="text-xs text-zinc-400">Monthly</div>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {formatCurrency(totalAnnual)}
          </div>
          <div className="text-xs text-zinc-400">Annual</div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">Cost Breakdown</h4>
        {costBreakdown.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">{item.category}</span>
              <span className="font-semibold">{formatCurrency(item.monthly)}/mo</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              />
            </div>
            <div className="text-xs text-zinc-500">{item.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Cost Factors */}
      <div className="glass rounded-lg p-4 space-y-2 text-sm">
        <h4 className="text-sm font-semibold text-zinc-400">Cost Factors</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Repo Health:</span>
            <span className={analysis.scores.health < 50 ? "text-red-400" : "text-green-400"}>
              {analysis.scores.health < 50 ? "High Cost Impact" : "Normal Cost"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Complexity (Churn):</span>
            <span className="text-zinc-300">{analysis.scores.churn}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Bus Factor:</span>
            <span className="text-zinc-300">{analysis.scores.busFactor}%</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-zinc-500">
        💡 Cost estimates based on industry averages, repo complexity, health metrics, and team size. Actual costs may vary.
      </div>
    </Card>
  );
}

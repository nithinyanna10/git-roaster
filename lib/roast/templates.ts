import { Metrics, Narrative, Claim } from "@/types";

interface TemplateLine {
  text: string;
  evidenceKeys: string[];
  condition: (metrics: Metrics) => boolean;
}

const roastTemplates: TemplateLine[] = [
  // Inactivity
  {
    text: "This repo has been collecting digital dust for {daysSinceLastCommit} days.",
    evidenceKeys: ["daysSinceLastCommit"],
    condition: (m) => m.daysSinceLastCommit > 180,
  },
  {
    text: "Last commit was {daysSinceLastCommit} days ago. Your code misses you.",
    evidenceKeys: ["daysSinceLastCommit"],
    condition: (m) => m.daysSinceLastCommit > 90 && m.daysSinceLastCommit <= 180,
  },
  {
    text: "With only {commitsLast30Days} commits in the last month, this repo is running on fumes.",
    evidenceKeys: ["commitsLast30Days"],
    condition: (m) => m.commitsLast30Days < 5 && m.daysSinceLastCommit < 90,
  },
  
  // Bus Factor
  {
    text: "{topContributorName} is doing {topContributorPct}% of the work. What happens if they win the lottery?",
    evidenceKeys: ["topContributorName", "topContributorPct"],
    condition: (m) => m.topContributorPct > 80,
  },
  {
    text: "This is basically {topContributorName}'s solo project ({topContributorPct}% of commits).",
    evidenceKeys: ["topContributorName", "topContributorPct"],
    condition: (m) => m.topContributorPct > 60 && m.topContributorPct <= 80,
  },
  {
    text: "Only {uniqueContributors90Days} contributor{plural} in the last 90 days. Team effort?",
    evidenceKeys: ["uniqueContributors90Days"],
    condition: (m) => m.uniqueContributors90Days <= 2,
  },
  
  // Tests & CI
  {
    text: "No tests detected. Living dangerously, I see.",
    evidenceKeys: ["hasTests"],
    condition: (m) => !m.hasTests,
  },
  {
    text: "No CI/CD? Hope you're manually testing everything. (Spoiler: you're not.)",
    evidenceKeys: ["hasCI"],
    condition: (m) => !m.hasCI,
  },
  {
    text: "No tests AND no CI? This is a recipe for midnight debugging sessions.",
    evidenceKeys: ["hasTests", "hasCI"],
    condition: (m) => !m.hasTests && !m.hasCI,
  },
  
  // Releases
  {
    text: "Zero releases. Is this code even real?",
    evidenceKeys: ["releasesCount"],
    condition: (m) => m.releasesCount === 0,
  },
  {
    text: "Last release was {daysSinceLastRelease} days ago. Users are still waiting.",
    evidenceKeys: ["daysSinceLastRelease"],
    condition: (m) => m.daysSinceLastRelease !== null && m.daysSinceLastRelease > 180,
  },
  {
    text: "Only {releasesCount} release{plural} in the repo's lifetime. Quality over quantity?",
    evidenceKeys: ["releasesCount"],
    condition: (m) => m.releasesCount > 0 && m.releasesCount < 3,
  },
  
  // Churn
  {
    text: "With {churnRatio} lines changed per commit on average, this codebase is in constant flux.",
    evidenceKeys: ["churnRatio"],
    condition: (m) => m.churnRatio > 500,
  },
  {
    text: "{additionsLast90Days} additions and {deletionsLast90Days} deletions in 90 days. Refactoring or chaos?",
    evidenceKeys: ["additionsLast90Days", "deletionsLast90Days"],
    condition: (m) => m.additionsLast90Days + m.deletionsLast90Days > 10000,
  },
  
  // Docs
  {
    text: "No README found. Good luck, future you (or anyone else).",
    evidenceKeys: ["hasDocs"],
    condition: (m) => !m.hasDocs,
  },
  {
    text: "README exists but it's basically a haiku ({readmeLength} chars).",
    evidenceKeys: ["readmeLength"],
    condition: (m) => m.hasDocs && m.readmeLength < 500,
  },
  
  // Activity patterns
  {
    text: "Commit activity is {commitsTrend}. The momentum is real (or not).",
    evidenceKeys: ["commitsTrend"],
    condition: (m) => m.commitsTrend === "decreasing" && m.commitsLast30Days > 0,
  },
  {
    text: "Using {languageCount} different languages. Polyglot or indecisive?",
    evidenceKeys: ["languageCount"],
    condition: (m) => m.languageCount > 5,
  },
  {
    text: "Stable commit trend? More like stagnant. {commitsLast30Days} commits in 30 days is... something.",
    evidenceKeys: ["commitsLast30Days", "commitsTrend"],
    condition: (m) => m.commitsTrend === "stable" && m.commitsLast30Days < 10,
  },
  {
    text: "This repo has {commitsLast90Days} commits in 90 days. At this rate, you'll finish by 2050.",
    evidenceKeys: ["commitsLast90Days"],
    condition: (m) => m.commitsLast90Days < 20 && m.commitsLast90Days > 0,
  },
  {
    text: "High churn ({churnRatio} lines/commit) but low activity ({commitsLast30Days} commits). Pick a struggle.",
    evidenceKeys: ["churnRatio", "commitsLast30Days"],
    condition: (m) => m.churnRatio > 300 && m.commitsLast30Days < 10,
  },
  {
    text: "Language diversity of {languageCount}? That's not polyglot, that's chaos.",
    evidenceKeys: ["languageCount"],
    condition: (m) => m.languageCount > 8,
  },
  {
    text: "Single language project? At least you're consistent. Boring, but consistent.",
    evidenceKeys: ["languageCount"],
    condition: (m) => m.languageCount === 1,
  },
];

const praiseTemplates: TemplateLine[] = [
  // Activity
  {
    text: "Active and thriving! {commitsLast30Days} commits in the last month shows real momentum.",
    evidenceKeys: ["commitsLast30Days"],
    condition: (m) => m.commitsLast30Days > 20,
  },
  {
    text: "Last commit was just {daysSinceLastCommit} days ago. This repo is well-maintained.",
    evidenceKeys: ["daysSinceLastCommit"],
    condition: (m) => m.daysSinceLastCommit < 7,
  },
  {
    text: "Commit activity is {commitsTrend}. Great to see consistent progress!",
    evidenceKeys: ["commitsTrend"],
    condition: (m) => m.commitsTrend === "increasing",
  },
  
  // Team
  {
    text: "Excellent bus factor! {uniqueContributors90Days} contributors in the last 90 days means this isn't a one-person show.",
    evidenceKeys: ["uniqueContributors90Days"],
    condition: (m) => m.uniqueContributors90Days > 5,
  },
  {
    text: "Work is well-distributed with {topContributorPct}% from the top contributor. Healthy collaboration!",
    evidenceKeys: ["topContributorPct"],
    condition: (m) => m.topContributorPct < 50,
  },
  
  // Quality
  {
    text: "Tests are present. You're thinking about quality, and that matters.",
    evidenceKeys: ["hasTests"],
    condition: (m) => m.hasTests,
  },
  {
    text: "CI/CD is set up. Automation is your friend, and you're using it well.",
    evidenceKeys: ["hasCI"],
    condition: (m) => m.hasCI,
  },
  {
    text: "Both tests and CI/CD? You're doing it right. This is how maintainable projects are built.",
    evidenceKeys: ["hasTests", "hasCI"],
    condition: (m) => m.hasTests && m.hasCI,
  },
  
  // Releases
  {
    text: "Regular releases ({releasesCount} total) show you're shipping to users. That's the goal!",
    evidenceKeys: ["releasesCount"],
    condition: (m) => m.releasesCount > 10,
  },
  {
    text: "Last release was {daysSinceLastRelease} days ago. Fresh updates keep users happy.",
    evidenceKeys: ["daysSinceLastRelease"],
    condition: (m) => m.daysSinceLastRelease !== null && m.daysSinceLastRelease < 30,
  },
  {
    text: "Release frequency of {releaseFrequency} per month shows consistent delivery.",
    evidenceKeys: ["releaseFrequency"],
    condition: (m) => m.releaseFrequency > 0.5,
  },
  
  // Docs
  {
    text: "README exists and is comprehensive ({readmeLength} chars). Future contributors will thank you.",
    evidenceKeys: ["readmeLength"],
    condition: (m) => m.hasDocs && m.readmeLength > 1000,
  },
  {
    text: "Documentation is present. You're making the project accessible to others.",
    evidenceKeys: ["hasDocs"],
    condition: (m) => m.hasDocs,
  },
  
  // Stability
  {
    text: "Low churn ratio ({churnRatio}) suggests thoughtful, stable development.",
    evidenceKeys: ["churnRatio"],
    condition: (m) => m.churnRatio > 0 && m.churnRatio < 200 && m.commitsLast90Days > 10,
  },
  {
    text: "Excellent activity with {commitsLast30Days} commits and {commitsLast7Days} in the last week. This is what momentum looks like!",
    evidenceKeys: ["commitsLast30Days", "commitsLast7Days"],
    condition: (m) => m.commitsLast30Days > 15 && m.commitsLast7Days > 3,
  },
  {
    text: "Strong contributor diversity with {uniqueContributors90Days} people contributing. This is a real team effort!",
    evidenceKeys: ["uniqueContributors90Days"],
    condition: (m) => m.uniqueContributors90Days > 8,
  },
  {
    text: "Balanced contribution pattern with top contributor at {topContributorPct}%. Healthy collaboration!",
    evidenceKeys: ["topContributorPct"],
    condition: (m) => m.topContributorPct < 40 && m.topContributorPct > 0,
  },
  {
    text: "Impressive release cadence: {releasesCount} releases with {releaseFrequency} per month. You're shipping!",
    evidenceKeys: ["releasesCount", "releaseFrequency"],
    condition: (m) => m.releasesCount > 5 && m.releaseFrequency > 0.3,
  },
  {
    text: "Comprehensive documentation ({readmeLength} chars) shows you care about onboarding. Well done!",
    evidenceKeys: ["readmeLength"],
    condition: (m) => m.readmeLength > 2000,
  },
  {
    text: "Recent release just {daysSinceLastRelease} days ago shows active maintenance. Users appreciate this!",
    evidenceKeys: ["daysSinceLastRelease"],
    condition: (m) => m.daysSinceLastRelease !== null && m.daysSinceLastRelease < 14,
  },
];

function interpolate(text: string, metrics: Metrics): string {
  let result = text;
  const metricsAny = metrics as any;
  
  // First, handle plural markers by finding the number before them
  result = result.replace(/(\{[\w]+\})\s*\{plural\}/g, (match, numberKey) => {
    const key = numberKey.replace(/[{}]/g, "");
    const value = metricsAny[key];
    if (value === undefined) return match;
    const num = typeof value === "number" ? value : parseInt(String(value), 10);
    if (isNaN(num)) return match;
    return `${num}${num !== 1 ? "s" : ""}`;
  });
  
  // Replace remaining {key} with values
  result = result.replace(/\{(\w+)\}/g, (match, key) => {
    const value = metricsAny[key];
    if (value === undefined) return match;
    
    if (key.includes("Days") || key.includes("Release")) {
      return value?.toString() || "N/A";
    }
    if (typeof value === "boolean") {
      return value ? "yes" : "no";
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value);
  });
  
  return result;
}

export function generateTemplateNarrative(
  metrics: Metrics,
  mode: "roast" | "praise"
): Narrative {
  const templates = mode === "roast" ? roastTemplates : praiseTemplates;
  
  // Filter templates that match conditions
  const matchingTemplates = templates.filter((t) => t.condition(metrics));
  
  // Select 3-5 templates
  const selected = matchingTemplates.slice(0, 5);
  
  // If no templates match, use fallbacks
  if (selected.length === 0) {
    if (mode === "roast") {
      selected.push({
        text: "This repo exists. That's... something.",
        evidenceKeys: [],
        condition: () => true,
      });
    } else {
      selected.push({
        text: "This repo is being worked on. Keep it up!",
        evidenceKeys: [],
        condition: () => true,
      });
    }
  }
  
  // Generate claims
  const claims: Claim[] = selected.map((template) => ({
    text: interpolate(template.text, metrics),
    evidenceKeys: template.evidenceKeys,
  }));
  
  // Combine into narrative
  const narrativeText = claims.map((c) => c.text).join(" ");
  
  return {
    text: narrativeText,
    claims,
  };
}

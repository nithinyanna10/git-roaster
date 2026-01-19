import { Mode, Metrics, Scores, Verdicts, Claim, Narrative, Citation } from "@/types/analysis";

const ROAST_TEMPLATES = [
  "This repo has been collecting digital dust for {daysSinceLastCommit} days.",
  "With only {commits30d} commits in the last month, this codebase is running on fumes.",
  "{topContributorPct90d}% of commits from one person. What happens if they win the lottery?",
  "No tests detected. Living dangerously, I see.",
  "No CI/CD? Hope you're manually testing everything. (Spoiler: you're not.)",
  "Zero releases. Is this code even real?",
  "Last release was {lastReleaseDays} days ago. Users are still waiting.",
  "With {churn30d} lines changed per commit on average, this codebase is in constant flux.",
  "Only {uniqueContributors90d} contributor{plural} in the last 90 days. Team effort?",
  "Issue response time: {medianIssueFirstResponseHours} hours. Users love waiting.",
  "PR merge rate: {prMergeRate}%. Most PRs die in review purgatory.",
];

const PRAISE_TEMPLATES = [
  "Active and thriving! {commits30d} commits in the last month shows real momentum.",
  "Last commit was just {daysSinceLastCommit} days ago. This repo is well-maintained.",
  "Excellent bus factor! {uniqueContributors90d} contributors means this isn't a one-person show.",
  "Tests are present. You're thinking about quality, and that matters.",
  "CI/CD is set up. Automation is your friend, and you're using it well.",
  "Regular releases ({releasesCount} total) show you're shipping to users.",
  "Low churn ratio suggests thoughtful, stable development.",
  "Issue response time of {medianIssueFirstResponseHours} hours shows active maintenance.",
  "PR merge rate of {prMergeRate}% shows healthy collaboration.",
];

const AUDIT_TEMPLATES = [
  "Repository analysis for {fullName} reveals {opsHealth} operational status.",
  "Activity metrics: {commits30d} commits (30d), {commits90d} commits (90d).",
  "Code churn analysis: {churn30d} lines changed in last 30 days across {filesTouched30d} files.",
  "Contributor distribution: {topContributorPct90d}% from top contributor, {uniqueContributors90d} unique contributors (90d).",
  "Quality signals: Tests {hasTests}, CI/CD {hasCI}, Documentation score {docsScore}/100.",
  "Release cadence: {releasesCount} releases, average {avgDaysBetweenReleases} days between releases.",
  "Issue management: {issuesOpened30d} opened, {issuesClosed30d} closed (30d), {issuesStalePct90d}% stale.",
  "PR metrics: {prsOpened30d} opened, {prsMerged30d} merged, {prMergeRate}% merge rate.",
  "Risk assessment: {riskLevel} risk level based on bus factor, inactivity, and quality signals.",
];

const INVESTOR_TEMPLATES = [
  "Investment Snapshot: {fullName} demonstrates {momentum} momentum with {stars90d} stars gained (90d).",
  "Developer engagement: {commits90d} commits, {uniqueContributors90d} active contributors, {newContributors90d} new contributors (90d).",
  "Product velocity: {releasesCount} releases, {prsMerged30d} PRs merged (30d), indicating active development.",
  "Community health: {issuesClosed30d}/{issuesOpened30d} issues resolved, {prMergeRate}% PR merge rate.",
  "Operational maturity: {opsHealth} status, {hasCI} CI/CD, {testsSignalScore}/100 test coverage score.",
  "Risk factors: {riskLevel} risk level. Key concerns: {topContributorPct90d}% dependency on single contributor.",
  "Growth signals: {stars30d} stars (30d), {forks30d} forks (30d), {momentum} trajectory.",
];

function interpolate(text: string, metrics: Metrics, repoName: string): string {
  let result = text;
  const metricsAny = metrics as any;

  result = result.replace(/\{(\w+)\}/g, (match, key) => {
    if (key === "fullName") return repoName;
    if (key === "plural") {
      const value = metricsAny["uniqueContributors90d"] || 0;
      return value !== 1 ? "s" : "";
    }
    const value = metricsAny[key];
    if (value === undefined) return match;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      if (key.includes("Days") || key.includes("Hours")) {
        return value.toLocaleString();
      }
      if (key.includes("Pct") || key.includes("Rate") || key.includes("Score")) {
        return value.toFixed(1);
      }
      return value.toLocaleString();
    }
    return String(value);
  });

  return result;
}

export function generateNarrative(
  mode: Mode,
  metrics: Metrics,
  scores: Scores,
  verdicts: Verdicts,
  claims: Claim[],
  repoName: string
): Narrative {
  const templates =
    mode === "roast"
      ? ROAST_TEMPLATES
      : mode === "praise"
      ? PRAISE_TEMPLATES
      : mode === "audit"
      ? AUDIT_TEMPLATES
      : INVESTOR_TEMPLATES;

  // Select 3-5 templates that match conditions
  const selectedTemplates = templates.slice(0, 5);
  const sentences: string[] = [];
  const citations: Citation[] = [];
  let citationIndex = 1;

  selectedTemplates.forEach((template) => {
    const sentence = interpolate(template, metrics, repoName);
    sentences.push(sentence);

    // Find matching claims for this sentence
    const matchingClaims = claims.filter((claim) => {
      const claimLower = claim.text.toLowerCase();
      const sentenceLower = sentence.toLowerCase();
      return claim.evidenceKeys.some((key) => {
        const metricValue = (metrics as any)[key];
        return sentenceLower.includes(String(metricValue).toLowerCase()) || claimLower.includes(key.toLowerCase());
      });
    });

    if (matchingClaims.length > 0) {
      const firstClaim = matchingClaims[0];
      if (firstClaim.evidenceKeys.length > 0) {
        citations.push({
          marker: `[${citationIndex}]`,
          evidenceKey: firstClaim.evidenceKeys[0],
        });
        citationIndex++;
      }
    }
  });

  // Build text with citations
  let textWithCitations = sentences.join(" ");
  citations.forEach((citation, idx) => {
    const marker = citation.marker;
    // Insert citation markers after relevant sentences
    const sentenceIndex = Math.min(idx, sentences.length - 1);
    const words = textWithCitations.split(" ");
    const insertIndex = Math.floor((sentenceIndex / sentences.length) * words.length);
    words.splice(insertIndex, 0, marker);
    textWithCitations = words.join(" ");
  });

  return {
    mode,
    textWithCitations,
    citations,
  };
}

export function remixNarrative(
  currentNarrative: Narrative,
  metrics: Metrics,
  scores: Scores,
  verdicts: Verdicts,
  claims: Claim[],
  repoName: string
): Narrative {
  // Shuffle sentence order and slightly rephrase
  const sentences = currentNarrative.textWithCitations.split(/\[(\d+)\]/).filter(Boolean);
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  
  // Keep citations but reorder
  const newCitations = [...currentNarrative.citations].sort(() => Math.random() - 0.5);
  
  return {
    ...currentNarrative,
    textWithCitations: shuffled.join(" "),
    citations: newCitations,
  };
}

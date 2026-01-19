import { Analysis, RepoInfo, Series, Metrics, Claim, Evidence } from "@/types/analysis";
import { computeScores, computeVerdicts } from "./scoring";
import { generateNarrative } from "./narrative";
import { addWeeks, subWeeks, formatISO, parseISO } from "date-fns";

function generateTimeSeries(weeks: number, startDate: Date) {
  const commits: any[] = [];
  const churn: any[] = [];
  const issues: any[] = [];
  const prs: any[] = [];
  const stars: any[] = [];
  const contributors: any[] = [];

  for (let i = 0; i < weeks; i++) {
    const weekStart = subWeeks(startDate, weeks - i - 1);
    const weekISO = formatISO(weekStart, { representation: "date" });

    commits.push({
      weekStartISO: weekISO,
      commits: Math.floor(Math.random() * 30) + 5,
    });

    const additions = Math.floor(Math.random() * 2000) + 500;
    const deletions = Math.floor(Math.random() * 1000) + 200;
    churn.push({
      weekStartISO: weekISO,
      additions,
      deletions,
      filesTouched: Math.floor(Math.random() * 50) + 10,
    });

    issues.push({
      weekStartISO: weekISO,
      opened: Math.floor(Math.random() * 10) + 1,
      closed: Math.floor(Math.random() * 8) + 1,
      medianFirstResponseHours: Math.floor(Math.random() * 72) + 2,
    });

    prs.push({
      weekStartISO: weekISO,
      opened: Math.floor(Math.random() * 8) + 1,
      merged: Math.floor(Math.random() * 6) + 1,
      closed: Math.floor(Math.random() * 2),
      medianMergeHours: Math.floor(Math.random() * 48) + 4,
    });

    stars.push({
      weekStartISO: weekISO,
      starsGained: Math.floor(Math.random() * 20),
    });

    contributors.push({
      weekStartISO: weekISO,
      newContributors: Math.floor(Math.random() * 3),
    });
  }

  return { commits, churn, issues, prs, stars, contributors };
}

function generateKeyframes(series: Series) {
  const keyframes: any[] = [];
  let index = 0;

  // Peak commit week
  const peakCommit = series.weeklyCommits.reduce((max, curr) =>
    curr.commits > max.commits ? curr : max
  );
  keyframes.push({
    id: "peak-commits",
    title: "Peak Week",
    subtitle: "Massive feature push",
    dateLabel: peakCommit.weekStartISO,
    stats: { commits: peakCommit.commits },
    index: index++,
  });

  // Peak churn week
  const peakChurn = series.weeklyChurn.reduce((max, curr) =>
    curr.additions + curr.deletions > max.additions + max.deletions ? curr : max
  );
  keyframes.push({
    id: "peak-churn",
    title: "Refactor Wave",
    subtitle: "Highest code churn",
    dateLabel: peakChurn.weekStartISO,
    stats: {
      additions: peakChurn.additions,
      deletions: peakChurn.deletions,
    },
    index: index++,
  });

  // Last release
  if (series.releases.length > 0) {
    const lastRelease = series.releases[series.releases.length - 1];
    keyframes.push({
      id: "last-release",
      title: "Latest Release",
      subtitle: lastRelease.name || lastRelease.tag,
      dateLabel: lastRelease.dateISO,
      stats: { tag: lastRelease.tag },
      index: index++,
    });
  }

  return keyframes;
}

export function generateMockAnalysis(
  repoInput: string,
  mode: "roast" | "praise" | "audit" | "investor",
  timeWindowDays: number = 90
): Analysis {
  // Parse repo
  const repoMatch = repoInput.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
  const owner = repoMatch ? repoMatch[1] : "example";
  const name = repoMatch ? repoMatch[2] : "repo";
  const fullName = `${owner}/${name}`;

  const now = new Date();
  const weeks = Math.ceil(timeWindowDays / 7);
  const { commits, churn, issues, prs, stars, contributors } = generateTimeSeries(weeks, now);

  // Generate releases
  const releases = [];
  const releaseCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < releaseCount; i++) {
    const releaseDate = subWeeks(now, Math.floor(Math.random() * weeks));
    releases.push({
      dateISO: formatISO(releaseDate, { representation: "date" }),
      tag: `v${releaseCount - i}.0.0`,
      name: `Release ${releaseCount - i}.0.0`,
    });
  }

  const series: Series = {
    weeklyCommits: commits,
    weeklyChurn: churn,
    weeklyIssues: issues,
    weeklyPRs: prs,
    weeklyStars: stars,
    weeklyContributors: contributors,
    releases: releases.sort((a, b) => b.dateISO.localeCompare(a.dateISO)),
    keyframes: [],
  };

  series.keyframes = generateKeyframes(series);

  // Compute metrics
  const commits30d = commits.slice(-4).reduce((sum, w) => sum + w.commits, 0);
  const commits90d = commits.reduce((sum, w) => sum + w.commits, 0);
  const churn30d = churn.slice(-4).reduce((sum, w) => sum + w.additions + w.deletions, 0);
  const churn90d = churn.reduce((sum, w) => sum + w.additions + w.deletions, 0);
  const filesTouched30d = churn.slice(-4).reduce((sum, w) => sum + w.filesTouched, 0);

  const metrics: Metrics = {
    daysSinceLastCommit: Math.floor(Math.random() * 30) + 1,
    commits30d,
    commits90d,
    churn30d,
    churn90d,
    filesTouched30d,
    topContributorPct90d: Math.floor(Math.random() * 60) + 30,
    uniqueContributors90d: Math.floor(Math.random() * 10) + 3,
    hasTests: Math.random() > 0.3,
    testsSignalScore: Math.floor(Math.random() * 100),
    hasCI: Math.random() > 0.2,
    ciWorkflowsCount: Math.floor(Math.random() * 3) + 1,
    releasesCount: releases.length,
    lastReleaseDays: releases.length > 0 ? Math.floor((now.getTime() - parseISO(releases[0].dateISO).getTime()) / (1000 * 60 * 60 * 24)) : null,
    avgDaysBetweenReleases: releases.length > 1 ? Math.floor(timeWindowDays / releases.length) : 0,
    docsScore: Math.floor(Math.random() * 60) + 40,
    hasReadme: Math.random() > 0.1,
    hasContributing: Math.random() > 0.5,
    hasChangelog: Math.random() > 0.6,
    issuesOpened30d: issues.slice(-4).reduce((sum, w) => sum + w.opened, 0),
    issuesClosed30d: issues.slice(-4).reduce((sum, w) => sum + w.closed, 0),
    issuesStalePct90d: Math.floor(Math.random() * 40) + 10,
    medianIssueFirstResponseHours: Math.floor(Math.random() * 48) + 2,
    prsOpened30d: prs.slice(-4).reduce((sum, w) => sum + w.opened, 0),
    prsMerged30d: prs.slice(-4).reduce((sum, w) => sum + w.merged, 0),
    prsClosed30d: prs.slice(-4).reduce((sum, w) => sum + w.closed, 0),
    prMergeRate: prs.slice(-4).reduce((sum, w) => sum + w.merged, 0) / Math.max(1, prs.slice(-4).reduce((sum, w) => sum + w.opened, 0)),
    medianPRMergeHours: Math.floor(Math.random() * 72) + 4,
    stars30d: stars.slice(-4).reduce((sum, w) => sum + w.starsGained, 0),
    stars90d: stars.reduce((sum, w) => sum + w.starsGained, 0),
    forks30d: Math.floor(Math.random() * 10),
    newContributors90d: contributors.reduce((sum, w) => sum + w.newContributors, 0),
  };

  const scores = computeScores(metrics);
  const verdicts = computeVerdicts(metrics, scores);

  // Generate claims
  const claims: Claim[] = [];
  if (metrics.daysSinceLastCommit > 180) {
    claims.push({
      id: "claim-1",
      text: `Repository inactive for ${metrics.daysSinceLastCommit} days`,
      severity: "risk",
      evidenceKeys: ["daysSinceLastCommit"],
      relatedTiles: ["pulse"],
    });
  }
  if (metrics.topContributorPct90d > 80) {
    claims.push({
      id: "claim-2",
      text: `High bus factor risk: ${metrics.topContributorPct90d}% of commits from single contributor`,
      severity: "warn",
      evidenceKeys: ["topContributorPct90d"],
      relatedTiles: ["busFactor"],
    });
  }
  if (!metrics.hasCI) {
    claims.push({
      id: "claim-3",
      text: "No CI/CD detected",
      severity: "warn",
      evidenceKeys: ["hasCI"],
      relatedTiles: ["ci"],
    });
  }
  if (!metrics.hasTests) {
    claims.push({
      id: "claim-4",
      text: "No tests detected",
      severity: "warn",
      evidenceKeys: ["hasTests"],
      relatedTiles: ["tests"],
    });
  }
  if (metrics.releasesCount === 0) {
    claims.push({
      id: "claim-5",
      text: "Zero releases",
      severity: "info",
      evidenceKeys: ["releasesCount"],
      relatedTiles: ["releases"],
    });
  }

  // Generate evidence
  const evidence: Record<string, Evidence> = {};
  Object.entries(metrics).forEach(([key, value]) => {
    evidence[key] = {
      key,
      value,
      prettyValue: typeof value === "number" ? value.toLocaleString() : String(value),
      source: "GitHub API (Mock)",
      retrievedAtISO: new Date().toISOString(),
      confidence: 95,
      explanation: `Metric ${key} computed from repository data`,
    };
  });

  const narrative = generateNarrative(mode, metrics, scores, verdicts, claims, fullName);

  const repo: RepoInfo = {
    owner,
    name,
    fullName,
    description: `A ${name} repository for ${owner}`,
    stars: Math.floor(Math.random() * 1000) + 100,
    forks: Math.floor(Math.random() * 200) + 20,
    watchers: Math.floor(Math.random() * 100) + 10,
    languageBreakdown: {
      TypeScript: 45,
      JavaScript: 30,
      CSS: 15,
      Other: 10,
    },
    createdAt: subWeeks(now, 52).toISOString(),
    updatedAt: subWeeks(now, metrics.daysSinceLastCommit / 7).toISOString(),
  };

  return {
    repo,
    timeWindowDays,
    series,
    metrics,
    scores,
    verdicts,
    claims,
    evidence,
    narrative,
  };
}

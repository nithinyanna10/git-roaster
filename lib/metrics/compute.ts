import { RepoInfo, Commit, Metrics, Scores } from "@/types";
import { getDaysBetween } from "@/lib/utils";

export function computeMetrics(
  repo: RepoInfo,
  commits: Commit[],
  releases: Array<{ publishedAt: string }>
): Metrics {
  const now = new Date().toISOString();
  
  // Pulse metrics
  const lastCommit = commits[0];
  const daysSinceLastCommit = lastCommit ? getDaysBetween(lastCommit.date, now) : 999;
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  
  const commitsLast7Days = commits.filter((c) => c.date >= sevenDaysAgo).length;
  const commitsLast30Days = commits.filter((c) => c.date >= thirtyDaysAgo).length;
  const commitsLast90Days = commits.filter((c) => c.date >= ninetyDaysAgo).length;
  
  // Commits trend
  const commits30to60Days = commits.filter(
    (c) => c.date >= new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() && c.date < thirtyDaysAgo
  ).length;
  let commitsTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (commitsLast30Days > commits30to60Days * 1.2) {
    commitsTrend = "increasing";
  } else if (commitsLast30Days < commits30to60Days * 0.8) {
    commitsTrend = "decreasing";
  }
  
  // Bus Factor
  const contributorCounts: Record<string, number> = {};
  commits.slice(0, 100).forEach((commit) => {
    contributorCounts[commit.author] = (contributorCounts[commit.author] || 0) + 1;
  });
  
  const sortedContributors = Object.entries(contributorCounts).sort((a, b) => b[1] - a[1]);
  const topContributor = sortedContributors[0];
  const topContributorPct = topContributor
    ? Math.round((topContributor[1] / Math.min(100, commits.length)) * 100)
    : 0;
  const topContributorName = topContributor ? topContributor[0] : "unknown";
  
  const uniqueContributors90Days = new Set(
    commits.filter((c) => c.date >= ninetyDaysAgo).map((c) => c.author)
  ).size;
  
  // Churn
  const recentCommits = commits.filter((c) => c.date >= ninetyDaysAgo);
  let additionsLast90Days = 0;
  let deletionsLast90Days = 0;
  
  recentCommits.forEach((commit) => {
    if (commit.stats) {
      additionsLast90Days += commit.stats.additions;
      deletionsLast90Days += commit.stats.deletions;
    }
  });
  
  const churnRatio =
    recentCommits.length > 0
      ? (additionsLast90Days + deletionsLast90Days) / recentCommits.length
      : 0;
  
  // Releases
  const lastRelease = releases[0];
  const daysSinceLastRelease = lastRelease
    ? getDaysBetween(lastRelease.publishedAt, now)
    : null;
  
  const repoAgeDays = getDaysBetween(repo.createdAt, now);
  const releaseFrequency = repoAgeDays > 0 ? (releases.length / repoAgeDays) * 30 : 0; // per month
  
  // Language count
  const languageCount = Object.keys(repo.languages).length;
  
  return {
    daysSinceLastCommit,
    commitsLast7Days,
    commitsLast30Days,
    commitsLast90Days,
    commitsTrend,
    topContributorPct,
    topContributorName,
    uniqueContributors90Days,
    additionsLast90Days,
    deletionsLast90Days,
    churnRatio,
    hasTests: repo.hasTests,
    hasCI: repo.hasCI,
    releasesCount: repo.releasesCount,
    daysSinceLastRelease,
    releaseFrequency,
    hasDocs: repo.hasDocs,
    readmeLength: repo.readmeLength || 0,
    fileCount: 0, // Not computed in MVP
    languageCount,
  };
}

export function computeScores(metrics: Metrics): Scores {
  // Pulse Score (0-100)
  // Higher score = more active
  let pulse = 100;
  if (metrics.daysSinceLastCommit > 365) pulse = 0;
  else if (metrics.daysSinceLastCommit > 180) pulse = 20;
  else if (metrics.daysSinceLastCommit > 90) pulse = 40;
  else if (metrics.daysSinceLastCommit > 30) pulse = 60;
  else if (metrics.daysSinceLastCommit > 7) pulse = 80;
  
  // Adjust based on recent activity
  if (metrics.commitsLast30Days > 50) pulse = Math.min(100, pulse + 20);
  else if (metrics.commitsLast30Days > 20) pulse = Math.min(100, pulse + 10);
  else if (metrics.commitsLast30Days < 5) pulse = Math.max(0, pulse - 20);
  
  if (metrics.commitsTrend === "increasing") pulse = Math.min(100, pulse + 10);
  else if (metrics.commitsTrend === "decreasing") pulse = Math.max(0, pulse - 10);
  
  // Stability Score (0-100)
  // Higher score = less churn (more stable)
  // Very high churn is bad, very low churn with activity is good
  let stability = 50;
  if (metrics.churnRatio > 1000) stability = 20; // Very high churn
  else if (metrics.churnRatio > 500) stability = 40;
  else if (metrics.churnRatio > 200) stability = 60;
  else if (metrics.churnRatio > 100) stability = 70;
  else if (metrics.churnRatio > 50) stability = 80;
  else if (metrics.churnRatio > 0) stability = 90;
  else stability = 30; // No churn but also no activity
  
  // If there's activity but low churn, that's good
  if (metrics.commitsLast90Days > 10 && metrics.churnRatio < 100) {
    stability = Math.min(100, stability + 10);
  }
  
  // Bus Factor Score (0-100)
  // Higher score = more distributed (better bus factor)
  let busFactor = 100;
  if (metrics.topContributorPct > 95) busFactor = 10;
  else if (metrics.topContributorPct > 80) busFactor = 30;
  else if (metrics.topContributorPct > 60) busFactor = 50;
  else if (metrics.topContributorPct > 40) busFactor = 70;
  else if (metrics.topContributorPct > 20) busFactor = 85;
  
  // Bonus for multiple contributors
  if (metrics.uniqueContributors90Days > 10) busFactor = Math.min(100, busFactor + 10);
  else if (metrics.uniqueContributors90Days > 5) busFactor = Math.min(100, busFactor + 5);
  else if (metrics.uniqueContributors90Days < 2) busFactor = Math.max(0, busFactor - 20);
  
  // Tests Score (0-100)
  let tests = 0;
  if (metrics.hasTests) tests = 80;
  if (metrics.hasCI) tests = Math.min(100, tests + 20);
  
  // Releases Score (0-100)
  let releases = 0;
  if (metrics.releasesCount === 0) releases = 20;
  else if (metrics.releasesCount < 3) releases = 40;
  else if (metrics.releasesCount < 10) releases = 60;
  else if (metrics.releasesCount < 20) releases = 80;
  else releases = 100;
  
  // Adjust based on recency
  if (metrics.daysSinceLastRelease !== null) {
    if (metrics.daysSinceLastRelease < 30) releases = Math.min(100, releases + 10);
    else if (metrics.daysSinceLastRelease > 365) releases = Math.max(0, releases - 30);
    else if (metrics.daysSinceLastRelease > 180) releases = Math.max(0, releases - 15);
  }
  
  // Adjust based on frequency
  if (metrics.releaseFrequency > 1) releases = Math.min(100, releases + 10);
  else if (metrics.releaseFrequency < 0.1) releases = Math.max(0, releases - 20);
  
  // Docs Score (0-100)
  let docs = 0;
  if (metrics.hasDocs) {
    docs = 60;
    if (metrics.readmeLength > 1000) docs = 80;
    if (metrics.readmeLength > 5000) docs = 100;
  }
  
  // Vibe Score (weighted average)
  const weights = {
    pulse: 0.25,
    stability: 0.20,
    busFactor: 0.15,
    tests: 0.15,
    releases: 0.15,
    docs: 0.10,
  };
  
  const vibe =
    pulse * weights.pulse +
    stability * weights.stability +
    busFactor * weights.busFactor +
    tests * weights.tests +
    releases * weights.releases +
    docs * weights.docs;
  
  return {
    pulse: Math.round(Math.max(0, Math.min(100, pulse))),
    stability: Math.round(Math.max(0, Math.min(100, stability))),
    busFactor: Math.round(Math.max(0, Math.min(100, busFactor))),
    tests: Math.round(Math.max(0, Math.min(100, tests))),
    releases: Math.round(Math.max(0, Math.min(100, releases))),
    docs: Math.round(Math.max(0, Math.min(100, docs))),
    vibe: Math.round(Math.max(0, Math.min(100, vibe))),
  };
}

export function generateChartData(commits: Commit[]) {
  // Group commits by week
  const commitsByWeek: Record<string, number> = {};
  const churnByWeek: Record<string, { additions: number; deletions: number }> = {};
  
  commits.forEach((commit) => {
    const date = new Date(commit.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split("T")[0];
    
    commitsByWeek[weekKey] = (commitsByWeek[weekKey] || 0) + 1;
    
    if (commit.stats) {
      if (!churnByWeek[weekKey]) {
        churnByWeek[weekKey] = { additions: 0, deletions: 0 };
      }
      churnByWeek[weekKey].additions += commit.stats.additions;
      churnByWeek[weekKey].deletions += commit.stats.deletions;
    }
  });
  
  const commitsOverTime = Object.entries(commitsByWeek)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-26); // Last 26 weeks
  
  const churnOverTime = Object.entries(churnByWeek)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-26); // Last 26 weeks
  
  return {
    commitsOverTime,
    churnOverTime,
  };
}

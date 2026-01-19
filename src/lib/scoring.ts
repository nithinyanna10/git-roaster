import { Metrics, Scores, Verdicts, OpsHealth, Momentum, RiskLevel } from "@/types/analysis";

export function computeScores(metrics: Metrics): Scores {
  // Pulse Score (0-100)
  let pulse = 100;
  if (metrics.daysSinceLastCommit > 365) pulse = 0;
  else if (metrics.daysSinceLastCommit > 180) pulse = 20;
  else if (metrics.daysSinceLastCommit > 90) pulse = 40;
  else if (metrics.daysSinceLastCommit > 30) pulse = 60;
  else if (metrics.daysSinceLastCommit > 7) pulse = 80;

  if (metrics.commits30d > 50) pulse = Math.min(100, pulse + 20);
  else if (metrics.commits30d > 20) pulse = Math.min(100, pulse + 10);
  else if (metrics.commits30d < 5) pulse = Math.max(0, pulse - 20);

  // Churn Score (0-100) - higher is better (stable)
  let churn = 50;
  const churnRatio = metrics.churn30d / Math.max(1, metrics.commits30d);
  if (churnRatio > 1000) churn = 20;
  else if (churnRatio > 500) churn = 40;
  else if (churnRatio > 200) churn = 60;
  else if (churnRatio > 100) churn = 70;
  else if (churnRatio > 50) churn = 80;
  else if (churnRatio > 0) churn = 90;
  else churn = 30;

  // Bus Factor Score (0-100)
  let busFactor = 100;
  if (metrics.topContributorPct90d > 95) busFactor = 10;
  else if (metrics.topContributorPct90d > 80) busFactor = 30;
  else if (metrics.topContributorPct90d > 60) busFactor = 50;
  else if (metrics.topContributorPct90d > 40) busFactor = 70;
  else if (metrics.topContributorPct90d > 20) busFactor = 85;

  if (metrics.uniqueContributors90d > 10) busFactor = Math.min(100, busFactor + 10);
  else if (metrics.uniqueContributors90d > 5) busFactor = Math.min(100, busFactor + 5);
  else if (metrics.uniqueContributors90d < 2) busFactor = Math.max(0, busFactor - 20);

  // Tests Score (0-100)
  let tests = 0;
  if (metrics.hasTests) tests = 60;
  tests += metrics.testsSignalScore * 0.4;

  // CI Score (0-100)
  let ci = 0;
  if (metrics.hasCI) ci = 80;
  ci += metrics.ciWorkflowsCount * 5;

  // Releases Score (0-100)
  let releases = 0;
  if (metrics.releasesCount === 0) releases = 20;
  else if (metrics.releasesCount < 3) releases = 40;
  else if (metrics.releasesCount < 10) releases = 60;
  else if (metrics.releasesCount < 20) releases = 80;
  else releases = 100;

  if (metrics.lastReleaseDays !== null) {
    if (metrics.lastReleaseDays < 30) releases = Math.min(100, releases + 10);
    else if (metrics.lastReleaseDays > 365) releases = Math.max(0, releases - 30);
    else if (metrics.lastReleaseDays > 180) releases = Math.max(0, releases - 15);
  }

  // Docs Score (0-100)
  let docs = metrics.docsScore;
  if (metrics.hasReadme) docs += 20;
  if (metrics.hasContributing) docs += 10;
  if (metrics.hasChangelog) docs += 10;
  docs = Math.min(100, docs);

  // Issues Score (0-100)
  let issues = 50;
  const issueResponseRate = metrics.medianIssueFirstResponseHours < 24 ? 1 : metrics.medianIssueFirstResponseHours < 168 ? 0.7 : 0.3;
  const issueClosureRate = metrics.issuesClosed30d / Math.max(1, metrics.issuesOpened30d);
  issues = (issueResponseRate * 50) + (issueClosureRate * 50);
  if (metrics.issuesStalePct90d > 50) issues = Math.max(0, issues - 30);

  // PRs Score (0-100)
  let prs = metrics.prMergeRate * 100;
  if (metrics.medianPRMergeHours < 24) prs = Math.min(100, prs + 20);
  else if (metrics.medianPRMergeHours > 168) prs = Math.max(0, prs - 20);

  // Momentum Score (0-100)
  let momentum = 50;
  if (metrics.stars30d > metrics.stars90d / 3) momentum = 80;
  else if (metrics.stars30d > 0) momentum = 60;
  if (metrics.newContributors90d > 5) momentum = Math.min(100, momentum + 20);
  else if (metrics.newContributors90d === 0) momentum = Math.max(0, momentum - 20);

  // Risk Score (0-100, higher = more risk)
  let risk = 0;
  if (metrics.daysSinceLastCommit > 180) risk += 30;
  if (metrics.topContributorPct90d > 80) risk += 25;
  if (!metrics.hasCI) risk += 20;
  if (metrics.testsSignalScore < 30) risk += 15;
  if (metrics.medianIssueFirstResponseHours > 168) risk += 10;
  risk = Math.min(100, risk);

  // Vibe Total (weighted average)
  const weights = {
    pulse: 0.15,
    churn: 0.10,
    busFactor: 0.10,
    tests: 0.08,
    ci: 0.08,
    releases: 0.10,
    docs: 0.08,
    issues: 0.10,
    prs: 0.08,
    momentum: 0.13,
  };

  const vibeTotal =
    pulse * weights.pulse +
    churn * weights.churn +
    busFactor * weights.busFactor +
    tests * weights.tests +
    ci * weights.ci +
    releases * weights.releases +
    docs * weights.docs +
    issues * weights.issues +
    prs * weights.prs +
    momentum * weights.momentum;

  return {
    vibeTotal: Math.round(vibeTotal),
    pulse: Math.round(pulse),
    churn: Math.round(churn),
    busFactor: Math.round(busFactor),
    tests: Math.round(tests),
    ci: Math.round(ci),
    releases: Math.round(releases),
    docs: Math.round(docs),
    issues: Math.round(issues),
    prs: Math.round(prs),
    momentum: Math.round(momentum),
    risk: Math.round(risk),
  };
}

export function computeVerdicts(metrics: Metrics, scores: Scores): Verdicts {
  // Ops Health
  let opsHealth: OpsHealth = "Healthy";
  if (metrics.commits90d === 0 && metrics.issuesClosed30d < 3) {
    opsHealth = "Unmaintained";
  } else if (!metrics.hasCI || metrics.testsSignalScore < 30 || metrics.medianPRMergeHours > 168) {
    opsHealth = "At Risk";
  }

  // Momentum
  let momentum: Momentum = "Flat";
  if (metrics.stars30d > metrics.stars90d / 3 && metrics.newContributors90d > 3) {
    momentum = "Rising";
  } else if (metrics.commits30d < metrics.commits90d / 3 && metrics.stars30d === 0) {
    momentum = "Falling";
  }

  // Risk Level
  let riskLevel: RiskLevel = "Low";
  if (scores.risk > 60) riskLevel = "High";
  else if (scores.risk > 30) riskLevel = "Medium";

  // Persona Badge
  let personaBadge = "Active Repo";
  if (metrics.daysSinceLastCommit > 365) personaBadge = "Digital Fossil";
  else if (!metrics.hasCI) personaBadge = "CI Gremlin";
  else if (metrics.topContributorPct90d > 80) personaBadge = "Bus Factor Bomb";
  else if (metrics.releasesCount === 0) personaBadge = "No-Ship Zone";
  else if (metrics.testsSignalScore < 30) personaBadge = "YOLO QA";
  else if (metrics.commits30d > 50 && metrics.churn30d > 10000) personaBadge = "Chaos Engine";
  else if (scores.vibeTotal > 80) personaBadge = "Well-Oiled Machine";

  return {
    opsHealth,
    momentum,
    riskLevel,
    personaBadge,
  };
}

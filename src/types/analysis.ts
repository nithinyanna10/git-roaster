export type Mode = "roast" | "praise" | "audit" | "investor";
export type CursorMode = "normal" | "inspector" | "arcade";
export type Severity = "info" | "warn" | "risk";
export type OpsHealth = "Healthy" | "At Risk" | "Unmaintained";
export type Momentum = "Rising" | "Flat" | "Falling";
export type RiskLevel = "Low" | "Medium" | "High";

export interface RepoInfo {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  languageBreakdown: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSeriesPoint {
  weekStartISO: string;
  [key: string]: string | number;
}

export interface WeeklyCommits extends TimeSeriesPoint {
  commits: number;
}

export interface WeeklyChurn extends TimeSeriesPoint {
  additions: number;
  deletions: number;
  filesTouched: number;
}

export interface WeeklyIssues extends TimeSeriesPoint {
  opened: number;
  closed: number;
  medianFirstResponseHours: number;
}

export interface WeeklyPRs extends TimeSeriesPoint {
  opened: number;
  merged: number;
  closed: number;
  medianMergeHours: number;
}

export interface WeeklyStars extends TimeSeriesPoint {
  starsGained: number;
}

export interface WeeklyContributors extends TimeSeriesPoint {
  newContributors: number;
}

export interface Release {
  dateISO: string;
  tag: string;
  name: string;
}

export interface Keyframe {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  stats: Record<string, number>;
  index: number;
}

export interface Series {
  weeklyCommits: WeeklyCommits[];
  weeklyChurn: WeeklyChurn[];
  weeklyIssues: WeeklyIssues[];
  weeklyPRs: WeeklyPRs[];
  weeklyStars: WeeklyStars[];
  weeklyContributors: WeeklyContributors[];
  releases: Release[];
  keyframes: Keyframe[];
}

export interface Metrics {
  daysSinceLastCommit: number;
  commits30d: number;
  commits90d: number;
  churn30d: number;
  churn90d: number;
  filesTouched30d: number;
  topContributorPct90d: number;
  uniqueContributors90d: number;
  hasTests: boolean;
  testsSignalScore: number;
  hasCI: boolean;
  ciWorkflowsCount: number;
  releasesCount: number;
  lastReleaseDays: number | null;
  avgDaysBetweenReleases: number;
  docsScore: number;
  hasReadme: boolean;
  hasContributing: boolean;
  hasChangelog: boolean;
  issuesOpened30d: number;
  issuesClosed30d: number;
  issuesStalePct90d: number;
  medianIssueFirstResponseHours: number;
  prsOpened30d: number;
  prsMerged30d: number;
  prsClosed30d: number;
  prMergeRate: number;
  medianPRMergeHours: number;
  stars30d: number;
  stars90d: number;
  forks30d: number;
  newContributors90d: number;
}

export interface Scores {
  vibeTotal: number;
  pulse: number;
  churn: number;
  busFactor: number;
  tests: number;
  ci: number;
  releases: number;
  docs: number;
  issues: number;
  prs: number;
  momentum: number;
  risk: number;
}

export interface Verdicts {
  opsHealth: OpsHealth;
  momentum: Momentum;
  riskLevel: RiskLevel;
  personaBadge: string;
}

export interface Claim {
  id: string;
  text: string;
  severity: Severity;
  evidenceKeys: string[];
  relatedTiles: string[];
}

export interface Evidence {
  key: string;
  value: any;
  prettyValue: string;
  source: string;
  retrievedAtISO: string;
  confidence: number;
  explanation: string;
}

export interface Citation {
  marker: string;
  evidenceKey: string;
}

export interface Narrative {
  mode: Mode;
  textWithCitations: string;
  citations: Citation[];
}

export interface Analysis {
  repo: RepoInfo;
  timeWindowDays: number;
  series: Series;
  metrics: Metrics;
  scores: Scores;
  verdicts: Verdicts;
  claims: Claim[];
  evidence: Record<string, Evidence>;
  narrative: Narrative;
}

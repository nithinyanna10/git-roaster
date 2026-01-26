export interface RepoInfo {
  owner: string;
  repo: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  languages: Record<string, number>;
  releasesCount: number;
  contributors: Contributor[];
  hasCI: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  readmeLength?: number;
}

export interface Contributor {
  login: string;
  contributions: number;
  avatarUrl?: string;
}

export interface Commit {
  sha: string;
  date: string;
  author: string;
  message: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number; }; files?: string[]; }

export interface Metrics {
  // Pulse
  daysSinceLastCommit: number;
  commitsLast7Days: number;
  commitsLast30Days: number;
  commitsLast90Days: number;
  commitsTrend: "increasing" | "decreasing" | "stable";
  
  // Bus Factor
  topContributorPct: number;
  topContributorName: string;
  uniqueContributors90Days: number;
  
  // Churn
  additionsLast90Days: number;
  deletionsLast90Days: number;
  churnRatio: number;
  
  // Tests & CI
  hasTests: boolean;
  hasCI: boolean;
  
  // Releases
  releasesCount: number;
  daysSinceLastRelease: number | null;
  releaseFrequency: number; // releases per month
  
  // Docs
  hasDocs: boolean;
  readmeLength: number;
  
  // Complexity
  fileCount: number;
  languageCount: number;
}

export interface Scores {
  pulse: number; // 0-100
  stability: number; // 0-100 (inverse of churn)
  busFactor: number; // 0-100
  tests: number; // 0-100
  releases: number; // 0-100
  docs: number; // 0-100
  vibe: number; // 0-100 (weighted average)
}

export interface Claim {
  text: string;
  evidenceKeys: string[];
}

export interface Narrative {
  text: string;
  claims: Claim[];
}

export interface AnalysisResult {
  repo: RepoInfo;
  metrics: Metrics;
  scores: Scores;
  narrative: Narrative;
  charts: {
    commitsOverTime: Array<{ date: string; count: number }>;
    churnOverTime: Array<{ date: string; additions: number; deletions: number }>;
  };
  cached: boolean;
}

export interface AnalyzeRequest {
  repoUrl: string;
  mode: "roast" | "praise";
  useLLM: boolean;
  githubToken?: string;
}

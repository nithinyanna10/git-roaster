import { RepoInfo, Series, Metrics } from "@/types/analysis";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubClientOptions {
  token?: string;
}

class GitHubClient {
  private token?: string;
  private rateLimitRemaining: number = 5000;
  private rateLimitReset: number = 0;

  constructor(options: GitHubClientOptions = {}) {
    this.token = options.token;
  }

  private async fetchWithRateLimit(url: string): Promise<Response> {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });

    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    if (remaining) this.rateLimitRemaining = parseInt(remaining, 10);
    if (reset) this.rateLimitReset = parseInt(reset, 10) * 1000;

    if (response.status === 403 && this.rateLimitRemaining === 0) {
      const resetTime = new Date(this.rateLimitReset).toLocaleString();
      throw new Error(
        `GitHub API rate limit exceeded. Reset at ${resetTime}. ${
          !this.token ? "Add a GitHub token to increase limits." : ""
        }`
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Repository not found. Check the URL and ensure it's a public repository.");
      }
      if (response.status === 403) {
        throw new Error("Access forbidden. The repository may be private. Add a GitHub token if you have access.");
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async getRepo(owner: string, repo: string): Promise<RepoInfo> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const response = await this.fetchWithRateLimit(url);
    const data = await response.json();

    // Get languages
    const languagesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
    const languagesResponse = await this.fetchWithRateLimit(languagesUrl);
    const languages = await languagesResponse.json();

    return {
      owner,
      name: data.name,
      fullName: `${owner}/${repo}`,
      description: data.description,
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.subscribers_count || 0,
      languageBreakdown: languages,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getCommits(owner: string, repo: string, since: Date, limit: number = 200): Promise<any[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100&page=1`;
    const response = await this.fetchWithRateLimit(url);
    const data = await response.json();
    return data.slice(0, limit);
  }

  async getIssues(owner: string, repo: string, state: "open" | "closed" | "all" = "all"): Promise<any[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=100&page=1`;
    const response = await this.fetchWithRateLimit(url);
    const data = await response.json();
    return data.filter((issue: any) => !issue.pull_request); // Exclude PRs
  }

  async getPRs(owner: string, repo: string, state: "open" | "closed" | "all" = "all"): Promise<any[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=${state}&per_page=100&page=1`;
    const response = await this.fetchWithRateLimit(url);
    return await response.json();
  }

  async getReleases(owner: string, repo: string): Promise<any[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=20&page=1`;
    try {
      const response = await this.fetchWithRateLimit(url);
      return await response.json();
    } catch {
      // If releases fail, try tags
      const tagsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=20&page=1`;
      const tagsResponse = await this.fetchWithRateLimit(tagsUrl);
      return await tagsResponse.json();
    }
  }
}

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(owner: string, repo: string, timeWindowDays: number): string {
  return `${owner}/${repo}:${timeWindowDays}`;
}

export async function fetchLiveAnalysis(
  repoInput: string,
  timeWindowDays: number,
  token?: string
): Promise<{ repo: RepoInfo; metrics: Partial<Metrics>; series: Partial<Series> }> {
  const repoMatch = repoInput.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
  if (!repoMatch) {
    throw new Error("Invalid repository format");
  }

  const owner = repoMatch[1];
  const repo = repoMatch[2];
  const cacheKey = getCacheKey(owner, repo, timeWindowDays);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const client = new GitHubClient({ token });

  try {
    const repoInfo = await client.getRepo(owner, repo);
    const since = new Date(Date.now() - timeWindowDays * 24 * 60 * 60 * 1000);
    const commits = await client.getCommits(owner, repo, since);
    const issues = await client.getIssues(owner, repo);
    const prs = await client.getPRs(owner, repo);
    const releases = await client.getReleases(owner, repo);

    // Compute basic metrics
    const daysSinceLastCommit = commits[0]
      ? Math.floor((Date.now() - new Date(commits[0].commit.author.date).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const commits30d = commits.filter(
      (c: any) => new Date(c.commit.author.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const commits90d = commits.length;

    // Check for CI
    let hasCI = false;
    try {
      const workflowsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/.github/workflows`;
      const workflowsResponse = await fetch(workflowsUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token ? { Authorization: `token ${token}` } : {}),
        },
      });
      hasCI = workflowsResponse.ok;
    } catch {
      // Ignore
    }

    // Check for README
    let hasReadme = false;
    try {
      const readmeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`;
      const readmeResponse = await fetch(readmeUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token ? { Authorization: `token ${token}` } : {}),
        },
      });
      hasReadme = readmeResponse.ok;
    } catch {
      // Ignore
    }

    const metrics: Partial<Metrics> = {
      daysSinceLastCommit,
      commits30d,
      commits90d,
      hasCI,
      hasReadme,
      releasesCount: releases.length,
      issuesOpened30d: issues.filter((i: any) => i.state === "open").length,
      prsOpened30d: prs.filter((p: any) => p.state === "open").length,
      prsMerged30d: prs.filter((p: any) => p.state === "closed" && p.merged_at).length,
    };

    const result = {
      repo: repoInfo,
      metrics,
      series: {
        releases: releases.slice(0, 20).map((r: any) => ({
          dateISO: r.published_at || r.created_at,
          tag: r.tag_name || r.name,
          name: r.name || r.tag_name,
        })),
      },
    };

    // Cache result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error: any) {
    throw new Error(`Failed to fetch from GitHub: ${error.message}`);
  }
}

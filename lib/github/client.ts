import { RepoInfo, Contributor, Commit } from "@/types";

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubClient {
  private token?: string;
  private rateLimitRemaining: number = 5000;
  private rateLimitReset: number = 0;

  constructor(token?: string) {
    this.token = token;
  }

  private async fetchWithRateLimit(url: string): Promise<Response> {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });

    // Update rate limit info
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

    // Check for CI workflows
    let hasCI = false;
    try {
      const workflowsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/.github/workflows`;
      const workflowsResponse = await fetch(workflowsUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(this.token ? { Authorization: `token ${this.token}` } : {}),
        },
      });
      hasCI = workflowsResponse.ok;
    } catch {
      // Ignore errors checking for workflows
    }

    // Check for README
    let hasDocs = false;
    let readmeLength = 0;
    try {
      const readmeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`;
      const readmeResponse = await fetch(readmeUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(this.token ? { Authorization: `token ${this.token}` } : {}),
        },
      });
      if (readmeResponse.ok) {
        hasDocs = true;
        const readmeData = await readmeResponse.json();
        // Decode base64 content length estimate
        if (readmeData.content) {
          try {
            // Use Buffer in Node.js, atob in Edge runtime
            if (typeof Buffer !== "undefined") {
              readmeLength = Buffer.from(readmeData.content, "base64").toString().length;
            } else if (typeof atob !== "undefined") {
              readmeLength = atob(readmeData.content.replace(/\s/g, "")).length;
            } else {
              // Fallback: estimate from base64 size (base64 is ~33% larger)
              readmeLength = Math.floor((readmeData.content.length * 3) / 4);
            }
          } catch {
            // Fallback: estimate from base64 size (base64 is ~33% larger)
            readmeLength = Math.floor((readmeData.content.length * 3) / 4);
          }
        }
      }
    } catch {
      // Ignore errors checking for README
    }

    // Check for test directories (heuristic)
    let hasTests = false;
    try {
      const contentsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`;
      const contentsResponse = await fetch(contentsUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(this.token ? { Authorization: `token ${this.token}` } : {}),
        },
      });
      if (contentsResponse.ok) {
        const contents = await contentsResponse.json();
        const testDirs = ["test", "tests", "__tests__", "spec", "specs"];
        hasTests = contents.some(
          (item: any) =>
            item.type === "dir" && testDirs.some((dir) => item.name.toLowerCase().includes(dir.toLowerCase()))
        );
      }
    } catch {
      // Ignore errors checking for tests
    }

    // Get languages
    const languagesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
    const languagesResponse = await this.fetchWithRateLimit(languagesUrl);
    const languages = await languagesResponse.json();

    // Get releases count
    const releasesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=1&page=1`;
    let releasesCount = 0;
    try {
      const releasesResponse = await this.fetchWithRateLimit(releasesUrl);
      const releasesLink = releasesResponse.headers.get("link");
      if (releasesLink) {
        const lastPageMatch = releasesLink.match(/page=(\d+)>; rel="last"/);
        if (lastPageMatch) {
          releasesCount = parseInt(lastPageMatch[1], 10);
        } else {
          const releases = await releasesResponse.json();
          releasesCount = releases.length;
        }
      } else {
        const releases = await releasesResponse.json();
        releasesCount = releases.length;
      }
    } catch {
      // If releases endpoint fails, try tags
      try {
        const tagsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=1&page=1`;
        const tagsResponse = await this.fetchWithRateLimit(tagsUrl);
        const tagsLink = tagsResponse.headers.get("link");
        if (tagsLink) {
          const lastPageMatch = tagsLink.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            releasesCount = parseInt(lastPageMatch[1], 10);
          }
        }
      } catch {
        // Ignore
      }
    }

    return {
      owner,
      repo,
      name: data.name,
      description: data.description,
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
      defaultBranch: data.default_branch || "main",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
      license: data.license?.name || null,
      languages,
      releasesCount,
      contributors: [], // Will be populated separately
      hasCI,
      hasDocs,
      hasTests,
      readmeLength: hasDocs ? readmeLength : 0,
    };
  }

  async getContributors(owner: string, repo: string, limit: number = 30): Promise<Contributor[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${limit}&page=1`;
    const response = await this.fetchWithRateLimit(url);
    const data = await response.json();

    return data.map((contributor: any) => ({
      login: contributor.login,
      contributions: contributor.contributions,
      avatarUrl: contributor.avatar_url,
    }));
  }

  async getCommits(
    owner: string,
    repo: string,
    limit: number = 200,
    branch?: string
  ): Promise<Commit[]> {
    const branchParam = branch ? `&sha=${branch}` : "";
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100&page=1${branchParam}`;
    
    const commits: Commit[] = [];
    let page = 1;
    const maxPages = Math.ceil(limit / 100);

    while (commits.length < limit && page <= maxPages) {
      const pageUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100&page=${page}${branchParam}`;
      const response = await this.fetchWithRateLimit(pageUrl);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) break;

      for (const commit of data) {
        if (commits.length >= limit) break;

        // Get commit stats if available
        let stats;
        try {
          const commitUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits/${commit.sha}`;
          const commitResponse = await this.fetchWithRateLimit(commitUrl);
          const commitData = await commitResponse.json();
          stats = commitData.stats
            ? {
                additions: commitData.stats.additions || 0,
                deletions: commitData.stats.deletions || 0,
                total: commitData.stats.total || 0,
              }
            : undefined;
        } catch {
          // If individual commit fetch fails, continue without stats
        }

        commits.push({
          sha: commit.sha,
          date: commit.commit.author.date,
          author: commit.commit.author.name || commit.author?.login || "unknown",
          message: commit.commit.message.split("\n")[0],
          stats,
        });
      }

      if (data.length < 100) break;
      page++;
    }

    return commits;
  }

  async getReleases(owner: string, repo: string, limit: number = 20): Promise<Array<{ publishedAt: string }>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=${limit}&page=1`;
    try {
      const response = await this.fetchWithRateLimit(url);
      const data = await response.json();
      return data.map((release: any) => ({
        publishedAt: release.published_at || release.created_at,
      }));
    } catch {
      // If releases fail, try tags
      try {
        const tagsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=${limit}&page=1`;
        const tagsResponse = await this.fetchWithRateLimit(tagsUrl);
        const tags = await tagsResponse.json();
        return tags.map((tag: any) => ({
          publishedAt: tag.commit?.commit?.author?.date || new Date().toISOString(),
        }));
      } catch {
        return [];
      }
    }
  }
}

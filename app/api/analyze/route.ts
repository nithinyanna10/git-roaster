import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl } from "@/lib/utils";
import { GitHubClient } from "@/lib/github/client";
import { computeMetrics, computeScores, generateChartData } from "@/lib/metrics/compute";
import { generateNarrative } from "@/lib/roast";
import { AnalyzeRequest, AnalysisResult } from "@/types";
import { LRUCache } from "lru-cache";

// In-memory cache (LRU, max 100 entries, TTL 1 hour)
const cache = new LRUCache<string, AnalysisResult>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
});

function getCacheKey(owner: string, repo: string, mode: string, useLLM: boolean): string {
  return `${owner}/${repo}:${mode}:${useLLM}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { repoUrl, mode, useLLM, githubToken } = body;

    // Parse URL
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Please provide a valid repository URL." },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Check cache
    const cacheKey = getCacheKey(owner, repo, mode, useLLM);
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // Initialize GitHub client
    const client = new GitHubClient(githubToken || process.env.GITHUB_TOKEN);

    // Fetch repo data
    const repoInfo = await client.getRepo(owner, repo);
    
    // Fetch contributors
    const contributors = await client.getContributors(owner, repo, 30);
    repoInfo.contributors = contributors;

    // Fetch commits (limit to 200 for performance)
    const commits = await client.getCommits(owner, repo, 200, repoInfo.defaultBranch);

    // Fetch releases
    const releases = await client.getReleases(owner, repo, 20);

    // Compute metrics
    const metrics = computeMetrics(repoInfo, commits, releases);

    // Compute scores
    const scores = computeScores(metrics);

    // Generate narrative
    const { narrative, usedLLM } = await generateNarrative(
      metrics,
      mode,
      useLLM,
      repoInfo.name
    );

    // Generate chart data
    const charts = generateChartData(commits);

    // Build result
    const result: AnalysisResult = {
      repo: repoInfo,
      metrics,
      scores,
      narrative,
      charts,
      cached: false,
    };

    // Cache result
    cache.set(cacheKey, result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze repository" },
      { status: 500 }
    );
  }
}

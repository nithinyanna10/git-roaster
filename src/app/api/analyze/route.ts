import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { fetchLiveAnalysis } from "@/lib/github";
import { computeScores, computeVerdicts } from "@/lib/scoring";
import { generateNarrative } from "@/lib/narrative";
import { Analysis } from "@/types/analysis";

const analyzeSchema = z.object({
  repo: z.string().min(1),
  mode: z.enum(["roast", "praise", "audit", "investor"]),
  timeWindowDays: z.number().int().min(30).max(365).default(90),
  liveGithub: z.boolean().default(false),
  token: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = analyzeSchema.parse(body);

    let analysis: Analysis;

    if (validated.liveGithub) {
      try {
        const liveData = await fetchLiveAnalysis(
          validated.repo,
          validated.timeWindowDays,
          validated.token
        );

        // Merge live data with mock for complete analysis
        const mock = generateMockAnalysis(validated.repo, validated.mode, validated.timeWindowDays);
        
        // Override with live data where available
        analysis = {
          ...mock,
          repo: liveData.repo,
          metrics: {
            ...mock.metrics,
            ...liveData.metrics,
          },
          series: {
            ...mock.series,
            ...liveData.series,
          },
        };

        // Recompute scores and verdicts with updated metrics
        analysis.scores = computeScores(analysis.metrics);
        analysis.verdicts = computeVerdicts(analysis.metrics, analysis.scores);
        analysis.narrative = generateNarrative(
          validated.mode,
          analysis.metrics,
          analysis.scores,
          analysis.verdicts,
          analysis.claims,
          analysis.repo.fullName
        );
      } catch (error: any) {
        // Fallback to mock on error
        analysis = generateMockAnalysis(validated.repo, validated.mode, validated.timeWindowDays);
      }
    } else {
      analysis = generateMockAnalysis(validated.repo, validated.mode, validated.timeWindowDays);
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to analyze repository" },
      { status: 500 }
    );
  }
}

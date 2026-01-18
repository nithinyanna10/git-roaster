import { generateTemplateNarrative } from "@/lib/roast/templates";
import { Metrics } from "@/types";

describe("generateTemplateNarrative", () => {
  const baseMetrics: Metrics = {
    daysSinceLastCommit: 0,
    commitsLast7Days: 0,
    commitsLast30Days: 0,
    commitsLast90Days: 0,
    commitsTrend: "stable",
    topContributorPct: 0,
    topContributorName: "unknown",
    uniqueContributors90Days: 0,
    additionsLast90Days: 0,
    deletionsLast90Days: 0,
    churnRatio: 0,
    hasTests: false,
    hasCI: false,
    releasesCount: 0,
    daysSinceLastRelease: null,
    releaseFrequency: 0,
    hasDocs: false,
    readmeLength: 0,
    fileCount: 0,
    languageCount: 0,
  };

  it("should generate roast narrative", () => {
    const metrics: Metrics = {
      ...baseMetrics,
      daysSinceLastCommit: 200,
      hasTests: false,
      hasCI: false,
    };

    const result = generateTemplateNarrative(metrics, "roast");
    expect(result.text).toBeTruthy();
    expect(result.claims.length).toBeGreaterThan(0);
    expect(result.claims[0].evidenceKeys.length).toBeGreaterThan(0);
  });

  it("should generate praise narrative", () => {
    const metrics: Metrics = {
      ...baseMetrics,
      daysSinceLastCommit: 2,
      commitsLast30Days: 25,
      hasTests: true,
      hasCI: true,
      uniqueContributors90Days: 8,
    };

    const result = generateTemplateNarrative(metrics, "praise");
    expect(result.text).toBeTruthy();
    expect(result.claims.length).toBeGreaterThan(0);
  });

  it("should include evidence keys in claims", () => {
    const metrics: Metrics = {
      ...baseMetrics,
      daysSinceLastCommit: 365,
      topContributorPct: 95,
    };

    const result = generateTemplateNarrative(metrics, "roast");
    result.claims.forEach((claim) => {
      expect(Array.isArray(claim.evidenceKeys)).toBe(true);
    });
  });
});

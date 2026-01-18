import { parseGitHubUrl, validateGitHubUrl, getDaysBetween } from "@/lib/utils";

describe("parseGitHubUrl", () => {
  it("should parse standard GitHub URLs", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("should parse URLs with .git extension", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo.git")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("should parse owner/repo format", () => {
    expect(parseGitHubUrl("owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("should return null for invalid URLs", () => {
    expect(parseGitHubUrl("not-a-url")).toBeNull();
    expect(parseGitHubUrl("https://gitlab.com/owner/repo")).toBeNull();
  });
});

describe("validateGitHubUrl", () => {
  it("should validate correct URLs", () => {
    expect(validateGitHubUrl("https://github.com/owner/repo")).toBe(true);
    expect(validateGitHubUrl("owner/repo")).toBe(true);
  });

  it("should reject invalid URLs", () => {
    expect(validateGitHubUrl("invalid")).toBe(false);
    expect(validateGitHubUrl("")).toBe(false);
  });
});

describe("getDaysBetween", () => {
  it("should calculate days between dates", () => {
    const date1 = "2024-01-01T00:00:00Z";
    const date2 = "2024-01-11T00:00:00Z";
    expect(getDaysBetween(date1, date2)).toBe(10);
  });

  it("should handle same date", () => {
    const date = "2024-01-01T00:00:00Z";
    expect(getDaysBetween(date, date)).toBe(0);
  });
});

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Handle various GitHub URL formats
    const patterns = [
      /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/|$)/,
      /^github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/|$)/,
      /^([^\/]+)\/([^\/]+?)$/,
    ];

    for (const pattern of patterns) {
      const match = url.trim().match(pattern);
      if (match) {
        const owner = match[1];
        const repo = match[2].replace(/\.git$/, "").split("/")[0].split("?")[0];
        if (owner && repo) {
          return { owner, repo };
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function validateGitHubUrl(url: string): boolean {
  return parseGitHubUrl(url) !== null;
}

export function formatDaysAgo(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export function getDaysBetween(date1: string, date2: string = new Date().toISOString()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateShareLink(owner: string, repo: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}?repo=${encodeURIComponent(`${owner}/${repo}`)}`;
}

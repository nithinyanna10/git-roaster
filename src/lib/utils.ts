export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
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

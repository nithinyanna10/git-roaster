import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params;
  const baseUrl = request.nextUrl.origin;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  // Generate RSS feed XML
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Git Roaster - ${owner}/${repo}</title>
    <link>${baseUrl}</link>
    <description>RSS feed for ${owner}/${repo} repository analysis updates</description>
    <atom:link href="${baseUrl}/api/rss/${owner}/${repo}" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>Repository Analysis Available</title>
      <link>${baseUrl}?repo=${encodeURIComponent(repoUrl)}</link>
      <description>New analysis available for ${owner}/${repo}. Click to view the roast!</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/api/rss/${owner}/${repo}#${Date.now()}</guid>
    </item>
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

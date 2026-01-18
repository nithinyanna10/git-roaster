import { Metrics, Narrative, Claim } from "@/types";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "cogito-2.1:671b-cloud";

export async function generateOllamaNarrative(
  metrics: Metrics,
  mode: "roast" | "praise",
  repoName: string
): Promise<Narrative | null> {
  try {
    // Prepare metrics as JSON for the prompt
    const metricsJson = JSON.stringify(metrics, null, 2);
    
    const tone = mode === "roast" 
      ? "playful, witty, and slightly sarcastic critique that points out issues in a humorous way. Be more critical and point out problems, but keep it fun and codebase-focused, not personal."
      : "genuinely supportive, encouraging, and positive feedback that highlights strengths and good practices. Be warm, appreciative, and constructive.";
    
    const prompt = `You are analyzing a GitHub repository called "${repoName}". 

Here are the exact metrics (ONLY use these, do not invent facts):

${metricsJson}

Generate a ${tone} about this repository. Rules:
1. Reference ONLY the metrics provided above
2. No insults about people; only codebase/process humor
3. ${mode === "roast" ? "Be more critical, point out issues, use humor and wit. Make it clear this is a roast." : "Be genuinely positive, highlight what's good, be encouraging and supportive. Make it clear this is praise."}
4. Write 1 paragraph (4-6 sentences) that is distinctly ${mode === "roast" ? "critical and humorous" : "positive and encouraging"}
5. Then provide 5-6 bullet points mapping specific claims to metric keys

Format your response as JSON:
{
  "narrative": "your paragraph here",
  "claims": [
    {"text": "claim 1", "evidenceKeys": ["metricKey1", "metricKey2"]},
    {"text": "claim 2", "evidenceKeys": ["metricKey3"]},
    ...
  ]
}

Only respond with valid JSON, no other text.`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: mode === "roast" ? 0.8 : 0.6,
        },
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.response || "";
    
    // Try to extract JSON from the response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find JSON in code blocks
      jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonMatch = [jsonMatch[0], jsonMatch[1]];
      }
    }
    
    if (!jsonMatch) {
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    
    // Validate structure
    if (!parsed.narrative || !Array.isArray(parsed.claims)) {
      return null;
    }
    
    // Ensure all evidenceKeys exist in metrics
    const validClaims: Claim[] = parsed.claims
      .filter((claim: any) => claim.text && Array.isArray(claim.evidenceKeys))
      .map((claim: any) => ({
        text: claim.text,
        evidenceKeys: claim.evidenceKeys.filter((key: string) => key in metrics),
      }))
      .filter((claim: Claim) => claim.evidenceKeys.length > 0);
    
    if (validClaims.length === 0) {
      return null;
    }
    
    return {
      text: parsed.narrative,
      claims: validClaims.slice(0, 5), // Limit to 5 claims
    };
  } catch (error) {
    console.error("Ollama error:", error);
    return null;
  }
}

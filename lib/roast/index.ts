import { Metrics, Narrative } from "@/types";
import { generateTemplateNarrative } from "./templates";
import { generateOllamaNarrative } from "./ollama";

export async function generateNarrative(
  metrics: Metrics,
  mode: "roast" | "praise",
  useLLM: boolean,
  repoName: string
): Promise<{ narrative: Narrative; usedLLM: boolean }> {
  if (useLLM) {
    const ollamaResult = await generateOllamaNarrative(metrics, mode, repoName);
    if (ollamaResult) {
      return { narrative: ollamaResult, usedLLM: true };
    }
  }
  
  // Fallback to templates
  const templateNarrative = generateTemplateNarrative(metrics, mode);
  return { narrative: templateNarrative, usedLLM: false };
}

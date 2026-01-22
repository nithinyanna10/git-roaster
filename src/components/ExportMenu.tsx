"use client";

import { useState } from "react";
import { Analysis } from "@/types/analysis";
import { Button } from "./Button";
import { showToast } from "./Toasts";

interface ExportMenuProps {
  analysis: Analysis;
  mode: string;
}

export function ExportMenu({ analysis, mode }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportJSON = () => {
    const data = {
      repo: analysis.repo,
      mode,
      timestamp: new Date().toISOString(),
      scores: analysis.scores,
      metrics: analysis.metrics,
      verdicts: analysis.verdicts,
      narrative: analysis.narrative.textWithCitations,
      claims: analysis.claims,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analysis.repo.fullName.replace("/", "-")}-${mode}.json`;
    a.click();
    showToast("JSON exported!");
  };

  const exportPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(
        `${analysis.repo.fullName} - ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
        20,
        20
      );
      
      // Narrative
      doc.setFontSize(12);
      const narrative = analysis.narrative.textWithCitations.replace(/\[\d+\]/g, "");
      const splitNarrative = doc.splitTextToSize(narrative, 170);
      let yPos = 40;
      for (const line of splitNarrative) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
      }
      
      // Scores
      yPos += 10;
      doc.setFontSize(14);
      doc.text("Scores:", 20, yPos);
      yPos += 10;
      doc.setFontSize(11);
      Object.entries(analysis.scores).forEach(([key, value]) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${key}: ${value}/100`, 20, yPos);
        yPos += 7;
      });
      
      // Save
      doc.save(`${analysis.repo.fullName.replace("/", "-")}-${mode}.pdf`);
      showToast("PDF exported!");
    } catch (err) {
      console.error("PDF export error:", err);
      showToast("PDF export failed");
    }
  };

  const copyMarkdown = () => {
    const markdown = `# ${analysis.repo.fullName} - ${mode.charAt(0).toUpperCase() + mode.slice(1)}

## Vibe Score: ${analysis.scores.vibeTotal}/100

${analysis.narrative.textWithCitations.replace(/\[\d+\]/g, "")}

## Scores
${Object.entries(analysis.scores)
  .map(([key, value]) => `- ${key}: ${value}/100`)
  .join("\n")}

## Verdicts
- Ops Health: ${analysis.verdicts.opsHealth}
- Momentum: ${analysis.verdicts.momentum}
- Risk Level: ${analysis.verdicts.riskLevel}
- Persona: ${analysis.verdicts.personaBadge}
`;
    navigator.clipboard.writeText(markdown);
    showToast("Markdown copied!");
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="secondary" size="sm">
        📤 Export
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={exportJSON} variant="secondary" size="sm">
        💾 JSON
      </Button>
      <Button onClick={exportPDF} variant="secondary" size="sm">
        📄 PDF
      </Button>
      <Button onClick={copyMarkdown} variant="secondary" size="sm">
        📝 Markdown
      </Button>
      <Button onClick={() => setIsOpen(false)} variant="secondary" size="sm">
        ✕
      </Button>
    </div>
  );
}

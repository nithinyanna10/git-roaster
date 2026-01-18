"use client";

interface ScoreBadgeProps {
  label: string;
  score: number;
  description?: string;
}

export function ScoreBadge({ label, score, description }: ScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (score >= 40) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all hover:scale-105 ${getColor(score)}`}
      title={description}
    >
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="mt-2 text-3xl font-bold">{score}</div>
      <div className="mt-1 h-2 w-full rounded-full bg-black/20">
        <div
          className="h-full rounded-full bg-current transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

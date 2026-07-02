import { getScoreColor, formatScore } from "@/lib/data";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = "md", label, showLabel = false }: ScoreBadgeProps) {
  const color = getScoreColor(score);
  const bg =
    score >= 9 ? "bg-green-400/10 border-green-400/40" :
    score >= 7.5 ? "bg-lime-400/10 border-lime-400/40" :
    score >= 6 ? "bg-yellow-400/10 border-yellow-400/40" :
    score >= 4 ? "bg-orange-400/10 border-orange-400/40" :
    "bg-red-400/10 border-red-400/40";

  const sizeClass =
    size === "sm" ? "w-10 h-10 text-sm" :
    size === "md" ? "w-14 h-14 text-lg" :
    size === "lg" ? "w-20 h-20 text-2xl" :
    "w-28 h-28 text-4xl";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${sizeClass} ${bg} border rounded-xl flex items-center justify-center font-black ${color}`}>
        {formatScore(score)}
      </div>
      {showLabel && label && (
        <span className="text-xs text-gray-500 text-center">{label}</span>
      )}
    </div>
  );
}

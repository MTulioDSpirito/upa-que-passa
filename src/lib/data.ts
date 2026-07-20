import { LISTINGS } from "@/mocks/listings";

export { LISTINGS };

export function getScoreColor(score: number): string {
  if (score >= 9) return "text-green-400";
  if (score >= 7.5) return "text-lime-400";
  if (score >= 6) return "text-yellow-400";
  if (score >= 4) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 9) return "bg-green-400";
  if (score >= 7.5) return "bg-lime-400";
  if (score >= 6) return "bg-yellow-400";
  if (score >= 4) return "bg-orange-400";
  return "bg-red-400";
}

export function formatScore(score: number): string {
  return score % 1 === 0 ? score.toString() : score.toFixed(1);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const cleanDateStr = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = cleanDateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

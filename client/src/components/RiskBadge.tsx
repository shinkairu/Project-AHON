import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: number; // 0-8
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  let colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
  let label = "Low Risk";

  if (level >= 8) {
    colorClass = "bg-red-100 text-red-800 border-red-200";
    label = "Severe Danger";
  } else if (level >= 6) {
    colorClass = "bg-orange-100 text-orange-800 border-orange-200";
    label = "High Risk";
  } else if (level >= 4) {
    colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    label = "Moderate Risk";
  } else if (level >= 1) {
    colorClass = "bg-blue-100 text-blue-800 border-blue-200";
    label = "Low Risk";
  } else {
    colorClass = "bg-slate-100 text-slate-800 border-slate-200";
    label = "Safe";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      colorClass,
      className
    )}>
      {label} (Lvl {level})
    </span>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: "increasing" | "decreasing" | "stable";
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, subtext, trend, icon, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold font-display">{value}</div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend === "increasing" ? "text-red-500" : 
              trend === "decreasing" ? "text-green-500" : "text-yellow-500"
            )}>
              {trend === "increasing" && <TrendingUp className="h-3 w-3 mr-1" />}
              {trend === "decreasing" && <TrendingDown className="h-3 w-3 mr-1" />}
              {trend === "stable" && <Minus className="h-3 w-3 mr-1" />}
              {trend.charAt(0).toUpperCase() + trend.slice(1)}
            </div>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

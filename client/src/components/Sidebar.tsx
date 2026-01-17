import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart3, Info, MapPin } from "lucide-react";

const CITIES = ["Quezon City", "Manila", "Marikina", "Pasig"];

export function Sidebar({ selectedCity, onCitySelect }: { selectedCity?: string, onCitySelect: (city: string) => void }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/about", label: "About Project", icon: Info },
  ];

  return (
    <aside className="w-64 bg-card border-r h-screen sticky top-0 flex flex-col shadow-xl shadow-black/5 z-20 hidden md:flex">
      <div className="p-6 border-b">
        <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          AHON
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">Flood Early Warning System</p>
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              location === item.href 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Focus Area</p>
          <div className="space-y-1">
            <button
              onClick={() => onCitySelect("")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                !selectedCity 
                  ? "bg-secondary font-semibold text-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <MapPin className="w-4 h-4 opacity-50" />
              Overview (Metro Manila)
            </button>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => onCitySelect(city)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left pl-9",
                  selectedCity === city
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t bg-secondary/30">
        <div className="bg-card rounded-lg p-3 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">System Operational</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Data updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </aside>
  );
}

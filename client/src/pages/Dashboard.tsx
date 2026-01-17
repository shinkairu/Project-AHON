import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MapComponent } from "@/components/MapComponent";
import { PredictionForm } from "@/components/PredictionForm";
import { StatsCard } from "@/components/StatsCard";
import { useFloodData, useCityStats } from "@/hooks/use-flood";
import { CloudRain, Droplets, AlertTriangle, Activity } from "lucide-react";

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  
  // Fetch live flood data
  const { data: floodData, isLoading: isFloodLoading } = useFloodData(selectedCity);
  
  // Fetch statistics
  const { data: statsData } = useCityStats();

  // Aggregate stats for current view
  const currentStat = selectedCity 
    ? statsData?.find(s => s.city === selectedCity)
    : {
        avgRainfall: statsData?.reduce((acc, curr) => acc + curr.avgRainfall, 0) || 0,
        avgFloodLevel: statsData?.reduce((acc, curr) => Math.max(acc, curr.avgFloodLevel), 0) || 0,
        riskTrend: "stable" as const
      };

  const avgRainfall = currentStat?.avgRainfall ? (currentStat.avgRainfall / (selectedCity ? 1 : 4)).toFixed(1) : "0.0";
  
  return (
    <div className="flex h-screen bg-background w-full">
      <Sidebar selectedCity={selectedCity} onCitySelect={setSelectedCity} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader selectedCity={selectedCity} onCitySelect={setSelectedCity} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                {selectedCity || "Metro Manila Overview"}
              </h1>
              <p className="text-muted-foreground">
                Real-time flood monitoring and early warning system
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold">Live Monitoring Active</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Avg. Rainfall"
              value={`${avgRainfall} mm`}
              subtext="Last 24 hours"
              icon={<CloudRain className="h-4 w-4" />}
            />
            <StatsCard
              title="Flood Risk Level"
              value={currentStat?.avgFloodLevel && currentStat.avgFloodLevel > 5 ? "HIGH" : "MODERATE"}
              trend={currentStat?.riskTrend}
              subtext="Based on current sensors"
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Sensors"
              value={isFloodLoading ? "..." : (floodData?.length || 0)}
              subtext="Reporting stations"
              icon={<Activity className="h-4 w-4" />}
            />
            <StatsCard
              title="Water Level"
              value="Normal"
              subtext="River banks stable"
              icon={<Droplets className="h-4 w-4" />}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[800px] lg:h-[600px]">
            {/* Map Section - Takes up 2/3 on large screens */}
            <div className="lg:col-span-2 h-[400px] lg:h-full flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Live Flood Map
                </h3>
                <div className="flex gap-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Low</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Mod</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>High</span>
                </div>
              </div>
              
              <div className="flex-1 rounded-2xl border bg-card shadow-sm p-1">
                 {!isFloodLoading && floodData ? (
                   <MapComponent data={floodData} selectedCity={selectedCity} />
                 ) : (
                   <div className="w-full h-full bg-secondary/50 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">
                     Loading Map Data...
                   </div>
                 )}
              </div>
            </div>

            {/* Prediction Form - Takes up 1/3 */}
            <div className="h-auto">
              <PredictionForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

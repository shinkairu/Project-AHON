import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { useCityStats } from "@/hooks/use-flood";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function Analytics() {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const { data: stats, isLoading } = useCityStats();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Transform data for charts
  const chartData = stats?.map(s => ({
    name: s.city,
    rainfall: s.avgRainfall,
    floodLevel: s.avgFloodLevel * 10, // Scale up for visibility
    riskScore: s.avgFloodLevel
  })) || [];

  return (
    <div className="flex h-screen bg-background w-full">
      <Sidebar selectedCity={selectedCity} onCitySelect={setSelectedCity} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader selectedCity={selectedCity} onCitySelect={setSelectedCity} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Historical Analytics</h1>
            <p className="text-muted-foreground">Comprehensive data analysis of flood trends across Metro Manila</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Rainfall vs Flood Levels</CardTitle>
                <CardDescription>Correlation between precipitation intensity and flood depth by city</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="rainfall" name="Rainfall (mm)" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="floodLevel" name="Flood Index" fill="hsl(0 84.2% 60.2%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>Projected risk levels based on antecedent rainfall</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="riskScore" name="Risk Score (0-8)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

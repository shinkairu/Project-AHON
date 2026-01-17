import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function About() {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  return (
    <div className="flex h-screen bg-background w-full">
      <Sidebar selectedCity={selectedCity} onCitySelect={setSelectedCity} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader selectedCity={selectedCity} onCitySelect={setSelectedCity} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">Project: AHON</h1>
            <p className="text-xl text-muted-foreground font-light">AI-Powered Flood Early Warning & Impact Prediction System</p>
          </div>

          <div className="grid gap-8">
            <Card className="border-l-4 border-l-primary shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To build resilient communities in Metro Manila by providing accurate, real-time flood predictions using advanced machine learning. 
                  Project AHON aims to reduce disaster impact through data-driven early warnings, focusing on Quezon City, Manila, Marikina, and Pasig.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Data Science
                </h3>
                <p className="text-sm text-muted-foreground">
                  Utilizing the Kaggle Metro Manila Flood Prediction Dataset (2016-2020), we analyze rainfall patterns, elevation, and historical flood events to train robust predictive models.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Technology Stack
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built with React, Leaflet for geospatial visualization, and a Random Forest ML backend. The system processes live rainfall inputs to generate instant risk assessments.
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold mb-4">SDG 11: Sustainable Cities and Communities</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Project AHON directly contributes to disaster resilience and public safety. By empowering local governments with predictive insights, we help minimize infrastructure damage and improve evacuation planning.
              </p>
              <div className="flex gap-4">
                 <div className="bg-white px-3 py-1 rounded border text-xs font-mono">Disaster Resilience</div>
                 <div className="bg-white px-3 py-1 rounded border text-xs font-mono">Public Safety</div>
                 <div className="bg-white px-3 py-1 rounded border text-xs font-mono">AI for Good</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get Flood Data
  app.get(api.flood.list.path, async (req, res) => {
    const city = req.query.city as string | undefined;
    const data = await storage.getFloodData(city);
    res.json(data);
  });

  // Get Stats
  app.get(api.flood.stats.path, async (req, res) => {
    const stats = await storage.getLatestCityStats();
    res.json(stats);
  });

  // Predict Endpoint
  app.post(api.flood.predict.path, async (req, res) => {
    try {
      const input = api.flood.predict.input.parse(req.body);
      
      // === SIMPLE PREDICTION LOGIC (Rule-Based as per Kaggle baseline ideas) ===
      // Factors: Rainfall (mm) + Elevation (implied by city logic or explicit)
      
      let riskLevel = 0;
      let predictedDepth = 0;
      let description = "Low Risk";
      let affectedInfra: string[] = [];
      let recommendation = "Monitor weather updates.";

      // Base risk on rainfall
      if (input.rainfall < 50) {
        riskLevel = 1;
        predictedDepth = 0.1;
        description = "Minimal Risk: Normal rainfall levels.";
      } else if (input.rainfall < 150) {
        riskLevel = 3;
        predictedDepth = 0.5;
        description = "Moderate Risk: Street flooding possible.";
        affectedInfra = ["Local Roads", "Low-lying residential areas"];
        recommendation = "Avoid low-lying areas. Prepare emergency kits.";
      } else if (input.rainfall < 300) {
        riskLevel = 6;
        predictedDepth = 1.5;
        description = "High Risk: Significant flooding expected.";
        affectedInfra = ["Main Highways", "Schools", "Ground floor residences", "Public Transport"];
        recommendation = "Evacuate if in flood-prone zones. Move to higher ground.";
      } else {
        riskLevel = 8;
        predictedDepth = 3.0;
        description = "Severe Risk: Catastrophic flooding likely.";
        affectedInfra = ["All major infrastructure", "Power Grid", "Hospitals in low areas"];
        recommendation = "IMMEDIATE EVACUATION REQUIRED. Seek designated evacuation centers.";
      }

      // City-specific modifiers (e.g., Marikina is more prone due to river)
      if (input.city === "Marikina" && input.rainfall > 100) {
        riskLevel = Math.min(8, riskLevel + 1);
        description += " (Higher risk due to Marikina River proximity)";
      }

      const response = {
        riskLevel,
        riskDescription: description,
        predictedFloodDepth: predictedDepth,
        affectedInfrastructure: affectedInfra,
        recommendation
      };

      res.json(response);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data function (internal use or call on startup)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getFloodData();
  if (existing.length > 0) return;

  console.log("Seeding database...");

  const cities = [
    { name: "Manila", lat: 14.5995, lng: 120.9842, elevation: 5 },
    { name: "Quezon City", lat: 14.6760, lng: 121.0437, elevation: 15 },
    { name: "Marikina", lat: 14.6507, lng: 121.0984, elevation: 8 }, // River valley
    { name: "Pasig", lat: 14.5763, lng: 121.0851, elevation: 10 }
  ];

  // Create varied data points around city centers
  for (const city of cities) {
    // 5 records per city
    for (let i = 0; i < 5; i++) {
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      const rainfall = Math.random() * 300; // 0 to 300mm
      
      // Calculate realistic flood height based on rainfall & elevation (simplified)
      let floodHeight = 0;
      if (rainfall > 200) floodHeight = Math.floor(Math.random() * 3) + 5; // 5-7
      else if (rainfall > 100) floodHeight = Math.floor(Math.random() * 3) + 2; // 2-4
      else floodHeight = Math.floor(Math.random() * 2); // 0-1

      await storage.createFloodRecord({
        city: city.name,
        latitude: city.lat + latOffset,
        longitude: city.lng + lngOffset,
        elevation: city.elevation,
        precipitation: parseFloat(rainfall.toFixed(1)),
        floodHeight: floodHeight,
        isPrediction: 0
      });
    }
  }
  console.log("Database seeded!");
}

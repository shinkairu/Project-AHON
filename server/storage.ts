import { db } from "./db";
import { floodData, type InsertFloodData, type FloodRecord } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getFloodData(city?: string): Promise<FloodRecord[]>;
  createFloodRecord(record: InsertFloodData): Promise<FloodRecord>;
  getLatestCityStats(): Promise<any[]>; // Custom return for stats
}

export class DatabaseStorage implements IStorage {
  async getFloodData(city?: string): Promise<FloodRecord[]> {
    if (city) {
      return await db.select().from(floodData).where(eq(floodData.city, city));
    }
    return await db.select().from(floodData);
  }

  async createFloodRecord(record: InsertFloodData): Promise<FloodRecord> {
    const [newRecord] = await db.insert(floodData).values(record).returning();
    return newRecord;
  }

  async getLatestCityStats(): Promise<any[]> {
    // In a real app, we'd use aggregation queries. For now, fetching all and computing in JS is fine for MVP scale.
    const allData = await db.select().from(floodData);
    
    const cities = ["Quezon City", "Manila", "Marikina", "Pasig"];
    const stats = cities.map(city => {
      const cityData = allData.filter(d => d.city === city);
      const avgFlood = cityData.length ? cityData.reduce((a, b) => a + b.floodHeight, 0) / cityData.length : 0;
      const avgRain = cityData.length ? cityData.reduce((a, b) => a + b.precipitation, 0) / cityData.length : 0;
      
      return {
        city,
        avgFloodLevel: parseFloat(avgFlood.toFixed(1)),
        avgRainfall: parseFloat(avgRain.toFixed(1)),
        riskTrend: avgFlood > 5 ? "increasing" : "stable", // Simple logic
        lastUpdated: new Date().toISOString()
      };
    });

    return stats;
  }
}

export const storage = new DatabaseStorage();

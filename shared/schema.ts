import { pgTable, text, serial, integer, real, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Historical and Live Flood Data
export const floodData = pgTable("flood_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(), // Quezon City, Manila, Marikina, Pasig
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  floodHeight: integer("flood_height").notNull(), // 0-8 scale
  elevation: real("elevation").notNull(), // meters
  precipitation: real("precipitation").notNull(), // mm
  recordedAt: timestamp("recorded_at").defaultNow(),
  isPrediction: integer("is_prediction").default(0), // 0 = actual, 1 = predicted
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type FloodRecord = typeof floodData.$inferSelect;
export const insertFloodDataSchema = createInsertSchema(floodData).omit({ id: true, recordedAt: true });
export type InsertFloodData = z.infer<typeof insertFloodDataSchema>;

// Prediction Request
export const predictionRequestSchema = z.object({
  city: z.enum(["Quezon City", "Manila", "Marikina", "Pasig"]),
  rainfall: z.number().min(0), // Current rainfall in mm
  elevation: z.number().optional(), // Optional, backend can infer avg elevation for city if missing
});
export type PredictionRequest = z.infer<typeof predictionRequestSchema>;

// Prediction Response
export interface PredictionResponse {
  riskLevel: number; // 0-8 (matching flood_height)
  riskDescription: string;
  predictedFloodDepth: number; // Estimated meters
  affectedInfrastructure: string[]; // List of potential affected areas
  recommendation: string;
}

// Stats Response
export interface CityStats {
  city: string;
  avgFloodLevel: number;
  avgRainfall: number;
  riskTrend: "increasing" | "decreasing" | "stable";
  lastUpdated: string;
}

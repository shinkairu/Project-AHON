import { z } from 'zod';
import { insertFloodDataSchema, floodData, predictionRequestSchema } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  flood: {
    list: {
      method: 'GET' as const,
      path: '/api/flood-data',
      input: z.object({
        city: z.string().optional(),
        isPrediction: z.coerce.number().optional(), // 0 or 1
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof floodData.$inferSelect>()),
      },
    },
    predict: {
      method: 'POST' as const,
      path: '/api/predict',
      input: predictionRequestSchema,
      responses: {
        200: z.object({
          riskLevel: z.number(),
          riskDescription: z.string(),
          predictedFloodDepth: z.number(),
          affectedInfrastructure: z.array(z.string()),
          recommendation: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.array(z.object({
          city: z.string(),
          avgFloodLevel: z.number(),
          avgRainfall: z.number(),
          riskTrend: z.enum(["increasing", "decreasing", "stable"]),
          lastUpdated: z.string(),
        })),
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type PredictionInput = z.infer<typeof api.flood.predict.input>;
export type PredictionResult = z.infer<typeof api.flood.predict.responses[200]>;
export type FloodDataListResponse = z.infer<typeof api.flood.list.responses[200]>;
export type StatsResponse = z.infer<typeof api.flood.stats.responses[200]>;

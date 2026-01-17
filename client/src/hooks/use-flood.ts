import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PredictionInput } from "@shared/routes";

// ============================================
// FLOOD DATA HOOKS
// ============================================

// GET /api/flood-data
export function useFloodData(city?: string, isPrediction?: number) {
  const queryKey = [api.flood.list.path, city, isPrediction].filter(Boolean);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query params
      const params: Record<string, string | number> = {};
      if (city) params.city = city;
      if (isPrediction !== undefined) params.isPrediction = isPrediction;

      // Construct URL with query string
      const url = new URL(api.flood.list.path, window.location.origin);
      Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch flood data");
      
      return api.flood.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/stats
export function useCityStats() {
  return useQuery({
    queryKey: [api.flood.stats.path],
    queryFn: async () => {
      const res = await fetch(api.flood.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch city stats");
      return api.flood.stats.responses[200].parse(await res.json());
    },
  });
}

// POST /api/predict
export function usePredictFlood() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PredictionInput) => {
      const validated = api.flood.predict.input.parse(data);
      const res = await fetch(api.flood.predict.path, {
        method: api.flood.predict.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.flood.predict.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Prediction failed");
      }
      
      return api.flood.predict.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Refresh flood data and stats to show the new prediction if saved
      queryClient.invalidateQueries({ queryKey: [api.flood.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.flood.stats.path] });
    },
  });
}

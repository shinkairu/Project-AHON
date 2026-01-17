import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { predictionRequestSchema, type PredictionRequest } from "@shared/schema";
import { usePredictFlood } from "@/hooks/use-flood";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, CheckCircle2, Waves } from "lucide-react";
import { useState } from "react";
import type { PredictionResult } from "@shared/routes";

export function PredictionForm() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const form = useForm<PredictionRequest>({
    resolver: zodResolver(predictionRequestSchema),
    defaultValues: {
      city: "Quezon City",
      rainfall: 0,
    },
  });

  const { mutate, isPending } = usePredictFlood();

  function onSubmit(data: PredictionRequest) {
    mutate(data, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Waves className="h-5 w-5" />
            <h3 className="font-semibold tracking-tight">AI Risk Calculator</h3>
          </div>
          <CardTitle className="text-xl">Flood Impact Prediction</CardTitle>
          <CardDescription>
            Enter current conditions to simulate flood risk using our Random Forest model.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Quezon City">Quezon City</SelectItem>
                        <SelectItem value="Manila">Manila</SelectItem>
                        <SelectItem value="Marikina">Marikina</SelectItem>
                        <SelectItem value="Pasig">Pasig</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rainfall"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rainfall Intensity (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="e.g. 15.5" 
                        className="h-11"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  "Calculate Risk"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className={`border-l-4 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 ${
          result.riskLevel >= 6 ? 'border-l-red-500 bg-red-50/50' : 
          result.riskLevel >= 4 ? 'border-l-orange-500 bg-orange-50/50' : 
          'border-l-green-500 bg-green-50/50'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {result.riskLevel >= 6 ? <AlertTriangle className="text-red-600" /> : <CheckCircle2 className="text-green-600" />}
                Prediction Result
              </CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                 result.riskLevel >= 6 ? 'bg-red-100 text-red-700' : 
                 result.riskLevel >= 4 ? 'bg-orange-100 text-orange-700' : 
                 'bg-green-100 text-green-700'
              }`}>
                Risk Level {result.riskLevel}
              </span>
            </div>
            <CardDescription className="text-base font-medium text-foreground/80">
              {result.riskDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-black/5">
                <span className="text-muted-foreground">Predicted Depth</span>
                <span className="font-mono font-bold">{result.predictedFloodDepth} meters</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Affected Infrastructure:</span>
                <div className="flex flex-wrap gap-2">
                  {result.affectedInfrastructure.map((infra, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-background/80 border rounded-md shadow-sm">
                      {infra}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-background/50 rounded-lg text-sm border">
                <span className="font-semibold text-primary block mb-1">Recommendation:</span>
                {result.recommendation}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

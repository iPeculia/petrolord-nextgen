import { z } from 'zod';

export const optimizationResultSchema = z.object({
  result_id: z.string().uuid().optional(),
  scenario_id: z.string().uuid().optional(),
  timestamp: z.string().optional(),
  system_efficiency_percent: z.number().optional(),
  total_production_bpd: z.number().optional(),
  bottleneck_pipelines: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional()
});

export const validateOptimizationResult = (data) => optimizationResultSchema.parse(data);
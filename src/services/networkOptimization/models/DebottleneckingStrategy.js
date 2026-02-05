import { z } from 'zod';

export const debottleneckingStrategySchema = z.object({
  strategy_id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  cost_estimate: z.number().optional()
});

export const validateDebottleneckingStrategy = (data) => debottleneckingStrategySchema.parse(data);
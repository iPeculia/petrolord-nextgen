import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const optimizationScenarioSchema = z.object({
  scenario_id: z.string().uuid().optional(),
  network_id: z.string().uuid().optional(),
  name: z.string().min(1),
  objective: z.enum(['Maximize Production', 'Minimize Cost', 'Target Rate']),
  constraints: z.record(z.any()).optional(),
  created_date: z.string().optional()
});

export const validateOptimizationScenario = (data) => optimizationScenarioSchema.parse(data);
import { z } from 'zod';

export const SimulationResultSchema = z.object({
  result_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  well_id: z.string().uuid(),
  simulation_date: z.string().datetime(),
  convergence_achieved: z.boolean().default(false),
  iterations: z.number().int().min(0).default(0),
  execution_time_seconds: z.number().min(0).optional(),
  error_message: z.string().optional(),
});

export const validateSimulationResult = (data) => SimulationResultSchema.parse(data);
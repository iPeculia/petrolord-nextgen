import { z } from 'zod';

export const MonteCarloSimulationSchema = z.object({
  simulation_id: z.string().uuid({ message: "Invalid simulation ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  number_of_iterations: z.number().int().min(100),
  random_seed: z.number().min(0),
  simulation_date: z.string().datetime(),
  status: z.enum(['Pending', 'Running', 'Complete', 'Failed']).default('Pending'),
  progress_percent: z.number().min(0).max(100),
  execution_time_seconds: z.number().min(0).optional()
});

export const validateMonteCarloSimulation = (data) => {
  try {
    MonteCarloSimulationSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
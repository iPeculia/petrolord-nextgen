import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const MonteCarloSimulationSchema = z.object({
  simulation_id: z.string().uuid(),
  project_id: z.string().uuid(),
  number_of_iterations: z.number().int().positive(),
  random_seed: z.number().optional(),
  simulation_date: z.string().datetime(),
  status: z.enum(['Pending', 'Running', 'Complete', 'Failed']).default('Pending'),
  progress_percent: z.number().min(0).max(100).default(0),
  execution_time_seconds: z.number().min(0).optional(),
  error_message: z.string().optional(),
});

export const createSimulation = (data) => {
  const defaults = {
    simulation_id: uuidv4(),
    simulation_date: new Date().toISOString(),
    status: 'Pending',
    progress_percent: 0
  };
  
  const simulation = { ...defaults, ...data };
  return MonteCarloSimulationSchema.parse(simulation);
};

export const validateSimulation = (data) => {
  try {
    MonteCarloSimulationSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
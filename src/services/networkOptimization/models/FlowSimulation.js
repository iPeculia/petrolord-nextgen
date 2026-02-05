import { z } from 'zod';

export const flowSimulationSchema = z.object({
  simulation_id: z.string().uuid().optional(),
  network_id: z.string().uuid(),
  status: z.enum(['Pending', 'Running', 'Completed', 'Failed']),
  results: z.any().optional()
});

export const validateFlowSimulation = (data) => flowSimulationSchema.parse(data);
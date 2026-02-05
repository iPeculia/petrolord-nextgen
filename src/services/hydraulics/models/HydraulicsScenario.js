import { z } from 'zod';

export const HydraulicsScenarioSchema = z.object({
  scenario_id: z.string().uuid(),
  well_id: z.string().uuid(),
  name: z.enum(['Base Case', 'Optimized', 'High Flow', 'Low Flow']),
  description: z.string().max(500).optional(),
  fluid_id: z.string().uuid(),
  pump_id: z.string().uuid(),
  choke_id: z.string().uuid(),
  flow_rate_gpm: z.number().positive(),
  pump_rpm: z.number().positive(),
  rate_of_penetration_ft_per_hr: z.number().min(0),
  surface_backpressure_psi: z.number().min(0),
  status: z.enum(['Pending', 'Running', 'Complete', 'Failed']).default('Pending'),
  created_date: z.string().datetime(),
});

export const validateHydraulicsScenario = (data) => HydraulicsScenarioSchema.parse(data);
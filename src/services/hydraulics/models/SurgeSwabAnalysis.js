import { z } from 'zod';

export const SurgeSwabAnalysisSchema = z.object({
  analysis_id: z.string().uuid(),
  well_id: z.string().uuid(),
  pipe_speed_ft_per_min: z.number().positive(),
  surge_pressure_psi: z.number().min(0),
  swab_pressure_psi: z.number(),
  equivalent_surge_density_ppg: z.number().positive(),
  equivalent_swab_density_ppg: z.number().positive(),
  fracture_margin_surge_ppg: z.number(),
  pore_margin_swab_ppg: z.number(),
  created_date: z.string().datetime(),
});

export const validateSurgeSwabAnalysis = (data) => SurgeSwabAnalysisSchema.parse(data);
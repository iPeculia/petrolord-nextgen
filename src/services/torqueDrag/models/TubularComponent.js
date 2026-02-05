import { z } from 'zod';

export const TubularComponentSchema = z.object({
  component_id: z.string().uuid(),
  type: z.enum(['DrillPipe', 'HeavyWeightDrillPipe', 'DrillCollar', 'Casing', 'Tubing']),
  outer_diameter_in: z.number().positive(),
  inner_diameter_in: z.number().positive(),
  weight_ppf: z.number().positive(),
  grade: z.string(),
  connection_type: z.string().optional(),
  length_ft: z.number().positive(),
  tensile_strength_lbs: z.number().positive().optional(),
  torsional_strength_ftlbs: z.number().positive().optional(),
  burst_pressure_psi: z.number().positive().optional(),
  collapse_pressure_psi: z.number().positive().optional(),
});

export const validateTubularComponent = (data) => {
  try {
    return { success: true, data: TubularComponentSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
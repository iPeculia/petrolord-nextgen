import { z } from 'zod';

export const BucklingAnalysisSchema = z.object({
  analysis_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  sinusoidal_buckling_load: z.number(),
  helical_buckling_load: z.number(),
  buckling_limit_factor: z.number(),
  is_buckling_predicted: z.boolean(),
});

export const validateBucklingAnalysis = (data) => {
  try {
    return { success: true, data: BucklingAnalysisSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
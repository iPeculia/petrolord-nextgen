import { z } from 'zod';

export const TDAnalysisResultSchema = z.object({
  result_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  timestamp: z.string().datetime(),
  summary: z.object({
    max_hook_load: z.number(),
    min_hook_load: z.number(),
    max_surface_torque: z.number(),
    min_surface_torque: z.number(),
  }),
  status: z.enum(['Success', 'Failed', 'Warning']),
});

export const validateTDAnalysisResult = (data) => {
  try {
    return { success: true, data: TDAnalysisResultSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
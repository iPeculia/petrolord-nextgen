import { z } from 'zod';

export const MonteCarloResultSchema = z.object({
  result_id: z.string().uuid({ message: "Invalid result ID" }),
  simulation_id: z.string().uuid({ message: "Invalid simulation ID" }),
  mean_npv_million: z.number(),
  std_dev_npv_million: z.number().min(0),
  p10_npv_million: z.number(),
  p50_npv_million: z.number(),
  p90_npv_million: z.number(),
  probability_positive_npv: z.number().min(0).max(1),
  mean_irr_percent: z.number(),
  std_dev_irr_percent: z.number().min(0),
  p10_irr_percent: z.number(),
  p50_irr_percent: z.number(),
  p90_irr_percent: z.number()
});

export const validateMonteCarloResult = (data) => {
  try {
    MonteCarloResultSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
import { z } from 'zod';

export const SensitivityAnalysisSchema = z.object({
  sensitivity_id: z.string().uuid({ message: "Invalid sensitivity ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  base_case_npv_million: z.number(),
  parameters: z.array(z.object({
    parameter_name: z.string(),
    low_case_npv_million: z.number(),
    high_case_npv_million: z.number(),
    sensitivity_index: z.number().min(0)
  })),
  tornado_chart_data: z.array(z.any()), // Can be more specific if chart structure is known
  created_date: z.string().datetime()
});

export const validateSensitivityAnalysis = (data) => {
  try {
    SensitivityAnalysisSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
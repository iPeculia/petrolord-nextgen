import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const SensitivityParameterSchema = z.object({
  parameter_name: z.string(),
  low_case_npv: z.number(),
  high_case_npv: z.number(),
  sensitivity_index: z.number().min(0).max(1),
});

export const SensitivityAnalysisSchema = z.object({
  sensitivity_id: z.string().uuid(),
  project_id: z.string().uuid(),
  base_case_npv: z.number(),
  parameters: z.array(SensitivityParameterSchema),
  tornado_chart_data: z.array(z.any()).optional(),
  analysis_date: z.string().datetime(),
});

export const createSensitivityAnalysis = (data) => {
  const defaults = {
    sensitivity_id: uuidv4(),
    analysis_date: new Date().toISOString(),
    tornado_chart_data: []
  };
  
  const analysis = { ...defaults, ...data };
  return SensitivityAnalysisSchema.parse(analysis);
};

export const validateSensitivityAnalysis = (data) => {
  try {
    SensitivityAnalysisSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
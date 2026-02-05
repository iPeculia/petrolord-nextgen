import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const RiskAnalysisResultSchema = z.object({
  result_id: z.string().uuid(),
  project_id: z.string().uuid(),
  simulation_id: z.string().uuid(),
  mean_npv: z.number(),
  std_dev_npv: z.number().min(0),
  p10_npv: z.number(),
  p50_npv: z.number(),
  p90_npv: z.number(),
  probability_positive_npv: z.number().min(0).max(1),
  value_at_risk_95: z.number().min(0),
  expected_shortfall: z.number().min(0),
  mean_irr: z.number(),
  std_dev_irr: z.number().min(0),
  p10_irr: z.number(),
  p50_irr: z.number(),
  p90_irr: z.number(),
  analysis_date: z.string().datetime(),
}).refine(data => data.p10_npv <= data.p50_npv && data.p50_npv <= data.p90_npv, {
  message: "NPV percentiles must follow P10 <= P50 <= P90",
  path: ["p50_npv"]
}).refine(data => data.p10_irr <= data.p50_irr && data.p50_irr <= data.p90_irr, {
  message: "IRR percentiles must follow P10 <= P50 <= P90",
  path: ["p50_irr"]
});

export const createRiskAnalysisResult = (data) => {
  const defaults = {
    result_id: uuidv4(),
    analysis_date: new Date().toISOString(),
  };
  
  const result = { ...defaults, ...data };
  return RiskAnalysisResultSchema.parse(result);
};

export const validateRiskAnalysisResult = (data) => {
  try {
    RiskAnalysisResultSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const RiskParameterSchema = z.object({
  parameter_id: z.string().uuid(),
  risk_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  distribution_type: z.enum(['Normal', 'Lognormal', 'Triangular', 'Uniform', 'Beta']),
  p10_value: z.number(),
  p50_value: z.number(),
  p90_value: z.number(),
  min_value: z.number(),
  max_value: z.number(),
  unit: z.string().min(1).max(50),
  correlation_with: z.array(z.string().uuid()).optional(),
  correlation_coefficient: z.number().min(-1).max(1).optional(),
  created_date: z.string().datetime(),
}).refine(data => data.max_value >= data.min_value, {
  message: "Max value must be greater than or equal to min value",
  path: ["max_value"]
}).refine(data => data.p10_value <= data.p50_value && data.p50_value <= data.p90_value, {
  message: "P10 must be <= P50 <= P90",
  path: ["p50_value"]
});

export const createRiskParameter = (data) => {
  const defaults = {
    parameter_id: uuidv4(),
    created_date: new Date().toISOString(),
    correlation_with: []
  };
  
  const parameter = { ...defaults, ...data };
  return RiskParameterSchema.parse(parameter);
};

export const validateRiskParameter = (data) => {
  try {
    RiskParameterSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const RiskRegisterSchema = z.object({
  risk_id: z.string().uuid(),
  project_id: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['Market', 'Technical', 'Operational', 'Regulatory', 'Environmental']),
  probability_percent: z.number().min(0).max(100),
  impact_value: z.number().min(0),
  impact_type: z.enum(['Financial', 'Schedule', 'Technical', 'Reputational']),
  risk_score: z.number(),
  status: z.enum(['Open', 'Mitigated', 'Closed']).default('Open'),
  owner: z.string().uuid(),
  mitigation_strategy: z.string().max(1000).optional(),
  residual_probability: z.number().min(0).max(100).optional(),
  residual_impact: z.number().min(0).optional(),
  residual_risk_score: z.number().optional(),
  created_date: z.string().datetime(),
});

export const createRisk = (data) => {
  const defaults = {
    risk_id: uuidv4(),
    created_date: new Date().toISOString(),
    status: 'Open',
    description: '',
    mitigation_strategy: ''
  };

  // Calculate scores
  const risk_score = (data.probability_percent * data.impact_value) / 100;
  
  let residual_risk_score = undefined;
  if (data.residual_probability !== undefined && data.residual_impact !== undefined) {
    residual_risk_score = (data.residual_probability * data.residual_impact) / 100;
  }

  const risk = { 
    ...defaults, 
    ...data, 
    risk_score,
    residual_risk_score 
  };
  
  return RiskRegisterSchema.parse(risk);
};

export const validateRisk = (data) => {
  try {
    RiskRegisterSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
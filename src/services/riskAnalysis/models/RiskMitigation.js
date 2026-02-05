import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const RiskMitigationSchema = z.object({
  mitigation_id: z.string().uuid(),
  risk_id: z.string().uuid(),
  action: z.string().min(3).max(500),
  owner: z.string().uuid(),
  target_date: z.string(), // ISO date string YYYY-MM-DD
  status: z.enum(['Planned', 'In Progress', 'Complete']).default('Planned'),
  effectiveness_percent: z.number().min(0).max(100).optional(),
  cost: z.number().min(0).optional(),
  created_date: z.string().datetime(),
});

export const createRiskMitigation = (data) => {
  const defaults = {
    mitigation_id: uuidv4(),
    created_date: new Date().toISOString(),
    status: 'Planned'
  };
  
  const mitigation = { ...defaults, ...data };
  return RiskMitigationSchema.parse(mitigation);
};

export const validateRiskMitigation = (data) => {
  try {
    RiskMitigationSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const ScenarioSchema = z.object({
  scenario_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.enum(['Base Case', 'Optimistic', 'Pessimistic', 'Custom']),
  description: z.string().max(1000).optional(),
  parameter_overrides: z.record(z.string(), z.number()).optional(),
  probability_weight: z.number().min(0).max(1),
  expected_npv: z.number().optional(),
  expected_irr: z.number().optional(),
  created_date: z.string().datetime(),
});

export const createScenario = (data) => {
  const defaults = {
    scenario_id: uuidv4(),
    created_date: new Date().toISOString(),
    description: '',
    parameter_overrides: {}
  };
  
  const scenario = { ...defaults, ...data };
  return ScenarioSchema.parse(scenario);
};

export const validateScenario = (data) => {
  try {
    ScenarioSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
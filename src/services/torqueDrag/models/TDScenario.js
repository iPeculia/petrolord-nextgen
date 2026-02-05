import { z } from 'zod';

export const TDScenarioSchema = z.object({
  scenario_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  operation_type: z.enum(['TrippingIn', 'TrippingOut', 'Drilling', 'RotatingOffBottom', 'SlideDrilling', 'BackReaming']),
  calculation_mode: z.enum(['SoftString', 'StiffString']),
  parameters: z.record(z.any()).optional(),
});

export const validateTDScenario = (data) => {
  try {
    return { success: true, data: TDScenarioSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const SimulationResultSchema = z.object({
  result_id: z.string().uuid(),
  simulation_id: z.string().uuid(),
  iteration: z.number().int().positive(),
  parameter_values: z.record(z.string(), z.number()),
  output_npv: z.number(),
  output_irr: z.number(),
  output_payback: z.number().min(0).optional(),
});

export const createSimulationResult = (data) => {
  const defaults = {
    result_id: uuidv4(),
  };
  
  const result = { ...defaults, ...data };
  return SimulationResultSchema.parse(result);
};

export const validateSimulationResult = (data) => {
  try {
    SimulationResultSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
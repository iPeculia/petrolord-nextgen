import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const nodeResultSchema = z.object({
  result_id: z.string().uuid(),
  simulation_id: z.string().uuid(),
  node_id: z.string().uuid(),
  pressure_psi: z.number().min(0),
  temperature_f: z.number().min(-459.67),
  flow_rate_bpd: z.number().min(0),
  velocity_ft_per_sec: z.number().min(0),
  pressure_drop_psi: z.number().min(0),
  constraint_violation: z.boolean().default(false)
});

export const validateNodeResult = (data) => nodeResultSchema.parse(data);

export const createNodeResult = (data) => {
  const defaults = {
    result_id: uuidv4(),
    constraint_violation: false
  };
  return validateNodeResult({ ...defaults, ...data });
};
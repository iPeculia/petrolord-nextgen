import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const pipelineResultSchema = z.object({
  result_id: z.string().uuid(),
  simulation_id: z.string().uuid(),
  pipeline_id: z.string().uuid(),
  flow_rate_bpd: z.number().min(0),
  pressure_drop_psi: z.number().min(0),
  velocity_ft_per_sec: z.number().min(0),
  friction_factor: z.number().gt(0),
  reynolds_number: z.number().min(0),
  utilization_percent: z.number().min(0).max(100),
  is_bottleneck: z.boolean().default(false)
});

export const validatePipelineResult = (data) => pipelineResultSchema.parse(data);

export const createPipelineResult = (data) => {
  const defaults = {
    result_id: uuidv4(),
    is_bottleneck: false
  };
  return validatePipelineResult({ ...defaults, ...data });
};
import { z } from 'zod';

export const BitNozzleSchema = z.object({
  nozzle_id: z.string().uuid(),
  component_id: z.string().uuid(),
  nozzle_count: z.number().int().min(1),
  nozzle_size_1_32_inch: z.number().positive(),
  total_flow_area_tfa_in2: z.number().positive(),
  bit_pressure_drop_psi: z.number().min(0),
  created_date: z.string().datetime(),
});

export const validateBitNozzle = (data) => BitNozzleSchema.parse(data);
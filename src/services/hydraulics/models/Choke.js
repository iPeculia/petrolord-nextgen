import { z } from 'zod';

export const ChokeSchema = z.object({
  choke_id: z.string().uuid(),
  well_id: z.string().uuid(),
  choke_type: z.enum(['Fixed', 'Adjustable', 'Automatic']),
  opening_percent: z.number().min(0).max(100),
  pressure_drop_psi: z.number().min(0),
  flow_capacity_gpm: z.number().positive(),
  created_date: z.string().datetime(),
});

export const validateChoke = (data) => ChokeSchema.parse(data);
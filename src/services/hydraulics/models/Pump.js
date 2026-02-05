import { z } from 'zod';

export const PumpSchema = z.object({
  pump_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  pump_type: z.enum(['Triplex', 'Duplex', 'Centrifugal']),
  liner_size_inches: z.number().positive(),
  stroke_length_inches: z.number().positive(),
  efficiency_percent: z.number().min(0).max(100),
  max_spm: z.number().positive(),
  displacement_bbl_per_stroke: z.number().positive(),
  max_pressure_psi: z.number().positive(),
  max_flow_gpm: z.number().positive(),
  created_date: z.string().datetime(),
});

export const validatePump = (data) => PumpSchema.parse(data);
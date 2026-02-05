import { z } from 'zod';

export const TubularComponentSchema = z.object({
  component_id: z.string().uuid(),
  well_id: z.string().uuid(),
  type: z.enum(['Drill Pipe', 'HWDP', 'Drill Collar', 'Motor', 'Bit']),
  od_inches: z.number().positive(),
  id_inches: z.number().positive(),
  weight_per_foot_lbm: z.number().positive(),
  length_ft: z.number().positive(),
  tool_joint_od_inches: z.number().positive(),
  roughness_microns: z.number().min(0),
  sequence: z.number().int().min(1),
  created_date: z.string().datetime(),
}).refine(data => data.id_inches < data.od_inches, {
  message: "ID must be less than OD",
  path: ["id_inches"]
});

export const validateTubularComponent = (data) => TubularComponentSchema.parse(data);
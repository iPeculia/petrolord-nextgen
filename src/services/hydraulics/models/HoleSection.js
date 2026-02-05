import { z } from 'zod';

export const HoleSectionSchema = z.object({
  section_id: z.string().uuid(),
  well_id: z.string().uuid(),
  section_name: z.string().min(3).max(100),
  type: z.enum(['Casing', 'Liner', 'Open Hole', 'Riser']),
  od_inches: z.number().positive(),
  id_inches: z.number().positive(),
  top_depth_ft: z.number().min(0),
  bottom_depth_ft: z.number().positive(),
  roughness_microns: z.number().min(0),
  sequence: z.number().int().min(1),
  created_date: z.string().datetime(),
}).refine(data => data.id_inches < data.od_inches, {
  message: "ID must be less than OD",
  path: ["id_inches"]
}).refine(data => data.bottom_depth_ft > data.top_depth_ft, {
  message: "Bottom depth must be greater than top depth",
  path: ["bottom_depth_ft"]
});

export const validateHoleSection = (data) => HoleSectionSchema.parse(data);
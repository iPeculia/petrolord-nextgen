import { z } from 'zod';

export const WellSchema = z.object({
  well_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  api_number: z.string().min(10).max(14),
  rig_name: z.string().min(3).max(100),
  water_depth_ft: z.number().min(0),
  rkb_elevation_ft: z.number().min(0),
  total_depth_ft: z.number().positive(),
  hole_size_inches: z.number().positive(),
  casing_program: z.string().min(3).max(200),
  status: z.enum(['Planned', 'Drilling', 'Completed']).default('Planned'),
  created_date: z.string().datetime(),
});

export const validateWell = (data) => {
  try {
    return { success: true, data: WellSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
import { z } from 'zod';

export const WellSchema = z.object({
  well_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  api_number: z.string().min(10).max(14),
  rig_name: z.string().min(3).max(100),
  water_depth_ft: z.number().min(0),
  rkb_elevation_ft: z.number().min(0),
  mud_line_elevation_ft: z.number(),
  total_depth_ft: z.number().positive(),
  status: z.enum(['Planned', 'Drilling', 'Completed']).default('Planned'),
  created_date: z.string().datetime(),
});

export const validateWell = (data) => WellSchema.parse(data);
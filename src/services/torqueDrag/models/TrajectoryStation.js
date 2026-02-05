import { z } from 'zod';

export const TrajectoryStationSchema = z.object({
  station_id: z.string().uuid(),
  well_id: z.string().uuid(),
  measured_depth_ft: z.number().min(0),
  inclination_degrees: z.number().min(0).max(90),
  azimuth_degrees: z.number().min(0).max(360),
  true_vertical_depth_ft: z.number().min(0),
  north_south_ft: z.number(),
  east_west_ft: z.number(),
  dogleg_severity_dls: z.number().min(0),
  section: z.enum(['Vertical', 'Build', 'Hold', 'Drop-off']),
  created_date: z.string().datetime(),
});

export const validateTrajectoryStation = (data) => {
  try {
    return { success: true, data: TrajectoryStationSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
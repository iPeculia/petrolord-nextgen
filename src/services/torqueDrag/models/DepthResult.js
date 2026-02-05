import { z } from 'zod';

export const DepthResultSchema = z.object({
  measured_depth: z.number(),
  tension: z.number(),
  torque: z.number(),
  side_force: z.number(),
  axial_force: z.number(),
  drag_force: z.number(),
});

export const validateDepthResult = (data) => {
  try {
    return { success: true, data: DepthResultSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
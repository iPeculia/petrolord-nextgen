import { z } from 'zod';

export const FrictionCoefficientSchema = z.object({
  friction_id: z.string().uuid(),
  well_id: z.string().uuid(),
  cased_hole_friction: z.number().min(0).max(1),
  open_hole_friction: z.number().min(0).max(1),
  tripping_in_factor: z.number().min(0).optional(),
  tripping_out_factor: z.number().min(0).optional(),
  rotating_on_bottom_factor: z.number().min(0).optional(),
  slide_drilling_factor: z.number().min(0).optional(),
});

export const validateFrictionCoefficient = (data) => {
  try {
    return { success: true, data: FrictionCoefficientSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
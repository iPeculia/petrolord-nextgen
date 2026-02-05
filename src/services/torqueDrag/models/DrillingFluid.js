import { z } from 'zod';

export const DrillingFluidSchema = z.object({
  fluid_id: z.string().uuid(),
  well_id: z.string().uuid(),
  type: z.enum(['WaterBased', 'OilBased', 'Synthetic', 'Air/Mist']),
  density_ppg: z.number().positive(),
  plastic_viscosity_cp: z.number().nonnegative(),
  yield_point_lb100ft2: z.number().nonnegative(),
  gel_strength_10s: z.number().nonnegative().optional(),
  gel_strength_10m: z.number().nonnegative().optional(),
});

export const validateDrillingFluid = (data) => {
  try {
    return { success: true, data: DrillingFluidSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
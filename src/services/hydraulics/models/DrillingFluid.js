import { z } from 'zod';

export const DrillingFluidSchema = z.object({
  fluid_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  fluid_type: z.enum(['Water-Based', 'Oil-Based', 'Synthetic']),
  base_fluid_density_ppg: z.number().positive(),
  rheology_model: z.enum(['Bingham', 'Power Law', 'Herschel-Bulkley']),
  plastic_viscosity_cp: z.number().min(0),
  yield_point_lbf_per_100ft2: z.number().min(0),
  gel_strength_10sec_lbf_per_100ft2: z.number().min(0),
  gel_strength_10min_lbf_per_100ft2: z.number().min(0),
  lsr_readings: z.object({
    rpm_600: z.number().min(0),
    rpm_300: z.number().min(0),
    rpm_200: z.number().min(0),
    rpm_100: z.number().min(0),
    rpm_6: z.number().min(0),
    rpm_3: z.number().min(0),
  }),
  temperature_f: z.number().min(-459.67),
  solids_content_percent: z.number().min(0).max(100),
  created_date: z.string().datetime(),
});

export const validateDrillingFluid = (data) => DrillingFluidSchema.parse(data);
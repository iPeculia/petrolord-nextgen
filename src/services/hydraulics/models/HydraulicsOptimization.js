import { z } from 'zod';

export const HydraulicsOptimizationSchema = z.object({
  optimization_id: z.string().uuid(),
  well_id: z.string().uuid(),
  optimization_type: z.enum(['Pump Optimization', 'Choke Optimization', 'Hole Cleaning']),
  current_flow_rate_gpm: z.number().positive(),
  optimized_flow_rate_gpm: z.number().positive(),
  current_ecd_ppg: z.number().positive(),
  optimized_ecd_ppg: z.number().positive(),
  current_hole_cleaning: z.number().min(0).max(1),
  optimized_hole_cleaning: z.number().min(0).max(1),
  pump_power_reduction_percent: z.number(),
  recommendations: z.string().max(500).optional(),
  created_date: z.string().datetime(),
});

export const validateHydraulicsOptimization = (data) => HydraulicsOptimizationSchema.parse(data);
import { z } from 'zod';

export const DepthResultSchema = z.object({
  depth_result_id: z.string().uuid(),
  simulation_result_id: z.string().uuid(),
  measured_depth_ft: z.number().min(0),
  hole_section_id: z.string().uuid(),
  flow_rate_gpm: z.number().min(0),
  velocity_ft_per_sec: z.number().min(0),
  pressure_drop_psi: z.number().min(0),
  standpipe_pressure_psi: z.number().min(0),
  annular_pressure_loss_psi: z.number().min(0),
  ecd_ppg: z.number().positive(),
  ecd_fracture_margin_ppg: z.number(),
  ecd_pore_margin_ppg: z.number(),
  cuttings_transport_ratio: z.number().min(0).max(1),
  hole_cleaning_status: z.enum(['Good', 'Fair', 'Poor']),
  reynolds_number: z.number().min(0),
  flow_regime: z.enum(['Laminar', 'Transitional', 'Turbulent']),
});

export const validateDepthResult = (data) => DepthResultSchema.parse(data);
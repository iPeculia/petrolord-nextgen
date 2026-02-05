import { z } from 'zod';

export const NPVResultSchema = z.object({
  result_id: z.string().uuid({ message: "Invalid result ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  project_id: z.string().uuid({ message: "Invalid project ID" }),
  discount_rate_percent: z.number().min(0).max(50),
  npv_million: z.number(),
  irr_percent: z.number(),
  payback_period_years: z.number().min(0),
  max_exposure_million: z.number().min(0),
  profitability_index: z.number().min(0),
  break_even_oil_price_per_bbl: z.number().positive(),
  break_even_gas_price_per_mmbtu: z.number().positive(),
  pi_ratio: z.number().min(0),
  calculation_date: z.string().datetime()
});

export const validateNPVResult = (data) => {
  try {
    NPVResultSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
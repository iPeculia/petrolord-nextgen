import { z } from 'zod';

export const BreakEvenAnalysisSchema = z.object({
  breakeven_id: z.string().uuid({ message: "Invalid breakeven ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  breakeven_oil_price_per_bbl: z.number().positive(),
  breakeven_gas_price_per_mmbtu: z.number().positive(),
  breakeven_production_bopd: z.number().positive(),
  breakeven_capex_million: z.number().min(0),
  breakeven_opex_per_bbl: z.number().min(0),
  npv_at_breakeven_million: z.number().refine((val) => Math.abs(val) < 0.1, { message: "NPV at breakeven must be approximately 0" }),
  created_date: z.string().datetime()
});

export const validateBreakEvenAnalysis = (data) => {
  try {
    BreakEvenAnalysisSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
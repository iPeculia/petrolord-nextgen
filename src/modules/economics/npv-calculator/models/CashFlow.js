import { z } from 'zod';

export const CashFlowSchema = z.object({
  cashflow_id: z.string().uuid({ message: "Invalid cashflow ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  year: z.number().int().min(2000),
  production_bopd: z.number().min(0),
  production_boe: z.number().min(0),
  oil_revenue_million: z.number().min(0),
  gas_revenue_million: z.number().min(0),
  gross_revenue_million: z.number().min(0),
  royalty_million: z.number().min(0),
  net_revenue_million: z.number().min(0),
  fixed_opex_million: z.number().min(0),
  variable_opex_million: z.number().min(0),
  total_opex_million: z.number().min(0),
  ebitda_million: z.number(),
  capex_million: z.number().min(0),
  depreciation_million: z.number().min(0),
  ebit_million: z.number(),
  income_tax_million: z.number().min(0),
  net_income_million: z.number(),
  operating_cash_flow_million: z.number(),
  free_cash_flow_million: z.number(),
  cumulative_cash_flow_million: z.number()
});

export const validateCashFlow = (data) => {
  try {
    CashFlowSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
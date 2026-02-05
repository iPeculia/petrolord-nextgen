import { z } from 'zod';

export const EconomicAssumptionsSchema = z.object({
  assumption_id: z.string().uuid({ message: "Invalid assumption ID" }),
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  start_year: z.number().int().min(2000, "Start year must be 2000 or later"),
  project_life_years: z.number().int().min(1).max(50, "Project life must be between 1 and 50 years"),
  initial_production_bopd: z.number().positive("Initial production must be greater than 0"),
  production_decline_rate_percent: z.number().min(0).max(20, "Decline rate must be between 0% and 20%"),
  oil_price_model: z.enum(['Flat', 'Escalating', 'Declining', 'Custom']),
  oil_price_base_per_bbl: z.number().positive("Base oil price must be positive"),
  oil_price_values: z.array(z.number().positive("Oil prices must be positive")),
  gas_price_model: z.enum(['Flat', 'Escalating', 'Declining', 'Custom']),
  gas_price_base_per_mmbtu: z.number().positive("Base gas price must be positive"),
  gas_price_values: z.array(z.number().positive("Gas prices must be positive")),
  total_capex_million: z.number().min(0, "Total CAPEX cannot be negative"),
  capex_schedule: z.array(z.number().min(0, "CAPEX values cannot be negative")),
  fixed_opex_per_year_million: z.number().min(0, "Fixed OPEX cannot be negative"),
  variable_opex_per_bbl: z.number().min(0, "Variable OPEX cannot be negative"),
  income_tax_rate_percent: z.number().min(0).max(50, "Tax rate must be between 0% and 50%"),
  royalty_rate_percent: z.number().min(0).max(50, "Royalty rate must be between 0% and 50%"),
  inflation_rate_percent: z.number().min(0).max(10, "Inflation rate must be between 0% and 10%"),
  abandonment_cost_million: z.number().min(0, "Abandonment cost cannot be negative"),
  created_date: z.string().datetime()
});

export const validateEconomicAssumptions = (data) => {
  try {
    EconomicAssumptionsSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
import { z } from 'zod';

export const ScenarioSchema = z.object({
  scenario_id: z.string().uuid({ message: "Invalid scenario ID" }),
  project_id: z.string().uuid({ message: "Invalid project ID" }),
  name: z.enum(['Base Case', 'Optimistic', 'Pessimistic', 'Custom'], { errorMap: () => ({ message: "Invalid scenario name" }) }),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal('')),
  scenario_type: z.enum(['Base', 'Low', 'High', 'Custom'], { errorMap: () => ({ message: "Invalid scenario type" }) }),
  probability_percent: z.number().min(0).max(100, "Probability must be between 0 and 100"),
  status: z.enum(['Draft', 'Complete']).default('Draft'),
  created_date: z.string().datetime()
});

export const validateScenario = (data) => {
  try {
    ScenarioSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
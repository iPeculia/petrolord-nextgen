import { z } from 'zod';

export const ProjectSchema = z.object({
  project_id: z.string().uuid({ message: "Invalid project ID" }),
  name: z.string().min(3, "Name must be at least 3 characters").max(200, "Name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional().or(z.literal('')),
  location: z.string().min(3, "Location must be at least 3 characters").max(200, "Location must be less than 200 characters"),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD'], { errorMap: () => ({ message: "Invalid currency" }) }),
  discount_rate_percent: z.number().min(0, "Discount rate cannot be negative").max(50, "Discount rate cannot exceed 50%"),
  project_life_years: z.number().int().min(1, "Project life must be at least 1 year").max(50, "Project life cannot exceed 50 years"),
  owner: z.string().uuid({ message: "Invalid owner ID" }),
  created_date: z.string().datetime(),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft')
});

export const validateProject = (data) => {
  try {
    ProjectSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
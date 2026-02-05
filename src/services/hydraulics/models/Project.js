import { z } from 'zod';

export const ProjectSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(3, "Name must be at least 3 characters").max(200, "Name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  location: z.string().min(3, "Location must be at least 3 characters").max(200, "Location must be less than 200 characters"),
  unit_system: z.enum(['API', 'Metric']),
  owner: z.string().uuid(),
  created_date: z.string().datetime(),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft'),
});

export const validateProject = (data) => ProjectSchema.parse(data);
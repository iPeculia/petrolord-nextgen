import { z } from 'zod';

export const ProjectSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  location: z.string().min(3).max(200),
  unit_system: z.enum(['Metric', 'Imperial']),
  owner: z.string().uuid(),
  created_date: z.string().datetime(),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft'),
});

export const validateProject = (data) => {
  try {
    return { success: true, data: ProjectSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
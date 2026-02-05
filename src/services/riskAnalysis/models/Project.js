import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const ProjectSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['Oil', 'Gas', 'Renewable', 'Infrastructure']),
  currency: z.string().min(3).max(3).default('USD'),
  owner: z.string().uuid(),
  created_date: z.string().datetime(),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft'),
});

export const createProject = (data) => {
  const defaults = {
    project_id: uuidv4(),
    created_date: new Date().toISOString(),
    status: 'Draft',
    currency: 'USD',
    description: ''
  };
  
  const project = { ...defaults, ...data };
  return ProjectSchema.parse(project);
};

export const validateProject = (data) => {
  try {
    ProjectSchema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
};
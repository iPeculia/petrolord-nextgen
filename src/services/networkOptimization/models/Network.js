import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const networkSchema = z.object({
  network_id: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  description: z.string().max(1000).optional(),
  location: z.string().min(3, "Location is required"),
  type: z.enum(['Oil', 'Gas', 'Hybrid']),
  fluid_model: z.enum(['Black Oil', 'Compositional', 'Dry Gas']),
  status: z.string().optional(),
  created_date: z.string().optional(),
  updated_date: z.string().optional()
});

export const validateNetwork = (data) => networkSchema.parse(data);

export const createNetwork = (data) => ({
  network_id: uuidv4(),
  status: 'Draft',
  created_date: new Date().toISOString(),
  updated_date: new Date().toISOString(),
  ...data
});
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const pipelineSchema = z.object({
  pipeline_id: z.string().uuid().optional(),
  network_id: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  from_node_id: z.string().uuid({ message: "Source node is required" }),
  to_node_id: z.string().uuid({ message: "Destination node is required" }),
  length_miles: z.number().positive("Length must be greater than 0"),
  diameter_inches: z.number().positive("Diameter must be greater than 0"),
  material: z.enum(['Carbon Steel', 'Stainless Steel', 'Composite']),
  roughness_microns: z.number().positive("Roughness must be positive"),
  pressure_rating_psi: z.number().positive("Pressure rating must be positive"),
  installation_cost: z.number().min(0),
  operating_cost_per_year: z.number().min(0),
  status: z.string().optional(),
  created_date: z.string().optional()
}).refine(data => data.from_node_id !== data.to_node_id, {
  message: "Source and destination nodes cannot be the same",
  path: ["to_node_id"]
});

export const validatePipeline = (data) => pipelineSchema.parse(data);

export const createPipeline = (data) => ({
  pipeline_id: uuidv4(),
  status: 'Active',
  created_date: new Date().toISOString(),
  ...data
});
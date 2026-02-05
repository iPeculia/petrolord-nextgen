import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const nodeSchema = z.object({
  node_id: z.string().uuid().optional(),
  network_id: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  type: z.enum(['Well', 'Junction', 'Separator', 'Compressor', 'Sink']),
  location: z.object({
    x: z.number({ required_error: "X coordinate is required" }),
    y: z.number({ required_error: "Y coordinate is required" }),
    elevation: z.number({ required_error: "Elevation is required" })
  }),
  well_data: z.object({
    production_rate_bpd: z.number().min(0).optional(),
    static_pressure_psi: z.number().min(0).optional(),
    temperature_f: z.number().min(-459.67).optional(),
    gor: z.number().min(0).optional(),
    water_cut: z.number().min(0).max(1).optional(),
    api_gravity: z.number().min(0).optional()
  }).optional(),
  constraints: z.object({
    min_pressure_psi: z.number().min(0).optional(),
    max_pressure_psi: z.number().min(0).optional(),
    max_flow_bpd: z.number().min(0).optional()
  }).optional(),
  status: z.string().optional(),
  created_date: z.string().optional()
});

export const validateNode = (data) => nodeSchema.parse(data);

export const createNode = (data) => ({
  node_id: uuidv4(),
  status: 'Active',
  created_date: new Date().toISOString(),
  ...data
});
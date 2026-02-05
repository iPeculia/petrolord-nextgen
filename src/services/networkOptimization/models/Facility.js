import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const facilitySchema = z.object({
  facility_id: z.string().uuid().optional(),
  network_id: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  type: z.enum(['Separator', 'Compressor', 'Pump', 'Heater', 'Cooler']),
  node_id: z.string().uuid({ message: "Location node is required" }),
  capacity: z.number().positive("Capacity must be positive"),
  capacity_unit: z.enum(['bpd', 'MMscfd', 'hp']),
  efficiency_percent: z.number().min(0).max(100),
  inlet_pressure_psi: z.number().min(0),
  outlet_pressure_psi: z.number().min(0),
  installation_cost: z.number().min(0),
  operating_cost_per_year: z.number().min(0),
  specifications: z.object({
    vessel_diameter_inches: z.number().optional(),
    vessel_length_inches: z.number().optional(),
    design_pressure_psi: z.number().optional()
  }).optional(),
  status: z.string().optional(),
  created_date: z.string().optional()
});

export const validateFacility = (data) => facilitySchema.parse(data);

export const createFacility = (data) => ({
  facility_id: uuidv4(),
  status: 'Active',
  created_date: new Date().toISOString(),
  ...data
});
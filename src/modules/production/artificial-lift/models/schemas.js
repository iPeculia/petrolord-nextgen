import { z } from 'zod';

// Part 1: Well Model
// We separate the base object schema from the refined schema to allow .omit() usage for forms
export const wellBaseSchema = z.object({
  well_id: z.string().uuid(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must not exceed 100 characters"),
  location: z.string().min(3, "Location must be at least 3 characters").max(200, "Location must not exceed 200 characters"),
  type: z.enum(["Vertical", "Deviated", "Horizontal"]),
  depth_md: z.number().gt(0, "Measured Depth must be greater than 0"),
  depth_tvd: z.number().gt(0, "True Vertical Depth must be greater than 0"),
  casing_id: z.number().gt(0, "Casing ID must be greater than 0"),
  tubing_id: z.number().gt(0, "Tubing ID must be greater than 0"),
  tubing_od: z.number().gt(0, "Tubing OD must be greater than 0"),
  perforation_depth: z.number().gt(0, "Perforation Depth must be greater than 0"),
  wellhead_pressure: z.number().min(0, "Wellhead Pressure must be non-negative"),
  status: z.enum(["Active", "Inactive", "Planned"]),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Full schema with cross-field validation
export const wellSchema = wellBaseSchema.refine(data => data.depth_tvd <= data.depth_md, {
  message: "True Vertical Depth cannot exceed Measured Depth",
  path: ["depth_tvd"]
}).refine(data => data.tubing_id < data.casing_id, {
  message: "Tubing ID must be less than Casing ID",
  path: ["tubing_id"]
}).refine(data => data.tubing_od > data.tubing_id, {
  message: "Tubing OD must be greater than Tubing ID",
  path: ["tubing_od"]
}).refine(data => data.perforation_depth <= data.depth_tvd, { 
  message: "Perforation Depth cannot be deeper than Total TVD",
  path: ["perforation_depth"]
});

// Part 2: Reservoir Properties Model
export const reservoirPropertiesSchema = z.object({
  property_id: z.string().uuid(),
  well_id: z.string().uuid(),
  static_pressure: z.number().gt(0, "Static Pressure must be greater than 0"),
  temperature: z.number().gt(0, "Temperature must be greater than 0"),
  productivity_index: z.number().gt(0, "Productivity Index must be greater than 0"),
  fluid_type: z.enum(["Oil", "Gas", "Water"]),
  oil_gravity_api: z.number().min(0).max(60).optional(),
  gas_gravity: z.number().min(0).max(2).optional(),
  water_cut: z.number().min(0).max(1).optional(),
  viscosity: z.number().gt(0).optional(),
  density: z.number().gt(0).optional(),
  bubble_point: z.number().gt(0).optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 3: Production Data Model
export const productionDataSchema = z.object({
  production_id: z.string().uuid(),
  well_id: z.string().uuid(),
  current_production_bpd: z.number().min(0, "Current production must be non-negative"),
  target_production_bpd: z.number().min(0, "Target production must be non-negative"),
  current_lift_method: z.enum(["None", "ESP", "Gas Lift", "Rod Pump"]),
  current_drawdown: z.number().min(0, "Drawdown must be non-negative"),
  gor: z.number().min(0, "GOR must be non-negative"),
  water_production_bpd: z.number().min(0, "Water production must be non-negative"),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 4: ESP Design Model
export const espDesignSchema = z.object({
  design_id: z.string().uuid(),
  well_id: z.string().uuid(),
  design_type: z.enum(["Single Stage", "Multi Stage"]),
  pump_model: z.string().min(3).max(50),
  pump_stages: z.number().int().gt(0),
  pump_rated_flow: z.number().gt(0),
  pump_rated_head: z.number().gt(0),
  motor_hp: z.number().gt(0),
  motor_voltage: z.number().gt(0),
  cable_size: z.string().min(3).max(20),
  cable_length: z.number().gt(0),
  intake_type: z.enum(["Standard", "Shrouded", "Protector"]),
  seal_section: z.enum(["Standard", "Tandem", "Dual"]),
  gas_separator: z.boolean(),
  expected_flow: z.number().gt(0),
  expected_head: z.number().gt(0),
  expected_power: z.number().gt(0),
  efficiency: z.number().min(0).max(1),
  design_status: z.enum(["Preliminary", "Optimized", "Final"]),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 5: Gas Lift Design Model
export const gasLiftDesignSchema = z.object({
  design_id: z.string().uuid(),
  well_id: z.string().uuid(),
  lift_gas_source: z.enum(["Compressor", "Separator Gas", "External"]),
  gas_injection_rate_mmscfd: z.number().gt(0),
  injection_depth: z.number().gt(0),
  valve_type: z.enum(["Casing Valve", "Tubing Valve"]),
  valve_size: z.number().gt(0),
  number_of_valves: z.number().int().gt(0),
  valve_spacing: z.number().gt(0),
  operating_pressure: z.number().gt(0),
  expected_flow: z.number().gt(0),
  expected_lift: z.number().gt(0),
  gas_cost_per_mmscf: z.number().min(0),
  design_status: z.enum(["Preliminary", "Optimized", "Final"]),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 6: Rod Pump Design Model
const rodStringItemSchema = z.object({
  rod_type: z.string().min(3).max(50),
  grade: z.enum(["C", "D", "K"]),
  length: z.number().gt(0),
  quantity: z.number().int().gt(0)
});

export const rodPumpDesignSchema = z.object({
  design_id: z.string().uuid(),
  well_id: z.string().uuid(),
  pump_type: z.enum(["Tubing", "Casing"]),
  pump_size: z.number().gt(0),
  pump_displacement: z.number().gt(0),
  pump_rated_speed: z.number().gt(0),
  rod_string: z.array(rodStringItemSchema).min(1, "At least one rod string item is required"),
  polished_rod_diameter: z.number().gt(0),
  stroke_length: z.number().gt(0),
  strokes_per_minute: z.number().gt(0),
  expected_flow: z.number().gt(0),
  expected_power: z.number().gt(0),
  rod_stress: z.number().gt(0),
  design_status: z.enum(["Preliminary", "Optimized", "Final"]),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 7: Equipment Catalog Model
export const equipmentCatalogSchema = z.object({
  equipment_id: z.string().uuid(),
  category: z.enum(["ESP Pump", "Motor", "Cable", "Gas Lift Valve", "Rod Pump", "Sucker Rod"]),
  manufacturer: z.string().min(3).max(50),
  model: z.string().min(3).max(50),
  specifications: z.object({
    rated_flow: z.number().optional(),
    rated_head: z.number().optional(),
    rated_power: z.number().optional(),
    efficiency: z.number().min(0).max(1).optional(),
    weight: z.number().optional(),
    length: z.number().optional()
  }),
  cost: z.number().min(0),
  availability: z.enum(["In Stock", "2-4 weeks", "4-8 weeks"]),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 8: Design Result Model
export const designResultSchema = z.object({
  result_id: z.string().uuid(),
  well_id: z.string().uuid(),
  design_id: z.string().uuid(),
  lift_method: z.enum(["ESP", "Gas Lift", "Rod Pump"]),
  expected_production: z.number().gt(0),
  expected_efficiency: z.number().min(0).max(1),
  expected_power: z.number().gt(0),
  expected_cost: z.number().min(0),
  annual_operating_cost: z.number().min(0),
  payback_period_months: z.number().min(0),
  design_quality_score: z.number().min(0).max(1),
  recommendations: z.string().max(1000).optional(),
  design_date: z.string().or(z.date()),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});

// Part 9: Design Comparison Model
export const designComparisonSchema = z.object({
  comparison_id: z.string().uuid(),
  well_id: z.string().uuid(),
  esp_design: z.string().uuid().optional(),
  gas_lift_design: z.string().uuid().optional(),
  rod_pump_design: z.string().uuid().optional(),
  recommended_method: z.enum(["ESP", "Gas Lift", "Rod Pump"]),
  comparison_criteria: z.object({
    production_capacity: z.string(),
    efficiency: z.string(),
    capital_cost: z.string(),
    annual_opex: z.string()
  }),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional()
});
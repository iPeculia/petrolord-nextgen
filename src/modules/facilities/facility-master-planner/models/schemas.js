import { z } from 'zod';

// --- Enums ---
export const FacilityTypeEnum = z.enum(['CPF', 'FPSO', 'Refinery', 'Processing Plant']);
export const CurrencyEnum = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);
export const ProjectStatusEnum = z.enum(['Draft', 'Active', 'Completed', 'Archived']);
export const FacilityStatusEnum = z.enum(['Operational', 'Planned', 'Decommissioned']);
export const UnitTypeEnum = z.enum(['Separation', 'Compression', 'Dehydration', 'Power Generation', 'Pumping', 'Heating', 'Cooling']);
export const UnitStatusEnum = z.enum(['Operational', 'Planned', 'Decommissioned']);
export const EquipmentTypeEnum = z.enum(['Vessel', 'Pump', 'Compressor', 'Heater', 'Cooler', 'Motor', 'Turbine']);
export const EquipmentCapacityUnitEnum = z.enum(['bpd', 'mmscfd', 'hp', 'mw']);
export const EquipmentStatusEnum = z.enum(['Operational', 'Planned', 'Decommissioned', 'Retired']);
export const EquipmentConditionEnum = z.enum(['Excellent', 'Good', 'Fair', 'Poor']);
export const FluidTypeEnum = z.enum(['Oil', 'Gas', 'Water', 'Condensate', 'Multiphase']);
export const FlowUnitEnum = z.enum(['bpd', 'mmscfd']);
export const ScenarioNameEnum = z.enum(['Base Case', 'Optimistic', 'Pessimistic', 'Custom']);
export const ScenarioTypeEnum = z.enum(['Base', 'Low', 'High', 'Custom']);
export const ScenarioStatusEnum = z.enum(['Draft', 'Complete']);
export const UpgradeTypeEnum = z.enum(['Debottleneck', 'Replacement', 'Addition', 'Retrofit']);
export const ExpansionStatusEnum = z.enum(['Proposed', 'Approved', 'Implemented', 'Cancelled']);
export const BottleneckSeverityEnum = z.enum(['Critical', 'High', 'Medium', 'Low']);
export const MasterPlanStatusEnum = z.enum(['Draft', 'Approved', 'Implemented']);
export const RiskCategoryEnum = z.enum(['Technical', 'Commercial', 'Regulatory', 'Environmental']);
export const RiskSeverityEnum = z.enum(['Critical', 'High', 'Medium', 'Low']);

// --- 1. Project Schema ---
export const ProjectSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  location: z.string().min(3).max(200),
  facility_type: FacilityTypeEnum,
  currency: CurrencyEnum,
  discount_rate_percent: z.number().min(0).max(50),
  owner: z.string().uuid(),
  created_date: z.string().datetime(),
  status: ProjectStatusEnum.default('Draft'),
});

// --- 2. Facility Schema ---
export const FacilitySchema = z.object({
  facility_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(3).max(200),
  facility_type: FacilityTypeEnum,
  location: z.string().min(3).max(200),
  design_capacity_oil_bpd: z.number().gt(0),
  design_capacity_gas_mmscfd: z.number().min(0),
  design_capacity_water_bpd: z.number().min(0),
  current_capacity_oil_bpd: z.number().gt(0),
  current_capacity_gas_mmscfd: z.number().min(0),
  current_capacity_water_bpd: z.number().min(0),
  installation_date: z.string().datetime().or(z.string()), // Accept ISO string
  decommissioning_date: z.string().datetime().or(z.string()).optional(),
  status: FacilityStatusEnum.default('Operational'),
  created_date: z.string().datetime(),
}).refine(data => data.current_capacity_oil_bpd <= data.design_capacity_oil_bpd, {
    message: "Current oil capacity cannot exceed design capacity",
    path: ["current_capacity_oil_bpd"]
}).refine(data => data.current_capacity_gas_mmscfd <= data.design_capacity_gas_mmscfd, {
    message: "Current gas capacity cannot exceed design capacity",
    path: ["current_capacity_gas_mmscfd"]
}).refine(data => data.current_capacity_water_bpd <= data.design_capacity_water_bpd, {
    message: "Current water capacity cannot exceed design capacity",
    path: ["current_capacity_water_bpd"]
});

// --- 3. Process Unit Schema ---
export const ProcessUnitSchema = z.object({
  unit_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  name: z.string().min(3).max(200),
  unit_type: UnitTypeEnum,
  function: z.string().min(10).max(500),
  design_capacity_bpd: z.number().gt(0),
  current_capacity_bpd: z.number().gt(0),
  bottleneck_capacity_bpd: z.number().gt(0),
  status: UnitStatusEnum.default('Operational'),
  equipment_list: z.array(z.string().uuid()).min(1),
  created_date: z.string().datetime(),
}).refine(data => data.current_capacity_bpd <= data.design_capacity_bpd, {
    message: "Current capacity cannot exceed design capacity",
    path: ["current_capacity_bpd"]
}).refine(data => data.bottleneck_capacity_bpd <= data.design_capacity_bpd, {
    message: "Bottleneck capacity cannot exceed design capacity",
    path: ["bottleneck_capacity_bpd"]
});

// --- 4. Equipment Schema ---
export const EquipmentSchema = z.object({
  equipment_id: z.string().uuid(),
  unit_id: z.string().uuid(),
  tag_number: z.string().min(3).max(50),
  equipment_type: EquipmentTypeEnum,
  manufacturer: z.string().min(3).max(100),
  model: z.string().min(3).max(100),
  design_capacity: z.number().gt(0),
  design_capacity_unit: EquipmentCapacityUnitEnum,
  current_capacity: z.number().gt(0),
  bottleneck_capacity: z.number().gt(0),
  installation_date: z.string().datetime().or(z.string()),
  decommissioning_date: z.string().datetime().or(z.string()).optional(),
  status: EquipmentStatusEnum.default('Operational'),
  condition: EquipmentConditionEnum.default('Good'),
  maintenance_interval_months: z.number().gt(0),
  last_maintenance_date: z.string().datetime().or(z.string()).optional(),
  created_date: z.string().datetime(),
}).refine(data => data.current_capacity <= data.design_capacity, {
    message: "Current capacity cannot exceed design capacity",
    path: ["current_capacity"]
}).refine(data => data.bottleneck_capacity <= data.design_capacity, {
    message: "Bottleneck capacity cannot exceed design capacity",
    path: ["bottleneck_capacity"]
});

// --- 5. Stream Schema ---
export const StreamSchema = z.object({
  stream_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  source_unit_id: z.string().uuid(),
  target_unit_id: z.string().uuid(),
  stream_name: z.string().min(3).max(200),
  fluid_type: FluidTypeEnum,
  design_flow_rate: z.number().gt(0),
  design_flow_unit: FlowUnitEnum,
  design_pressure_psi: z.number().gt(0),
  design_temperature_f: z.number().min(-459.67),
  gor: z.number().min(0).optional(),
  water_cut_percent: z.number().min(0).max(100).optional(),
  created_date: z.string().datetime(),
});

// --- 6. Production Profile Schema ---
export const ProductionProfileSchema = z.object({
  profile_id: z.string().uuid(),
  project_id: z.string().uuid(),
  year: z.number().min(2000),
  month: z.number().min(1).max(12),
  oil_rate_bpd: z.number().min(0),
  gas_rate_mmscfd: z.number().min(0),
  water_rate_bpd: z.number().min(0),
  fluid_gor: z.number().min(0).optional(),
  fluid_water_cut_percent: z.number().min(0).max(100).optional(),
  facility_utilization_percent: z.number().min(0).max(100),
  created_date: z.string().datetime(),
});

// --- 7. Scenario Schema ---
export const ScenarioSchema = z.object({
  scenario_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: ScenarioNameEnum,
  description: z.string().max(500).optional(),
  scenario_type: ScenarioTypeEnum,
  is_baseline: z.boolean().default(false),
  status: ScenarioStatusEnum.default('Draft'),
  created_date: z.string().datetime(),
});

// --- 8. Expansion Plan Schema ---
export const ExpansionPlanSchema = z.object({
  expansion_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  expansion_name: z.string().min(3).max(200),
  description: z.string().max(500).optional(),
  equipment_id: z.string().uuid(),
  upgrade_type: UpgradeTypeEnum,
  target_capacity: z.number().gt(0),
  target_capacity_unit: EquipmentCapacityUnitEnum,
  implementation_year: z.number().min(2000),
  implementation_duration_months: z.number().gt(0),
  capex_million: z.number().min(0),
  opex_impact_annual_million: z.number(),
  production_increase_bpd: z.number().min(0),
  roi_percent: z.number(),
  payback_period_years: z.number().min(0),
  status: ExpansionStatusEnum.default('Proposed'),
  created_date: z.string().datetime(),
});

// --- 9. Capacity Analysis Schema ---
export const CapacityAnalysisSchema = z.object({
  analysis_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  analysis_year: z.number().min(2000),
  oil_demand_bpd: z.number().min(0),
  oil_available_capacity_bpd: z.number().min(0),
  oil_utilization_percent: z.number().min(0).max(100),
  gas_demand_mmscfd: z.number().min(0),
  gas_available_capacity_mmscfd: z.number().min(0),
  gas_utilization_percent: z.number().min(0).max(100),
  water_demand_bpd: z.number().min(0),
  water_available_capacity_bpd: z.number().min(0),
  water_utilization_percent: z.number().min(0).max(100),
  bottleneck_unit_id: z.string().uuid(),
  bottleneck_unit_name: z.string().min(3).max(200),
  bottleneck_severity: BottleneckSeverityEnum,
  created_date: z.string().datetime(),
});

// --- 10. Master Plan Schema ---
export const MasterPlanSchema = z.object({
  plan_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  plan_name: z.string().min(3).max(200),
  plan_horizon_years: z.number().min(1).max(50),
  total_capex_million: z.number().min(0),
  total_opex_impact_annual_million: z.number(),
  total_production_increase_bpd: z.number().min(0),
  expansion_phases: z.array(z.object({
    phase: z.number().min(1),
    year: z.number().min(2000),
    expansions: z.array(z.string().uuid()).min(1),
    capex_million: z.number().min(0),
    production_increase_bpd: z.number().min(0)
  })).min(1),
  npv_million: z.number(),
  irr_percent: z.number(),
  payback_period_years: z.number().min(0),
  status: MasterPlanStatusEnum.default('Draft'),
  created_date: z.string().datetime(),
});

// --- 11. Risk Analysis Schema ---
export const RiskAnalysisSchema = z.object({
  risk_id: z.string().uuid(),
  facility_id: z.string().uuid(),
  scenario_id: z.string().uuid(),
  risk_name: z.string().min(3).max(200),
  risk_category: RiskCategoryEnum,
  risk_severity: RiskSeverityEnum,
  probability_percent: z.number().min(0).max(100),
  impact_description: z.string().min(10).max(500),
  mitigation_strategy: z.string().min(10).max(500),
  mitigation_cost_million: z.number().min(0),
  mitigation_timeline_months: z.number().gt(0),
  created_date: z.string().datetime(),
});

// --- Validation Functions ---
export const validateProject = (data) => ProjectSchema.safeParse(data);
export const validateFacility = (data) => FacilitySchema.safeParse(data);
export const validateProcessUnit = (data) => ProcessUnitSchema.safeParse(data);
export const validateEquipment = (data) => EquipmentSchema.safeParse(data);
export const validateStream = (data) => StreamSchema.safeParse(data);
export const validateProductionProfile = (data) => ProductionProfileSchema.safeParse(data);
export const validateScenario = (data) => ScenarioSchema.safeParse(data);
export const validateExpansionPlan = (data) => ExpansionPlanSchema.safeParse(data);
export const validateCapacityAnalysis = (data) => CapacityAnalysisSchema.safeParse(data);
export const validateMasterPlan = (data) => MasterPlanSchema.safeParse(data);
export const validateRiskAnalysis = (data) => RiskAnalysisSchema.safeParse(data);
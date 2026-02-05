import { v4 as uuidv4 } from 'uuid';

const PROJECT_ID = uuidv4();
const FACILITY_ID = uuidv4();
const OWNER_ID = uuidv4(); // Simulated User ID

const UNIT_SEP_ID = uuidv4();
const UNIT_COMP_ID = uuidv4();
const UNIT_DEHY_ID = uuidv4();

const EQ_SEP_1 = uuidv4();
const EQ_COMP_1 = uuidv4();
const EQ_HEAT_1 = uuidv4();

const SCENARIO_BASE_ID = uuidv4();
const SCENARIO_OPT_ID = uuidv4();

const now = new Date().toISOString();

export const demoProject = {
  project_id: PROJECT_ID,
  name: "Deepwater Facility Master Plan",
  description: "Optimization and expansion planning for the offshore deepwater asset.",
  location: "Gulf of Mexico Block 42",
  facility_type: "FPSO",
  currency: "USD",
  discount_rate_percent: 10,
  owner: OWNER_ID,
  created_date: now,
  status: "Active"
};

export const demoFacility = {
  facility_id: FACILITY_ID,
  project_id: PROJECT_ID,
  name: "Central Processing Facility",
  facility_type: "FPSO",
  location: "Offshore",
  design_capacity_oil_bpd: 150000,
  design_capacity_gas_mmscfd: 200,
  design_capacity_water_bpd: 100000,
  current_capacity_oil_bpd: 120000,
  current_capacity_gas_mmscfd: 150,
  current_capacity_water_bpd: 50000,
  installation_date: "2018-06-15T00:00:00.000Z",
  status: "Operational",
  created_date: now
};

export const demoProcessUnits = [
  {
    unit_id: UNIT_SEP_ID,
    facility_id: FACILITY_ID,
    name: "High Pressure Separation",
    unit_type: "Separation",
    function: "Primary 3-phase separation of well fluids.",
    design_capacity_bpd: 150000,
    current_capacity_bpd: 120000,
    bottleneck_capacity_bpd: 145000,
    status: "Operational",
    equipment_list: [EQ_SEP_1],
    created_date: now
  },
  {
    unit_id: UNIT_COMP_ID,
    facility_id: FACILITY_ID,
    name: "Gas Compression Train A",
    unit_type: "Compression",
    function: "Gas export compression.",
    design_capacity_bpd: 200000, // Normalized or equivalent units logic may apply, stored as bpd in schema for simplicity or this field represents equivalent throughput
    current_capacity_bpd: 150000,
    bottleneck_capacity_bpd: 190000,
    status: "Operational",
    equipment_list: [EQ_COMP_1],
    created_date: now
  },
  {
    unit_id: UNIT_DEHY_ID,
    facility_id: FACILITY_ID,
    name: "TEG Dehydration",
    unit_type: "Dehydration",
    function: "Gas water removal to export spec.",
    design_capacity_bpd: 180000,
    current_capacity_bpd: 150000,
    bottleneck_capacity_bpd: 175000,
    status: "Operational",
    equipment_list: [EQ_HEAT_1],
    created_date: now
  }
];

export const demoEquipment = [
  {
    equipment_id: EQ_SEP_1,
    unit_id: UNIT_SEP_ID,
    tag_number: "V-1001",
    equipment_type: "Vessel",
    manufacturer: "Frames",
    model: "3-Phase Horizontal",
    design_capacity: 150000,
    design_capacity_unit: "bpd",
    current_capacity: 120000,
    bottleneck_capacity: 145000,
    installation_date: "2018-06-15T00:00:00.000Z",
    status: "Operational",
    condition: "Good",
    maintenance_interval_months: 24,
    last_maintenance_date: "2023-01-10T00:00:00.000Z",
    created_date: now
  },
  {
    equipment_id: EQ_COMP_1,
    unit_id: UNIT_COMP_ID,
    tag_number: "K-2001",
    equipment_type: "Compressor",
    manufacturer: "Solar Turbines",
    model: "Titan 130",
    design_capacity: 100,
    design_capacity_unit: "mmscfd",
    current_capacity: 75,
    bottleneck_capacity: 95,
    installation_date: "2018-06-15T00:00:00.000Z",
    status: "Operational",
    condition: "Good",
    maintenance_interval_months: 6,
    last_maintenance_date: "2023-05-20T00:00:00.000Z",
    created_date: now
  },
  {
    equipment_id: EQ_HEAT_1,
    unit_id: UNIT_DEHY_ID,
    tag_number: "E-3001",
    equipment_type: "Heater",
    manufacturer: "Alfa Laval",
    model: "Plate Heat Exchanger",
    design_capacity: 50,
    design_capacity_unit: "mw",
    current_capacity: 40,
    bottleneck_capacity: 48,
    installation_date: "2018-06-15T00:00:00.000Z",
    status: "Operational",
    condition: "Fair",
    maintenance_interval_months: 12,
    last_maintenance_date: "2022-11-05T00:00:00.000Z",
    created_date: now
  }
];

export const demoStreams = [
  {
    stream_id: uuidv4(),
    facility_id: FACILITY_ID,
    source_unit_id: UNIT_SEP_ID,
    target_unit_id: UNIT_COMP_ID,
    stream_name: "Separated Gas",
    fluid_type: "Gas",
    design_flow_rate: 100,
    design_flow_unit: "mmscfd",
    design_pressure_psi: 800,
    design_temperature_f: 120,
    gor: 0,
    water_cut_percent: 0,
    created_date: now
  }
];

export const demoProductionProfiles = Array.from({ length: 20 }, (_, i) => ({
  profile_id: uuidv4(),
  project_id: PROJECT_ID,
  year: 2024 + i,
  month: 1,
  oil_rate_bpd: Math.max(0, 150000 - (i * 5000)), // Decline curve simulation
  gas_rate_mmscfd: Math.max(0, 200 - (i * 5)),
  water_rate_bpd: 20000 + (i * 4000), // Water cut increase
  fluid_gor: 1000,
  fluid_water_cut_percent: 10 + (i * 2),
  facility_utilization_percent: 85,
  created_date: now
}));

export const demoScenarios = [
  {
    scenario_id: SCENARIO_BASE_ID,
    project_id: PROJECT_ID,
    name: "Base Case",
    description: "Production forecast based on P50 reserves.",
    scenario_type: "Base",
    is_baseline: true,
    status: "Complete",
    created_date: now
  },
  {
    scenario_id: SCENARIO_OPT_ID,
    project_id: PROJECT_ID,
    name: "Optimistic",
    description: "Production forecast based on P10 reserves and tie-backs.",
    scenario_type: "High",
    is_baseline: false,
    status: "Draft",
    created_date: now
  }
];

export const demoExpansionPlans = [
  {
    expansion_id: uuidv4(),
    scenario_id: SCENARIO_OPT_ID,
    facility_id: FACILITY_ID,
    expansion_name: "Water Injection Upgrade",
    description: "Add pump capacity to support reservoir pressure maintenance.",
    equipment_id: EQ_COMP_1, // Placeholder linkage
    upgrade_type: "Addition",
    target_capacity: 150000,
    target_capacity_unit: "bpd",
    implementation_year: 2026,
    implementation_duration_months: 18,
    capex_million: 45,
    opex_impact_annual_million: 2.5,
    production_increase_bpd: 15000,
    roi_percent: 22,
    payback_period_years: 3.5,
    status: "Proposed",
    created_date: now
  }
];

export const demoCapacityAnalysis = [
  {
    analysis_id: uuidv4(),
    facility_id: FACILITY_ID,
    scenario_id: SCENARIO_BASE_ID,
    analysis_year: 2025,
    oil_demand_bpd: 145000,
    oil_available_capacity_bpd: 150000,
    oil_utilization_percent: 96.6,
    gas_demand_mmscfd: 180,
    gas_available_capacity_mmscfd: 200,
    gas_utilization_percent: 90,
    water_demand_bpd: 30000,
    water_available_capacity_bpd: 100000,
    water_utilization_percent: 30,
    bottleneck_unit_id: UNIT_SEP_ID,
    bottleneck_unit_name: "High Pressure Separation",
    bottleneck_severity: "High",
    created_date: now
  }
];

export const demoMasterPlans = [
  {
    plan_id: uuidv4(),
    scenario_id: SCENARIO_OPT_ID,
    facility_id: FACILITY_ID,
    plan_name: "2030 Strategic Expansion",
    plan_horizon_years: 10,
    total_capex_million: 120,
    total_opex_impact_annual_million: 8,
    total_production_increase_bpd: 35000,
    expansion_phases: [
      {
        phase: 1,
        year: 2026,
        expansions: [demoExpansionPlans[0].expansion_id],
        capex_million: 45,
        production_increase_bpd: 15000
      }
    ],
    npv_million: 350,
    irr_percent: 18.5,
    payback_period_years: 4.2,
    status: "Draft",
    created_date: now
  }
];

export const demoRiskAnalysis = [
  {
    risk_id: uuidv4(),
    facility_id: FACILITY_ID,
    scenario_id: SCENARIO_BASE_ID,
    risk_name: "Compressor Reliability",
    risk_category: "Technical",
    risk_severity: "High",
    probability_percent: 30,
    impact_description: "Unplanned downtime resulting in production deferment.",
    mitigation_strategy: "Implement predictive maintenance AI module and stock critical spares.",
    mitigation_cost_million: 1.2,
    mitigation_timeline_months: 6,
    created_date: now
  }
];
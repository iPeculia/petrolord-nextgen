import { v4 as uuidv4 } from 'uuid';

const PROJECT_ID = uuidv4();
const WELL_ID = uuidv4();
const FLUID_ID = uuidv4();
const PUMP_ID = uuidv4();
const CHOKE_ID = uuidv4();
const SCENARIO_ID = uuidv4();
const SIM_RESULT_ID = uuidv4();

export const DEMO_PROJECT = {
  project_id: PROJECT_ID,
  name: "Gulf of Mexico Deepwater Hydraulics",
  description: "High pressure high temperature well simulation",
  location: "GoM Block 102",
  unit_system: "API",
  owner: uuidv4(),
  created_date: new Date().toISOString(),
  status: "Active"
};

export const DEMO_WELL = {
  well_id: WELL_ID,
  project_id: PROJECT_ID,
  name: "Well X-05",
  api_number: "42-000-00000",
  rig_name: "Deepwater Horizon II",
  water_depth_ft: 5000,
  rkb_elevation_ft: 85,
  mud_line_elevation_ft: -5000,
  total_depth_ft: 25000,
  status: "Planned",
  created_date: new Date().toISOString()
};

export const DEMO_SECTIONS = [
  {
    section_id: uuidv4(),
    well_id: WELL_ID,
    section_name: "Surface Casing",
    type: "Casing",
    od_inches: 13.375,
    id_inches: 12.415,
    top_depth_ft: 0,
    bottom_depth_ft: 8500,
    roughness_microns: 25,
    sequence: 1,
    created_date: new Date().toISOString()
  },
  {
    section_id: uuidv4(),
    well_id: WELL_ID,
    section_name: "Intermediate Casing",
    type: "Casing",
    od_inches: 9.625,
    id_inches: 8.535,
    top_depth_ft: 8500,
    bottom_depth_ft: 18000,
    roughness_microns: 25,
    sequence: 2,
    created_date: new Date().toISOString()
  },
  {
    section_id: uuidv4(),
    well_id: WELL_ID,
    section_name: "Production Hole",
    type: "Open Hole",
    od_inches: 8.5,
    id_inches: 8.5,
    top_depth_ft: 18000,
    bottom_depth_ft: 25000,
    roughness_microns: 100,
    sequence: 3,
    created_date: new Date().toISOString()
  }
];

export const DEMO_FLUID = {
  fluid_id: FLUID_ID,
  project_id: PROJECT_ID,
  name: "Synthetic 14.5 ppg",
  fluid_type: "Synthetic",
  base_fluid_density_ppg: 14.5,
  rheology_model: "Herschel-Bulkley",
  plastic_viscosity_cp: 25,
  yield_point_lbf_per_100ft2: 18,
  gel_strength_10sec_lbf_per_100ft2: 12,
  gel_strength_10min_lbf_per_100ft2: 16,
  lsr_readings: {
    rpm_600: 75,
    rpm_300: 45,
    rpm_200: 35,
    rpm_100: 22,
    rpm_6: 8,
    rpm_3: 6
  },
  temperature_f: 150,
  solids_content_percent: 5,
  created_date: new Date().toISOString()
};

export const DEMO_TUBULARS = [
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "Drill Pipe",
    od_inches: 5.5,
    id_inches: 4.778,
    weight_per_foot_lbm: 24.7,
    length_ft: 20000,
    tool_joint_od_inches: 7.0,
    roughness_microns: 20,
    sequence: 1,
    created_date: new Date().toISOString()
  },
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "HWDP",
    od_inches: 5.5,
    id_inches: 3.25,
    weight_per_foot_lbm: 54.0,
    length_ft: 1000,
    tool_joint_od_inches: 7.0,
    roughness_microns: 25,
    sequence: 2,
    created_date: new Date().toISOString()
  },
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "Drill Collar",
    od_inches: 6.5,
    id_inches: 2.8125,
    weight_per_foot_lbm: 91.0,
    length_ft: 500,
    tool_joint_od_inches: 6.5,
    roughness_microns: 30,
    sequence: 3,
    created_date: new Date().toISOString()
  }
];

export const DEMO_PUMP = {
  pump_id: PUMP_ID,
  project_id: PROJECT_ID,
  name: "Rig Pump 1",
  pump_type: "Triplex",
  liner_size_inches: 6.5,
  stroke_length_inches: 12,
  efficiency_percent: 95,
  max_spm: 120,
  displacement_bbl_per_stroke: 0.12,
  max_pressure_psi: 7500,
  max_flow_gpm: 1200,
  created_date: new Date().toISOString()
};

export const DEMO_CHOKE = {
  choke_id: CHOKE_ID,
  well_id: WELL_ID,
  choke_type: "Adjustable",
  opening_percent: 45,
  pressure_drop_psi: 250,
  flow_capacity_gpm: 2000,
  created_date: new Date().toISOString()
};

export const DEMO_SCENARIO = {
  scenario_id: SCENARIO_ID,
  well_id: WELL_ID,
  name: "Base Case",
  description: "Initial drilling parameters",
  fluid_id: FLUID_ID,
  pump_id: PUMP_ID,
  choke_id: CHOKE_ID,
  flow_rate_gpm: 600,
  pump_rpm: 80,
  rate_of_penetration_ft_per_hr: 50,
  surface_backpressure_psi: 200,
  status: "Complete",
  created_date: new Date().toISOString()
};

export const DEMO_SIM_RESULT = {
  result_id: SIM_RESULT_ID,
  scenario_id: SCENARIO_ID,
  well_id: WELL_ID,
  simulation_date: new Date().toISOString(),
  convergence_achieved: true,
  iterations: 12,
  execution_time_seconds: 0.45,
  error_message: null
};

export const DEMO_DEPTH_RESULTS = [
  {
    depth_result_id: uuidv4(),
    simulation_result_id: SIM_RESULT_ID,
    measured_depth_ft: 5000,
    hole_section_id: DEMO_SECTIONS[0].section_id,
    flow_rate_gpm: 600,
    velocity_ft_per_sec: 4.5,
    pressure_drop_psi: 150,
    standpipe_pressure_psi: 3200,
    annular_pressure_loss_psi: 50,
    ecd_ppg: 14.6,
    ecd_fracture_margin_ppg: 16.5,
    ecd_pore_margin_ppg: 12.0,
    cuttings_transport_ratio: 0.85,
    hole_cleaning_status: "Good",
    reynolds_number: 4500,
    flow_regime: "Turbulent"
  }
];

export const DEMO_OPTIMIZATION = {
  optimization_id: uuidv4(),
  well_id: WELL_ID,
  optimization_type: "Hole Cleaning",
  current_flow_rate_gpm: 600,
  optimized_flow_rate_gpm: 750,
  current_ecd_ppg: 14.6,
  optimized_ecd_ppg: 14.8,
  current_hole_cleaning: 0.85,
  optimized_hole_cleaning: 0.95,
  pump_power_reduction_percent: 0,
  recommendations: "Increase flow rate to 750 GPM to improve cuttings transport.",
  created_date: new Date().toISOString()
};

export const DEMO_SURGE_SWAB = {
  analysis_id: uuidv4(),
  well_id: WELL_ID,
  pipe_speed_ft_per_min: 60,
  surge_pressure_psi: 350,
  swab_pressure_psi: -300,
  equivalent_surge_density_ppg: 15.2,
  equivalent_swab_density_ppg: 13.8,
  fracture_margin_surge_ppg: 16.5,
  pore_margin_swab_ppg: 12.0,
  created_date: new Date().toISOString()
};
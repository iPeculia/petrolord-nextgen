import { v4 as uuidv4 } from 'uuid';

// Constants for consistent IDs in demo
const PROJECT_ID = uuidv4();
const WELL_ID = uuidv4();
const OWNER_ID = uuidv4();
const STRING_ID = uuidv4();
const FLUID_ID = uuidv4();
const FRICTION_ID = uuidv4();

export const DEMO_PROJECT = {
  project_id: PROJECT_ID,
  name: "Gulf of Mexico Deepwater Well",
  description: "Exploration well in Mississippi Canyon block. High pressure, high temperature environment.",
  location: "Gulf of Mexico",
  unit_system: "Imperial",
  owner: OWNER_ID,
  created_date: new Date().toISOString(),
  status: "Active"
};

export const DEMO_WELL = {
  well_id: WELL_ID,
  project_id: PROJECT_ID,
  name: "Well X-05",
  api_number: "42-123-45678",
  rig_name: "Deepwater Titan",
  water_depth_ft: 4500,
  rkb_elevation_ft: 85,
  total_depth_ft: 18500,
  hole_size_inches: 12.25,
  casing_program: "20in @ 3000ft, 13-3/8in @ 8500ft, 9-5/8in @ 14000ft",
  status: "Drilling",
  created_date: new Date().toISOString()
};

const generateStations = (wellId) => {
  const stations = [];
  let md = 0;
  let inc = 0;
  let azi = 45;
  let tvd = 0;
  
  // Vertical section
  for(let i=0; i<5; i++) {
    stations.push({
      station_id: uuidv4(),
      well_id: wellId,
      measured_depth_ft: md,
      inclination_degrees: 0,
      azimuth_degrees: 0,
      true_vertical_depth_ft: md,
      north_south_ft: 0,
      east_west_ft: 0,
      dogleg_severity_dls: 0,
      section: "Vertical",
      created_date: new Date().toISOString()
    });
    md += 1000;
  }
  
  // Build section
  tvd = md;
  for(let i=0; i<5; i++) {
    inc += 6; // Build 6 deg per 1000ft (simplified)
    const rad = inc * (Math.PI/180);
    const dMD = 500;
    md += dMD;
    tvd += dMD * Math.cos(rad);
    
    stations.push({
      station_id: uuidv4(),
      well_id: wellId,
      measured_depth_ft: md,
      inclination_degrees: inc,
      azimuth_degrees: azi,
      true_vertical_depth_ft: tvd,
      north_south_ft: 100 * i, // Simplified coordinates
      east_west_ft: 100 * i,
      dogleg_severity_dls: 3.0,
      section: "Build",
      created_date: new Date().toISOString()
    });
  }
  
  return stations;
};

export const DEMO_STATIONS = generateStations(WELL_ID);

export const DEMO_COMPONENTS = [
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "Drill Pipe",
    od_inches: 5.0,
    id_inches: 4.276,
    weight_per_foot_lbm: 19.5,
    grade: "S",
    material: "Steel",
    connection_type: "API",
    tool_joint_od_inches: 6.5,
    box_length_inches: 12,
    yield_strength_psi: 135000,
    tensile_strength_psi: 145000,
    created_date: new Date().toISOString()
  },
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "HWDP",
    od_inches: 5.0,
    id_inches: 3.0,
    weight_per_foot_lbm: 49.3,
    grade: "S",
    material: "Steel",
    connection_type: "API",
    tool_joint_od_inches: 6.625,
    box_length_inches: 24,
    yield_strength_psi: 135000,
    tensile_strength_psi: 145000,
    created_date: new Date().toISOString()
  },
  {
    component_id: uuidv4(),
    well_id: WELL_ID,
    type: "Drill Collar",
    od_inches: 8.0,
    id_inches: 2.875,
    weight_per_foot_lbm: 147,
    grade: "S",
    material: "Steel",
    connection_type: "API",
    tool_joint_od_inches: 8.0,
    box_length_inches: 30,
    yield_strength_psi: 110000,
    tensile_strength_psi: 125000,
    created_date: new Date().toISOString()
  }
];

export const DEMO_DRILL_STRING = {
  string_id: STRING_ID,
  well_id: WELL_ID,
  name: "Drilling BHA #4 - 12.25in Hole",
  description: "Rotary Steerable Assembly for Build Section",
  components: [
    {
      sequence: 1,
      component_id: DEMO_COMPONENTS[0].component_id,
      length_ft: 8500,
      quantity: 280
    },
    {
      sequence: 2,
      component_id: DEMO_COMPONENTS[1].component_id,
      length_ft: 450,
      quantity: 15
    },
    {
      sequence: 3,
      component_id: DEMO_COMPONENTS[2].component_id,
      length_ft: 90,
      quantity: 3
    }
  ],
  total_length_ft: 9040,
  total_weight_air_lbm: 185000,
  total_weight_buoyed_lbm: 155000,
  status: "Active",
  created_date: new Date().toISOString()
};

export const DEMO_DRILLING_FLUID = {
  fluid_id: FLUID_ID,
  well_id: WELL_ID,
  fluid_type: "Synthetic",
  density_ppg: 12.5,
  plastic_viscosity_cp: 25,
  yield_point_lbf_per_100ft2: 15,
  gel_strength_10sec_lbf_per_100ft2: 6,
  gel_strength_10min_lbf_per_100ft2: 12,
  oil_water_ratio: 0.8,
  solids_content_percent: 15,
  temperature_f: 150,
  created_date: new Date().toISOString()
};

export const DEMO_FRICTION = {
  friction_id: FRICTION_ID,
  well_id: WELL_ID,
  cased_hole_ff: 0.25,
  open_hole_ff: 0.35,
  riser_ff: 0.20,
  pipe_to_pipe_ff: 0.25,
  notes: "Standard friction factors for OBM",
  created_date: new Date().toISOString()
};

export const DEMO_SCENARIOS = [
  {
    scenario_id: uuidv4(),
    well_id: WELL_ID,
    name: "Tripping Out",
    description: "POOH from TD to Surface",
    operation_type: "Tripping Out",
    pipe_speed_ft_per_min: 90,
    rotation_rpm: 0,
    weight_on_bit_lbf: 0,
    pump_rate_gpm: 0,
    status: "Complete",
    created_date: new Date().toISOString()
  },
  {
    scenario_id: uuidv4(),
    well_id: WELL_ID,
    name: "Slide Drilling",
    description: "Sliding with Motor @ 14,500ft",
    operation_type: "Sliding",
    pipe_speed_ft_per_min: 60,
    rotation_rpm: 0,
    weight_on_bit_lbf: 25000,
    pump_rate_gpm: 800,
    status: "Pending",
    created_date: new Date().toISOString()
  }
];

export const DEMO_ANALYSIS_RESULT = {
  result_id: uuidv4(),
  scenario_id: DEMO_SCENARIOS[0].scenario_id,
  well_id: WELL_ID,
  analysis_date: new Date().toISOString(),
  convergence_achieved: true,
  iterations: 5,
  execution_time_seconds: 1.2,
  error_message: null
};

export const DEMO_OPERATIONAL_LIMIT = {
  limit_id: uuidv4(),
  analysis_result_id: DEMO_ANALYSIS_RESULT.result_id,
  max_hook_load_lbf: 500000,
  max_torque_ft_lbf: 35000,
  max_drag_lbf: 100000,
  max_pipe_stress_psi: 135000,
  min_safety_factor: 1.1,
  limiting_factor: "Pipe Strength"
};
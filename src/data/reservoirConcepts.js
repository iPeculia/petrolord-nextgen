import { Droplets, Layers, Wind, Gauge, Activity, Box, Zap, Scale, ChevronRight, Waves } from 'lucide-react';

export const RESERVOIR_CONCEPTS = [
  {
    id: 'rc_01',
    title: 'Porosity (φ)',
    description: 'The measure of the void (i.e., "empty") spaces in a material. It is a fraction of the volume of voids over the total volume.',
    category: 'Rock Properties',
    difficulty: 'Beginner',
    icon: 'Box',
    formula: 'φ = V_pore / V_bulk',
    details: 'Porosity determines the storage capacity of the reservoir. Primary porosity is formed during deposition, while secondary porosity forms later (e.g., fractures).'
  },
  {
    id: 'rc_02',
    title: 'Permeability (k)',
    description: 'The ability of a rock to transmit fluids. It connects the pores and allows fluid flow.',
    category: 'Rock Properties',
    difficulty: 'Beginner',
    icon: 'Wind',
    formula: 'k = QμL / (AΔP)',
    details: 'Measured in Darcies (D) or millidarcies (mD). High permeability means fluids flow easily. Absolute permeability refers to flow of a single phase.'
  },
  {
    id: 'rc_03',
    title: "Darcy's Law",
    description: 'The fundamental equation describing the flow of fluid through a porous medium.',
    category: 'Fluid Flow',
    difficulty: 'Intermediate',
    icon: 'Activity',
    formula: 'q = -kA/μ * (dP/dx)',
    details: 'Describes the relationship between flow rate, fluid viscosity, and pressure drop over a distance in a porous medium.'
  },
  {
    id: 'rc_04',
    title: 'Fluid Saturation',
    description: 'The fraction of the pore volume occupied by a specific fluid (oil, water, or gas).',
    category: 'Fluid Properties',
    difficulty: 'Beginner',
    icon: 'Droplets',
    formula: 'S_w + S_o + S_g = 1',
    details: 'Saturation controls the relative permeability and the total volume of hydrocarbons in place.'
  },
  {
    id: 'rc_05',
    title: 'Capillary Pressure',
    description: 'The pressure difference across the interface between two immiscible fluids in a capillary tube or porous medium.',
    category: 'Rock-Fluid Interaction',
    difficulty: 'Advanced',
    icon: 'Gauge',
    formula: 'Pc = P_non-wetting - P_wetting',
    details: 'Determines the fluid distribution in the reservoir rock, particularly the transition zone.'
  },
  {
    id: 'rc_06',
    title: 'Material Balance',
    description: 'Conservation of mass applied to a reservoir. Used to estimate reserves and identify drive mechanisms.',
    category: 'Reservoir Engineering',
    difficulty: 'Advanced',
    icon: 'Scale',
    formula: 'Production = Expansion + Influx + Injection',
    details: 'Often simplified as the General Material Balance Equation (GMBE). Essential for history matching.'
  },
  {
    id: 'rc_07',
    title: 'Drive Mechanisms',
    description: 'The natural energy sources that displace hydrocarbons from the reservoir into the wellbore.',
    category: 'Reservoir Dynamics',
    difficulty: 'Intermediate',
    icon: 'Zap',
    formula: 'N/A',
    details: 'Includes solution gas drive, gas cap expansion, water drive, compaction drive, and gravity drainage.'
  },
  {
    id: 'rc_08',
    title: 'Phase Behavior (PVT)',
    description: 'The study of how pressure, volume, and temperature affect fluid state and properties.',
    category: 'Fluid Properties',
    difficulty: 'Advanced',
    icon: 'Layers',
    formula: 'PV = ZnRT',
    details: 'Understanding bubble point, dew point, and critical point is vital for reservoir management.'
  },
  {
    id: 'rc_09',
    title: 'Wettability',
    description: 'The tendency of one fluid to spread on or adhere to a solid surface in the presence of other immiscible fluids.',
    category: 'Rock-Fluid Interaction',
    difficulty: 'Intermediate',
    icon: 'Waves',
    formula: 'cos(θ)',
    details: 'Affects capillary pressure, relative permeability, and electrical properties. Rocks can be water-wet, oil-wet, or mixed-wet.'
  },
  {
    id: 'rc_10',
    title: 'Skin Factor',
    description: 'A dimensionless factor representing the extra pressure drop near the wellbore due to damage or stimulation.',
    category: 'Well Performance',
    difficulty: 'Intermediate',
    icon: 'ChevronRight',
    formula: "S = (k/k_skin - 1) * ln(r_s/r_w)",
    details: 'Positive skin indicates damage (flow restriction), negative skin indicates stimulation (improved flow).'
  }
];
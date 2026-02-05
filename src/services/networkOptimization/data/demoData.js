import { createNetwork } from '../models/Network';
import { createNode } from '../models/Node';
import { createPipeline } from '../models/Pipeline';
import { createFacility } from '../models/Facility';

export const generateDemoData = () => {
  const network = createNetwork({
    name: 'North Sea Field Alpha',
    description: 'Offshore production network with 3 satellite wells feeding a central processing platform.',
    location: 'North Sea Block 4',
    type: 'Oil',
    fluid_model: 'Black Oil'
  });

  const node1 = createNode({
    network_id: network.network_id,
    name: 'Well A-01',
    type: 'Well',
    location: { x: 100, y: 100, elevation: -5000 },
    well_data: {
      production_rate_bpd: 5000,
      static_pressure_psi: 3500,
      temperature_f: 180,
      gor: 800,
      water_cut: 0.15,
      api_gravity: 32
    }
  });

  const node2 = createNode({
    network_id: network.network_id,
    name: 'Well A-02',
    type: 'Well',
    location: { x: 100, y: 300, elevation: -5200 },
    well_data: {
      production_rate_bpd: 4200,
      static_pressure_psi: 3400,
      temperature_f: 175,
      gor: 750,
      water_cut: 0.20,
      api_gravity: 31
    }
  });

  const node3 = createNode({
    network_id: network.network_id,
    name: 'Junction J-1',
    type: 'Junction',
    location: { x: 300, y: 200, elevation: -4800 }
  });

  const node4 = createNode({
    network_id: network.network_id,
    name: 'Platform P-1',
    type: 'Separator',
    location: { x: 500, y: 200, elevation: 100 }
  });

  const node5 = createNode({
    network_id: network.network_id,
    name: 'Export Line',
    type: 'Sink',
    location: { x: 700, y: 200, elevation: 50 }
  });

  const pipeline1 = createPipeline({
    network_id: network.network_id,
    name: 'FL-01',
    from_node_id: node1.node_id,
    to_node_id: node3.node_id,
    length_miles: 2.5,
    diameter_inches: 6,
    material: 'Carbon Steel',
    roughness_microns: 45,
    pressure_rating_psi: 5000,
    installation_cost: 1200000,
    operating_cost_per_year: 50000
  });

  const pipeline2 = createPipeline({
    network_id: network.network_id,
    name: 'FL-02',
    from_node_id: node2.node_id,
    to_node_id: node3.node_id,
    length_miles: 3.1,
    diameter_inches: 6,
    material: 'Carbon Steel',
    roughness_microns: 45,
    pressure_rating_psi: 5000,
    installation_cost: 1500000,
    operating_cost_per_year: 55000
  });

  const pipeline3 = createPipeline({
    network_id: network.network_id,
    name: 'TL-01',
    from_node_id: node3.node_id,
    to_node_id: node4.node_id,
    length_miles: 5.0,
    diameter_inches: 10,
    material: 'Carbon Steel',
    roughness_microns: 45,
    pressure_rating_psi: 3000,
    installation_cost: 3500000,
    operating_cost_per_year: 100000
  });

  const pipeline4 = createPipeline({
    network_id: network.network_id,
    name: 'EXP-01',
    from_node_id: node4.node_id,
    to_node_id: node5.node_id,
    length_miles: 12.0,
    diameter_inches: 16,
    material: 'Carbon Steel',
    roughness_microns: 40,
    pressure_rating_psi: 1500,
    installation_cost: 8000000,
    operating_cost_per_year: 200000
  });

  const facility1 = createFacility({
    network_id: network.network_id,
    name: 'HP Separator',
    type: 'Separator',
    node_id: node4.node_id,
    capacity: 20000,
    capacity_unit: 'bpd',
    efficiency_percent: 95,
    inlet_pressure_psi: 500,
    outlet_pressure_psi: 100,
    installation_cost: 4500000,
    operating_cost_per_year: 350000
  });

  return {
    networks: [network],
    nodes: [node1, node2, node3, node4, node5],
    pipelines: [pipeline1, pipeline2, pipeline3, pipeline4],
    facilities: [facility1],
    scenarios: [],
    simulations: [],
    optimizationResults: [],
    debottleneckingStrategies: [],
    nodeResults: [],
    pipelineResults: []
  };
};
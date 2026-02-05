import { v4 as uuidv4 } from 'uuid';

export const generateDemoData = () => {
  const projectId = uuidv4();
  const scenarioIds = [uuidv4(), uuidv4(), uuidv4()];
  const ownerId = uuidv4(); // Placeholder owner ID

  const demoProject = {
    project_id: projectId,
    name: "Deepwater Development Project",
    description: "Offshore deepwater field development with 5 subsea wells tied back to FPSO.",
    location: "Gulf of Mexico",
    currency: "USD",
    discount_rate_percent: 10,
    project_life_years: 20,
    owner: ownerId,
    created_date: new Date().toISOString(),
    status: "Active"
  };

  const demoScenarios = [
    {
      scenario_id: scenarioIds[0],
      project_id: projectId,
      name: "Base Case",
      description: "Standard reservoir performance with P50 reserves.",
      scenario_type: "Base",
      probability_percent: 50,
      status: "Complete",
      created_date: new Date().toISOString()
    },
    {
      scenario_id: scenarioIds[1],
      project_id: projectId,
      name: "Optimistic",
      description: "Upside reservoir performance with P10 reserves.",
      scenario_type: "High",
      probability_percent: 25,
      status: "Complete",
      created_date: new Date().toISOString()
    },
    {
      scenario_id: scenarioIds[2],
      project_id: projectId,
      name: "Pessimistic",
      description: "Downside reservoir performance with P90 reserves.",
      scenario_type: "Low",
      probability_percent: 25,
      status: "Complete",
      created_date: new Date().toISOString()
    }
  ];

  const demoAssumptions = demoScenarios.map((scenario) => ({
    assumption_id: uuidv4(),
    scenario_id: scenario.scenario_id,
    start_year: 2024,
    project_life_years: 20,
    initial_production_bopd: scenario.scenario_type === 'Base' ? 15000 : (scenario.scenario_type === 'High' ? 20000 : 10000),
    production_decline_rate_percent: 12,
    oil_price_model: 'Flat',
    oil_price_base_per_bbl: 75,
    oil_price_values: Array(20).fill(75),
    gas_price_model: 'Flat',
    gas_price_base_per_mmbtu: 3.5,
    gas_price_values: Array(20).fill(3.5),
    total_capex_million: 450,
    capex_schedule: [150, 200, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fixed_opex_per_year_million: 15,
    variable_opex_per_bbl: 5,
    income_tax_rate_percent: 21,
    royalty_rate_percent: 12.5,
    inflation_rate_percent: 2.5,
    abandonment_cost_million: 50,
    created_date: new Date().toISOString()
  }));

  const demoCashFlows = demoScenarios.flatMap(scenario => {
    return Array.from({ length: 20 }, (_, i) => ({
      cashflow_id: uuidv4(),
      scenario_id: scenario.scenario_id,
      year: 2024 + i,
      production_bopd: 15000 * Math.pow(0.88, i),
      production_boe: 15000 * Math.pow(0.88, i) * 365, // Simplified
      oil_revenue_million: 100, // Simplified placeholder
      gas_revenue_million: 10,
      gross_revenue_million: 110,
      royalty_million: 13.75,
      net_revenue_million: 96.25,
      fixed_opex_million: 15,
      variable_opex_million: 5,
      total_opex_million: 20,
      ebitda_million: 76.25,
      capex_million: i < 3 ? [150, 200, 100][i] : 0,
      depreciation_million: 22.5,
      ebit_million: 53.75,
      income_tax_million: 11.28,
      net_income_million: 42.47,
      operating_cash_flow_million: 64.97,
      free_cash_flow_million: 64.97 - (i < 3 ? [150, 200, 100][i] : 0),
      cumulative_cash_flow_million: 100 // Placeholder
    }));
  });

  const demoNPVResults = demoScenarios.map(scenario => ({
    result_id: uuidv4(),
    scenario_id: scenario.scenario_id,
    project_id: projectId,
    discount_rate_percent: 10,
    npv_million: scenario.scenario_type === 'Base' ? 150.5 : (scenario.scenario_type === 'High' ? 320.8 : -45.2),
    irr_percent: scenario.scenario_type === 'Base' ? 18.5 : (scenario.scenario_type === 'High' ? 28.2 : 8.5),
    payback_period_years: 4.5,
    max_exposure_million: 450,
    profitability_index: 1.33,
    break_even_oil_price_per_bbl: 42.5,
    break_even_gas_price_per_mmbtu: 2.1,
    pi_ratio: 1.33,
    calculation_date: new Date().toISOString()
  }));

  return {
    projects: [demoProject],
    scenarios: demoScenarios,
    economic_assumptions: demoAssumptions,
    cash_flows: demoCashFlows,
    npv_results: demoNPVResults,
    sensitivity_analysis: {},
    monte_carlo_simulations: [],
    monte_carlo_results: {},
    breakeven_analysis: []
  };
};
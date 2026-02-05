import { v4 as uuidv4 } from 'uuid';
import { createProject } from '../models/Project';
import { createRisk } from '../models/RiskRegister';
import { createRiskParameter } from '../models/RiskParameter';
import { createScenario } from '../models/Scenario';
import { createSimulation } from '../models/MonteCarloSimulation';
import { createRiskAnalysisResult } from '../models/RiskAnalysisResult';
import { createSensitivityAnalysis } from '../models/SensitivityAnalysis';
import { createRiskMitigation } from '../models/RiskMitigation';

export const generateDemoData = (userId) => {
  const projectId = uuidv4();
  const simulationId = uuidv4();

  const project = createProject({
    project_id: projectId,
    name: "North Sea Expansion Project",
    description: "Offshore expansion including 3 new wells and subsea infrastructure upgrades.",
    type: "Oil",
    currency: "USD",
    owner: userId,
    status: "Active"
  });

  const risks = [
    createRisk({
      project_id: projectId,
      title: "Oil Price Volatility",
      category: "Market",
      probability_percent: 80,
      impact_value: 5000000,
      impact_type: "Financial",
      owner: userId,
      description: "Significant drop in Brent crude prices affecting project viability."
    }),
    createRisk({
      project_id: projectId,
      title: "Drilling Equipment Failure",
      category: "Technical",
      probability_percent: 25,
      impact_value: 2000000,
      impact_type: "Schedule",
      owner: userId,
      description: "Potential failure of drilling rig or key components leading to downtime."
    }),
    createRisk({
      project_id: projectId,
      title: "Regulatory Approval Delay",
      category: "Regulatory",
      probability_percent: 40,
      impact_value: 1500000,
      impact_type: "Schedule",
      owner: userId,
      description: "Delays in obtaining environmental permits from local authorities."
    })
  ];

  const riskParameters = [
    createRiskParameter({
      risk_id: risks[0].risk_id,
      name: "Oil Price ($/bbl)",
      distribution_type: "Lognormal",
      p10_value: 45,
      p50_value: 65,
      p90_value: 95,
      min_value: 30,
      max_value: 120,
      unit: "$/bbl"
    }),
    createRiskParameter({
      risk_id: risks[1].risk_id,
      name: "Downtime Days",
      distribution_type: "Triangular",
      p10_value: 5,
      p50_value: 15,
      p90_value: 30,
      min_value: 0,
      max_value: 45,
      unit: "days"
    })
  ];

  const scenarios = [
    createScenario({
      project_id: projectId,
      name: "Base Case",
      probability_weight: 0.5,
      description: "Expected market conditions and standard operational performance.",
      expected_npv: 12500000,
      expected_irr: 18.5
    }),
    createScenario({
      project_id: projectId,
      name: "Optimistic",
      probability_weight: 0.2,
      description: "High oil prices and efficient execution.",
      expected_npv: 25000000,
      expected_irr: 28.0
    }),
    createScenario({
      project_id: projectId,
      name: "Pessimistic",
      probability_weight: 0.3,
      description: "Low oil prices and significant delays.",
      expected_npv: -5000000,
      expected_irr: 5.0
    })
  ];

  const simulation = createSimulation({
    simulation_id: simulationId,
    project_id: projectId,
    number_of_iterations: 1000,
    status: "Complete",
    progress_percent: 100,
    execution_time_seconds: 4.5
  });

  const analysisResult = createRiskAnalysisResult({
    project_id: projectId,
    simulation_id: simulationId,
    mean_npv: 11500000,
    std_dev_npv: 4500000,
    p10_npv: 4000000,
    p50_npv: 11000000,
    p90_npv: 19500000,
    probability_positive_npv: 0.88,
    value_at_risk_95: 2500000,
    expected_shortfall: 1500000,
    mean_irr: 16.5,
    std_dev_irr: 5.2,
    p10_irr: 8.0,
    p50_irr: 16.2,
    p90_irr: 24.5
  });

  const sensitivityAnalysis = createSensitivityAnalysis({
    project_id: projectId,
    base_case_npv: 12500000,
    parameters: [
      {
        parameter_name: "Oil Price",
        low_case_npv: 8000000,
        high_case_npv: 18000000,
        sensitivity_index: 0.85
      },
      {
        parameter_name: "CAPEX",
        low_case_npv: 13500000,
        high_case_npv: 10500000,
        sensitivity_index: 0.45
      }
    ]
  });

  const mitigations = [
    createRiskMitigation({
      risk_id: risks[0].risk_id,
      action: "Implement hedging strategy for 50% of production volume.",
      owner: userId,
      target_date: new Date().toISOString().split('T')[0],
      status: "In Progress",
      effectiveness_percent: 70,
      cost: 150000
    })
  ];

  return {
    projects: [project],
    risks,
    riskParameters,
    scenarios,
    simulations: [simulation],
    analysisResults: { [simulationId]: analysisResult },
    sensitivityAnalysis: { [projectId]: sensitivityAnalysis },
    mitigations
  };
};
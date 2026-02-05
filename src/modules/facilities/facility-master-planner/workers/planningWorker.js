/* eslint-disable no-restricted-globals */

import FacilityPlanningEngine, { PlanningEngineError } from '../utils/facilityPlanningEngine';

/* 
 * Web Worker for Facility Master Planning
 * Handles heavy calculations (Optimization, Monte Carlo, Large Datasets) off the main thread.
 */

self.onmessage = async (e) => {
  const { type, payload, id } = e.data;
  
  try {
    // Notify start
    self.postMessage({ type: 'PROGRESS', id, payload: { status: 'started', progress: 0 } });

    let result;

    switch (type) {
      case 'RUN_FULL_ANALYSIS':
        result = runFullAnalysis(payload, id);
        break;
      
      case 'GENERATE_EXPANSION_PLAN':
        // Simulate progress
        self.postMessage({ type: 'PROGRESS', id, payload: { status: 'calculating', progress: 30 } });
        result = FacilityPlanningEngine.generateExpansionPlan(payload.productionProfile, payload.facilityDesign);
        self.postMessage({ type: 'PROGRESS', id, payload: { status: 'calculating', progress: 90 } });
        break;

      case 'CALCULATE_CAPEX_BATCH':
         result = payload.items.map(item => ({
             id: item.id,
             capex: FacilityPlanningEngine.calculateCAPEX(item.type, item.capacity)
         }));
         break;

      default:
        throw new Error(`Unknown worker task type: ${type}`);
    }

    // Notify completion
    self.postMessage({ type: 'SUCCESS', id, payload: result });

  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      id, 
      payload: { 
        message: error.message, 
        code: error instanceof PlanningEngineError ? error.code : 'WORKER_ERROR' 
      } 
    });
  }
};

/**
 * Orchestrates a full analysis run.
 */
function runFullAnalysis(data, taskId) {
    // 1. Validation
    const validation = FacilityPlanningEngine.validateScenario(data);
    if (!validation.isValid) {
        throw new PlanningEngineError('Scenario validation failed', 'VALIDATION_ERROR', { errors: validation.errors });
    }
    self.postMessage({ type: 'PROGRESS', id: taskId, payload: { status: 'validating', progress: 20 } });

    // 2. Capacity Analysis
    const capacityResults = FacilityPlanningEngine.analyzeCapacity(data.productionProfile, data.facility);
    self.postMessage({ type: 'PROGRESS', id: taskId, payload: { status: 'analyzing_capacity', progress: 50 } });

    // 3. Expansion Planning
    const expansions = FacilityPlanningEngine.generateExpansionPlan(data.productionProfile, data.facility);
    self.postMessage({ type: 'PROGRESS', id: taskId, payload: { status: 'planning_expansions', progress: 75 } });

    // 4. Cost Estimation (Base + Expansions)
    let totalCapex = FacilityPlanningEngine.calculateCAPEX(data.facility.type || 'FPSO', data.facility.design_capacity_oil_bpd);
    expansions.forEach(exp => totalCapex += exp.estimated_capex);
    
    self.postMessage({ type: 'PROGRESS', id: taskId, payload: { status: 'finalizing', progress: 95 } });

    return {
        timestamp: new Date().toISOString(),
        validation,
        capacityAnalysis: capacityResults,
        expansionPlan: expansions,
        economics: {
            estimatedTotalCapex: totalCapex
        }
    };
}
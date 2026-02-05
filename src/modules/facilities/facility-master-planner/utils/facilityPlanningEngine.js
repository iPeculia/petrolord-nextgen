import { PLANNING_CONFIG } from './planningEngineConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom Error class for Planning Engine
 */
export class PlanningEngineError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PlanningEngineError';
    this.code = code;
    this.details = details;
  }
}

// Simple in-memory cache for expensive calculations
const memoizationCache = new Map();

/**
 * Facility Planning Engine
 * Core logic for facility master planning calculations.
 */
const FacilityPlanningEngine = {

  /**
   * Clears the internal memoization cache.
   */
  clearCache: () => {
    memoizationCache.clear();
  },

  /**
   * Generates a cache key based on function name and arguments.
   */
  _generateCacheKey: (fnName, args) => {
    return `${fnName}_${JSON.stringify(args)}`;
  },

  /**
   * Calculates CAPEX estimation based on facility type and capacity.
   * Uses the exponent method: Cost = BaseCost * (Capacity / BaseCapacity)^Exponent
   */
  calculateCAPEX: (type, capacity) => {
    const cacheKey = FacilityPlanningEngine._generateCacheKey('calculateCAPEX', { type, capacity });
    if (memoizationCache.has(cacheKey)) return memoizationCache.get(cacheKey);

    try {
      if (!type || capacity <= 0) throw new PlanningEngineError('Invalid inputs for CAPEX calculation', 'INVALID_INPUT');

      const factors = PLANNING_CONFIG.COST_FACTORS[type] || PLANNING_CONFIG.COST_FACTORS.Onshore; // Default
      // Assume base capacity for factors is 100,000 for liquid, 100 for gas, 50 for power (arbitrary baselines for the formula)
      let baseCapacityRef = 100000;
      if (factors.capacity_unit === 'mmscfd') baseCapacityRef = 100;
      if (factors.capacity_unit === 'MW') baseCapacityRef = 50;

      const cost = factors.base * Math.pow((capacity / baseCapacityRef), factors.exponent);
      
      const result = Math.round(cost);
      memoizationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CAPEX Calculation Error:', error);
      throw error instanceof PlanningEngineError ? error : new PlanningEngineError('CAPEX Calculation Failed', 'CALC_ERROR', { originalError: error.message });
    }
  },

  /**
   * Analyzes production profile against facility capacity to identify bottlenecks and utilization.
   */
  analyzeCapacity: (productionProfile, facilityDesign) => {
    const cacheKey = FacilityPlanningEngine._generateCacheKey('analyzeCapacity', { productionProfile, facilityDesign });
    if (memoizationCache.has(cacheKey)) return memoizationCache.get(cacheKey);

    if (!productionProfile || !Array.isArray(productionProfile) || !facilityDesign) {
       return { valid: false, errors: ['Missing profile or facility data'] };
    }

    const results = productionProfile.map(yearData => {
      const oilUtil = (yearData.oil_rate_bpd / facilityDesign.design_capacity_oil_bpd);
      const gasUtil = (yearData.gas_rate_mmscfd / facilityDesign.design_capacity_gas_mmscfd);
      const waterUtil = (yearData.water_rate_bpd / facilityDesign.design_capacity_water_bpd);

      return {
        year: yearData.year,
        oil_utilization: oilUtil,
        gas_utilization: gasUtil,
        water_utilization: waterUtil,
        bottlenecks: {
          oil: oilUtil > PLANNING_CONFIG.THRESHOLDS.MAX_UTILIZATION,
          gas: gasUtil > PLANNING_CONFIG.THRESHOLDS.MAX_UTILIZATION,
          water: waterUtil > PLANNING_CONFIG.THRESHOLDS.MAX_UTILIZATION,
        },
        turndown_issues: {
           oil: oilUtil < PLANNING_CONFIG.THRESHOLDS.MIN_UTILIZATION && oilUtil > 0,
           gas: gasUtil < PLANNING_CONFIG.THRESHOLDS.MIN_UTILIZATION && gasUtil > 0
        }
      };
    });

    memoizationCache.set(cacheKey, results);
    return results;
  },

  /**
   * Calculates Net Present Value (NPV) for a given cashflow stream.
   */
  calculateNPV: (cashflows, discountRate = PLANNING_CONFIG.ECONOMICS.DISCOUNT_RATE) => {
    let npv = 0;
    cashflows.forEach((cf, index) => {
      npv += cf / Math.pow(1 + discountRate, index + 1); // Assuming Year 1 is index 0
    });
    return npv;
  },

  /**
   * Generates a Master Plan Strategy identifying required expansions.
   */
  generateExpansionPlan: (productionProfile, facilityDesign) => {
     // Simplified logic: Check for bottlenecks and propose expansion modules
     const capacityAnalysis = FacilityPlanningEngine.analyzeCapacity(productionProfile, facilityDesign);
     const expansions = [];
     
     let currentOilCap = facilityDesign.design_capacity_oil_bpd;
     let currentGasCap = facilityDesign.design_capacity_gas_mmscfd;

     capacityAnalysis.forEach(yearData => {
         if (yearData.bottlenecks.oil) {
             const required = productionProfile.find(p => p.year === yearData.year).oil_rate_bpd;
             if (required > currentOilCap) {
                 const shortfall = required - currentOilCap;
                 // Propose expansion block (e.g., 25k bpd increments)
                 const expansionSize = Math.ceil(shortfall / 25000) * 25000;
                 
                 // Check if we already planned an expansion for this year (simplified)
                 const existing = expansions.find(e => e.year === yearData.year && e.type === 'Oil Processing');
                 if (!existing) {
                    expansions.push({
                        id: uuidv4(),
                        year: yearData.year,
                        type: 'Oil Processing',
                        capacity_addition: expansionSize,
                        estimated_capex: FacilityPlanningEngine.calculateCAPEX('Separation', expansionSize),
                        trigger: `Oil rate exceeded ${currentOilCap} bpd`
                    });
                    currentOilCap += expansionSize; // Update virtual capacity
                 }
             }
         }
         
         if (yearData.bottlenecks.gas) {
            const required = productionProfile.find(p => p.year === yearData.year).gas_rate_mmscfd;
            if (required > currentGasCap) {
                const shortfall = required - currentGasCap;
                const expansionSize = Math.ceil(shortfall / 50) * 50; // 50 mmscfd blocks

                 const existing = expansions.find(e => e.year === yearData.year && e.type === 'Gas Compression');
                 if (!existing) {
                    expansions.push({
                        id: uuidv4(),
                        year: yearData.year,
                        type: 'Gas Compression',
                        capacity_addition: expansionSize,
                        estimated_capex: FacilityPlanningEngine.calculateCAPEX('Compression', expansionSize),
                        trigger: `Gas rate exceeded ${currentGasCap} mmscfd`
                    });
                    currentGasCap += expansionSize;
                 }
            }
         }
     });

     return expansions;
  },

  /**
   * Validates a full facility scenario data set.
   */
  validateScenario: (scenarioData) => {
    const errors = [];
    const warnings = [];

    if (!scenarioData.project) errors.push("Project definition missing.");
    if (!scenarioData.facility) errors.push("Facility definition missing.");
    if (!scenarioData.productionProfile || scenarioData.productionProfile.length === 0) {
        warnings.push("No production profile provided. Planning will be limited.");
    } else {
        // Check for negative rates
        const hasNegative = scenarioData.productionProfile.some(p => p.oil_rate_bpd < 0 || p.gas_rate_mmscfd < 0);
        if (hasNegative) errors.push("Production rates cannot be negative.");
    }

    return { isValid: errors.length === 0, errors, warnings };
  },

  /**
   * Creates a new scenario object structure.
   */
  createScenario: (name, description, parameters, baseScenarioId = null) => {
    return {
      scenario_id: uuidv4(),
      name,
      description,
      is_baseline: false,
      parent_scenario_id: baseScenarioId,
      parameters: {
        discount_rate: parameters.discount_rate || 10,
        oil_price: parameters.oil_price || 60,
        gas_price: parameters.gas_price || 3,
        capex_multiplier: parameters.capex_multiplier || 1.0,
        opex_multiplier: parameters.opex_multiplier || 1.0,
        ...parameters
      },
      results: null, // To be filled after run
      status: 'Draft',
      created_at: new Date().toISOString()
    };
  },

  /**
   * Runs the Master Plan logic for a specific scenario.
   * This simulates running the full analysis engine with scenario-specific parameters.
   */
  runScenarioMasterPlan: (scenario, baseProfile, baseFacility) => {
      try {
        if (!scenario || !baseProfile || !baseFacility) {
            throw new PlanningEngineError('Missing required data for scenario run', 'MISSING_DATA');
        }

        const { oil_price, gas_price, capex_multiplier, opex_multiplier, discount_rate } = scenario.parameters;
        
        // 1. Generate Expansions based on profile (Assuming profile doesn't change per scenario in this simplified version, 
        // typically you'd also allow profile scaling)
        const expansions = FacilityPlanningEngine.generateExpansionPlan(baseProfile, baseFacility);
        
        // 2. Calculate Economics
        let totalCapex = 0;
        let cashflows = [];
        let cumulativeCashflow = 0;
        let peakOil = 0;
        let peakGas = 0;

        // Initial Facility Cost (Sunk cost usually ignored in forward looking, but useful for full cycle economics)
        // For expansion planning, we focus on incremental.
        // Let's assume we are evaluating the *expansion* project economics + base production revenue.
        
        const years = baseProfile.map(p => p.year);
        
        years.forEach((year, idx) => {
            const profile = baseProfile[idx];
            
            // Revenue
            const oilRev = profile.oil_rate_bpd * 365 * oil_price; 
            const gasRev = profile.gas_rate_mmscfd * 1000 * 365 * gas_price; // $/mcf approx
            const revenue = (oilRev + gasRev) / 1000000; // $M

            // Costs
            const yearExpansions = expansions.filter(e => e.year === year);
            const expansionCapex = yearExpansions.reduce((acc, e) => acc + e.estimated_capex, 0) / 1000000; // $M
            
            const adjustedCapex = expansionCapex * capex_multiplier;
            totalCapex += adjustedCapex;

            // Simplified Opex: $5/bbl equivalent
            const opex = ((profile.oil_rate_bpd + profile.gas_rate_mmscfd * 100) * 365 * 5 * opex_multiplier) / 1000000; // $M

            const netCashflow = revenue - adjustedCapex - opex;
            cashflows.push(netCashflow);
            cumulativeCashflow += netCashflow;

            if (profile.oil_rate_bpd > peakOil) peakOil = profile.oil_rate_bpd;
            if (profile.gas_rate_mmscfd > peakGas) peakGas = profile.gas_rate_mmscfd;
        });

        const npv = FacilityPlanningEngine.calculateNPV(cashflows, discount_rate / 100);
        
        // Simple IRR approx (very rough) - usually requires Newton-Raphson
        // We'll mock a realistic value based on NPV sign for this simulation
        const irr = npv > 0 ? (15 + (npv / totalCapex) * 5) : (5 - (Math.abs(npv) / totalCapex) * 2);

        // Break Even (Mock calc)
        const breakEven = (totalCapex * 1000000 + (baseProfile.reduce((acc, p) => acc + p.oil_rate_bpd, 0) * 365 * 5)) / (baseProfile.reduce((acc, p) => acc + p.oil_rate_bpd, 0) * 365);

        return {
            ...scenario,
            status: 'Completed',
            results: {
                npv: Math.round(npv),
                irr: Math.round(irr * 10) / 10,
                total_capex: Math.round(totalCapex),
                peak_oil_rate: Math.round(peakOil),
                peak_gas_rate: Math.round(peakGas),
                break_even_oil_price: Math.round(breakEven * 100) / 100,
                expansion_count: expansions.length,
                cashflows: cashflows
            },
            last_run: new Date().toISOString()
        };

      } catch (error) {
          console.error("Scenario Run Failed", error);
          throw new PlanningEngineError('Scenario execution failed', 'EXECUTION_ERROR', { internal: error.message });
      }
  },

  /**
   * Sorts scenarios by a specific metric.
   */
  rankScenarios: (scenarios, metric = 'npv', direction = 'desc') => {
      return [...scenarios].sort((a, b) => {
          const valA = a.results ? a.results[metric] : -Infinity;
          const valB = b.results ? b.results[metric] : -Infinity;
          
          if (direction === 'asc') return valA - valB;
          return valB - valA;
      });
  }
};

export default FacilityPlanningEngine;
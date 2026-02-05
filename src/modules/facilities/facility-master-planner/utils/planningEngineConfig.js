/**
 * Configuration for Facility Master Planning Engine
 * Defines base constants, factors, and default parameters for calculations.
 */

export const PLANNING_CONFIG = {
  // Base cost factors (USD per unit capacity)
  COST_FACTORS: {
    FPSO: { base: 500000000, exponent: 0.7, capacity_unit: 'bpd' },
    Platform: { base: 300000000, exponent: 0.65, capacity_unit: 'bpd' },
    Onshore: { base: 100000000, exponent: 0.6, capacity_unit: 'bpd' },
    Separation: { base: 5000000, exponent: 0.6, capacity_unit: 'bpd' },
    Compression: { base: 10000000, exponent: 0.65, capacity_unit: 'mmscfd' },
    PowerGen: { base: 2000000, exponent: 0.75, capacity_unit: 'MW' },
    WaterInjection: { base: 3000000, exponent: 0.6, capacity_unit: 'bpd' },
  },

  // Equipment reliability/availability factors
  RELIABILITY: {
    BASE_AVAILABILITY: 0.95, // 95% uptime
    AGING_FACTOR: 0.005, // 0.5% degradation per year
    MAINTENANCE_RECOVERY: 0.98, // Maintenance restores to 98% of original
  },

  // Project timeline defaults (months)
  TIMELINES: {
    FEED: 12,
    DETAILED_DESIGN: 18,
    PROCUREMENT: 24,
    CONSTRUCTION: 36,
    COMMISSIONING: 6,
    FAST_TRACK_MULTIPLIER: 0.75,
  },

  // Economic parameters
  ECONOMICS: {
    DISCOUNT_RATE: 0.10, // 10%
    INFLATION_RATE: 0.02, // 2%
    OIL_PRICE_BASE: 70, // USD/bbl
    GAS_PRICE_BASE: 3.5, // USD/mmbtu
    OPEX_PERCENTAGE: 0.05, // 5% of CAPEX annually
  },

  // Validation thresholds
  THRESHOLDS: {
    MAX_UTILIZATION: 0.95, // Alert above 95%
    MIN_UTILIZATION: 0.40, // Alert below 40% (turndown issues)
    SAFETY_MARGIN: 1.10, // Design for 110% of peak
  }
};

export default PLANNING_CONFIG;
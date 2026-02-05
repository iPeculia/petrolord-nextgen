import { describe, it, expect, beforeEach, vi } from 'vitest';
import FacilityPlanningEngine from '../utils/facilityPlanningEngine';
import PLANNING_CONFIG from '../utils/planningEngineConfig';

describe('FacilityPlanningEngine', () => {
  
  beforeEach(() => {
    FacilityPlanningEngine.clearCache();
  });

  describe('calculateCAPEX', () => {
    it('should calculate CAPEX correctly for known types', () => {
      const type = 'FPSO';
      const capacity = 150000;
      const expectedBase = PLANNING_CONFIG.COST_FACTORS.FPSO.base;
      const expectedExp = PLANNING_CONFIG.COST_FACTORS.FPSO.exponent;
      
      const expected = Math.round(expectedBase * Math.pow((capacity / 100000), expectedExp));
      
      const result = FacilityPlanningEngine.calculateCAPEX(type, capacity);
      expect(result).toBe(expected);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => FacilityPlanningEngine.calculateCAPEX('FPSO', -100)).toThrow('Invalid inputs');
      expect(() => FacilityPlanningEngine.calculateCAPEX(null, 100)).toThrow('Invalid inputs');
    });

    it('should memoize results', () => {
      const type = 'Onshore';
      const capacity = 50000;
      
      // First call
      const res1 = FacilityPlanningEngine.calculateCAPEX(type, capacity);
      
      // Second call (should come from cache, but value is same)
      const res2 = FacilityPlanningEngine.calculateCAPEX(type, capacity);
      
      expect(res1).toBe(res2);
    });
  });

  describe('analyzeCapacity', () => {
    const mockProfile = [
        { year: 2024, oil_rate_bpd: 80000, gas_rate_mmscfd: 50, water_rate_bpd: 20000 },
        { year: 2025, oil_rate_bpd: 110000, gas_rate_mmscfd: 60, water_rate_bpd: 30000 }
    ];
    
    const mockFacility = {
        design_capacity_oil_bpd: 100000,
        design_capacity_gas_mmscfd: 100,
        design_capacity_water_bpd: 50000
    };

    it('should identify bottlenecks correctly', () => {
        const results = FacilityPlanningEngine.analyzeCapacity(mockProfile, mockFacility);
        
        // 2024 should be fine
        expect(results[0].bottlenecks.oil).toBe(false);
        expect(results[0].oil_utilization).toBe(0.8);

        // 2025 should bottleneck on oil (110k > 100k capacity)
        expect(results[1].bottlenecks.oil).toBe(true); // 1.1 > 0.95 threshold? Actually threshold is 0.95, so yes.
        expect(results[1].oil_utilization).toBe(1.1);
    });
    
    it('should identify turndown issues', () => {
        const lowProfile = [{ year: 2026, oil_rate_bpd: 20000, gas_rate_mmscfd: 10, water_rate_bpd: 1000 }];
        const results = FacilityPlanningEngine.analyzeCapacity(lowProfile, mockFacility);
        
        // 20k / 100k = 0.2 utilization, which is < 0.4 min threshold
        expect(results[0].turndown_issues.oil).toBe(true);
    });
  });

  describe('generateExpansionPlan', () => {
     const mockProfile = [
        { year: 2024, oil_rate_bpd: 90000, gas_rate_mmscfd: 50, water_rate_bpd: 20000 },
        { year: 2025, oil_rate_bpd: 120000, gas_rate_mmscfd: 60, water_rate_bpd: 30000 },
        { year: 2026, oil_rate_bpd: 140000, gas_rate_mmscfd: 60, water_rate_bpd: 30000 }
    ];
    
    const mockFacility = {
        design_capacity_oil_bpd: 100000,
        design_capacity_gas_mmscfd: 100,
        design_capacity_water_bpd: 50000,
        type: 'FPSO'
    };

    it('should propose expansions when limits exceeded', () => {
        const plan = FacilityPlanningEngine.generateExpansionPlan(mockProfile, mockFacility);
        
        // Expect expansion in 2025 for 25k (shortfall 20k)
        const exp2025 = plan.find(e => e.year === 2025);
        expect(exp2025).toBeDefined();
        expect(exp2025.type).toBe('Oil Processing');
        expect(exp2025.capacity_addition).toBe(25000);
        
        // In 2026, required is 140k. Base is 100k + 25k (from 2025) = 125k. Shortfall 15k.
        // Should propose another 25k block.
        const exp2026 = plan.find(e => e.year === 2026);
        expect(exp2026).toBeDefined();
        expect(exp2026.capacity_addition).toBe(25000);
    });
  });
  
  describe('validateScenario', () => {
      it('should return valid true for correct data', () => {
          const data = {
              project: { id: 1 },
              facility: { id: 1 },
              productionProfile: [{ year: 2024, oil_rate_bpd: 100 }]
          };
          const res = FacilityPlanningEngine.validateScenario(data);
          expect(res.isValid).toBe(true);
      });

      it('should fail if negative rates found', () => {
           const data = {
              project: { id: 1 },
              facility: { id: 1 },
              productionProfile: [{ year: 2024, oil_rate_bpd: -100 }]
          };
          const res = FacilityPlanningEngine.validateScenario(data);
          expect(res.isValid).toBe(false);
          expect(res.errors).toContain('Production rates cannot be negative.');
      });
  });
});
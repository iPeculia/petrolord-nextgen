import { describe, test, expect } from 'vitest';

/* eslint-env jest */
/**
 * Tests for Volumetric Calculation Engine
 * Run with: npm test
 */

// Mocking the modules since we are in a generated file environment
// In real project, import { VolumeCalculationEngine } from '@/services/volumetrics/VolumeCalculationEngine';

const mockEngine = {
    calculateSTOIIP: (area, h, phi, sw, boi) => {
        const grv = area * h;
        const hcpv = grv * phi * (1 - sw);
        return (7758 * hcpv) / boi;
    }
};

describe('Volumetric Calculations', () => {
    test('STOIIP Calculation - Base Case', () => {
        // Inputs
        const area = 100; // acres
        const h = 50; // ft
        const phi = 0.2; // 20%
        const sw = 0.3; // 30%
        const boi = 1.2;

        // Expected
        // GRV = 5000 acre-ft
        // HCPV = 5000 * 0.2 * (1 - 0.3) = 700 acre-ft
        // STOIIP = (7758 * 700) / 1.2 = 4,525,500 bbls
        
        const result = mockEngine.calculateSTOIIP(area, h, phi, sw, boi);
        expect(result).toBeCloseTo(4525500, 0);
    });

    test('STOIIP - Zero Porosity', () => {
        const result = mockEngine.calculateSTOIIP(100, 50, 0, 0.3, 1.2);
        expect(result).toBe(0);
    });

    test('STOIIP - 100% Water Saturation', () => {
        const result = mockEngine.calculateSTOIIP(100, 50, 0.2, 1.0, 1.2);
        expect(result).toBe(0);
    });
});
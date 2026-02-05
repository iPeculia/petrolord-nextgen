import { describe, it, expect } from 'vitest';
import { calculateF, calculateEo } from '@/utils/materialBalance/MaterialBalanceEngine';
import { validateProductionData } from '@/utils/materialBalance/DataValidator';

describe('Material Balance Engine', () => {
    it('calculates F correctly for zero production', () => {
        const prod = { Np: 0, Gp: 0, Wp: 0, pressure: 3000 };
        const pvtOil = [{ pressure: 3000, Bo: 1.2, Rs: 500 }];
        const pvtGas = [{ pressure: 3000, Bg: 0.001 }];
        const pvtWater = [{ pressure: 3000, Bw: 1.0 }];
        
        const F = calculateF(prod, pvtOil, pvtGas, pvtWater);
        expect(F).toBe(0);
    });

    it('calculates Eo correctly', () => {
        const p = 3000;
        const pi = 4000;
        const pvtOil = [
            { pressure: 4000, Bo: 1.1, Rs: 500 },
            { pressure: 3000, Bo: 1.2, Rs: 450 }
        ];
        const pvtGas = [{ pressure: 3000, Bg: 0.002 }];
        
        const Eo = calculateEo(p, pi, pvtOil, pvtGas);
        // Eo = (Bo - Boi) + (Rsi - Rs)Bg
        // Eo = (1.2 - 1.1) + (500 - 450) * 0.002
        // Eo = 0.1 + 50 * 0.002 = 0.1 + 0.1 = 0.2
        expect(Eo).toBeCloseTo(0.2);
    });
});

describe('Data Validator', () => {
    it('validates production data correctly', () => {
        const validData = [{ date: '2021-01-01', Np: 100 }];
        const invalidData = [{ foo: 'bar' }];
        
        expect(validateProductionData(validData).isValid).toBe(true);
        expect(validateProductionData(invalidData).isValid).toBe(false);
    });
});
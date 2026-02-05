/**
 * Engine for volumetric calculations (Deterministic & Probabilistic stubs)
 */
import { UnitConverter } from './UnitConverter';

export const VolumeCalculationEngine = {
  /**
   * Calculates STOIIP using the volumetric formula:
   * STOIIP = (GRV * NTG * Phi * (1 - Sw)) / Boi
   * 
   * Units Handling (Imperial Default):
   * Area: acres
   * Thickness: ft
   * Porosity: fraction
   * Sw: fraction
   * Boi: rb/stb
   * Constant: 7758 (bbl/acre-ft)
   */
  calculateSimpleVolumetrics: (inputs) => {
    try {
      // 1. Normalize inputs to base calculation units (Imperial typically used for standard formula constants)
      // If metric, we convert to Imperial for calculation, then convert result back if needed, 
      // OR use metric constant (6.28981 for m3/m3 or similar).
      // For simplicity here, we stick to the 7758 constant standard (bbl/acre-ft).
      
      let area = parseFloat(inputs.area); // acres
      let h = parseFloat(inputs.thickness); // ft
      const phi = parseFloat(inputs.porosity);
      const sw = parseFloat(inputs.water_saturation);
      const boi = parseFloat(inputs.formation_volume_factor);
      const rf = parseFloat(inputs.recovery_factor) || 0;

      // Simple unit handling
      if (inputs.unit_system === 'Metric') {
         // Convert hectares to acres
         area = UnitConverter.convert(area, 'hectares', 'acres');
         // Convert m to ft
         h = UnitConverter.convert(h, 'm', 'ft');
      }

      // Gross Rock Volume (GRV) in acre-ft
      const grv = area * h;

      // Net Pore Volume
      const poreVolume = grv * phi;

      // Hydrocarbon Pore Volume (HCPV)
      const hcpv = poreVolume * (1 - sw);

      // STOIIP in bbls
      // 7758 is conversion factor for acre-ft to barrels
      const stoiip = (7758 * hcpv) / boi;

      // Recoverable Resources
      const recoverable = stoiip * rf;

      // Convert results if Metric requested
      let result_stoiip = stoiip;
      let result_recoverable = recoverable;
      let vol_unit = 'bbl'; // Stock Tank Barrels

      if (inputs.unit_system === 'Metric') {
          result_stoiip = UnitConverter.convert(stoiip, 'bbl', 'm3');
          result_recoverable = UnitConverter.convert(recoverable, 'bbl', 'm3');
          vol_unit = 'm³'; // Standard Cubic Meters
      } else {
          vol_unit = 'MMbbl'; // Display in millions
          result_stoiip = result_stoiip / 1000000;
          result_recoverable = result_recoverable / 1000000;
      }

      return {
        success: true,
        metrics: {
            stoiip: result_stoiip,
            recoverable: result_recoverable,
            grv: grv,
            hcpv: hcpv
        },
        units: {
            volume: vol_unit
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error("Calculation Error:", error);
      return { success: false, error: error.message };
    }
  },

  calculateEconomics: (volumetrics, econInputs) => {
      // Stub for NPV/IRR calculation
      const capex = parseFloat(econInputs.capex || 0);
      const opex = parseFloat(econInputs.opex || 0);
      const price = parseFloat(econInputs.oil_price || 50);
      
      // Very rough estimate for demo
      const grossRevenue = volumetrics.metrics.recoverable * 1000000 * price; 
      const netCashFlow = grossRevenue - capex - (opex * volumetrics.metrics.recoverable * 1000000);
      
      return {
          npv: netCashFlow * 0.8, // Dummy discount
          irr: 0.15, // Dummy 15%
          payback: 3.5 // Years
      };
  }
};
/**
 * @deprecated
 * This file is deprecated. Please use VolumeCalculationEngine.js for volumetric calculations.
 */
import { VolumeCalculationEngine } from './VolumeCalculationEngine';

export const calculationService = {
  calculateVolumetrics: async (data, method) => {
    console.warn("Using deprecated calculationService. Please migrate to VolumeCalculationEngine.");
    return VolumeCalculationEngine.calculateSimpleVolumetrics(data);
  }
};
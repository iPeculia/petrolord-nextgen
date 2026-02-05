# Material Balance Pressure Data Model

This document outlines the comprehensive pressure data structures implemented for the Material Balance module.

## 1. Reservoir Parameters
Enhanced `parameters` object in `reservoirs.js`:
*   `initialPressure`: Original reservoir pressure (psia)
*   `currentPressure`: Most recent gauge pressure (psia)
*   `bubblePointPressure`: Fluid saturation pressure (psia)
*   `pressureGradient`: Vertical pressure gradient (psi/ft)
*   `pressureDatumDepth`: Reference depth for pressure measurements (ft TVD)
*   `pressureAtDatum`: Pressure normalized to datum depth (psia)
*   `pressureDeclineRate`: Average decline rate (psi/month)

## 2. Pressure History (`pressureHistory.js`)
Monthly historical pressure records for analysis:
*   `date`: Measurement date (YYYY-MM-DD)
*   `averagePressure`: Reservoir average pressure (psia)
*   `minPressure` / `maxPressure`: Statistical range for uncertainty analysis
*   `pressureChange`: Delta from previous month
*   `cumulativeDecline`: Total pressure drop since initial conditions
*   `aquiferInflux`: Estimated influx rate based on pressure support

## 3. Pressure Dependent Properties (`pressureDependentProperties.js`)
Fluid properties correlated against pressure steps:
*   `pressure`: Pressure step (psia)
*   `Bo`: Oil Formation Volume Factor (rb/stb)
*   `Rs`: Solution Gas Ratio (scf/stb)
*   `uo`: Oil Viscosity (cp)
*   `Bg`: Gas Formation Volume Factor (rb/scf)
*   `co`: Oil Compressibility (1/psi)
*   `cw`: Water Compressibility (1/psi)
*   `cf`: Pore Volume Compressibility (1/psi)
*   `phase`: 'Single-Phase' or 'Two-Phase' indicator

## 4. Pressure-Saturation (`pressureSaturationData.js`)
Saturation changes modeled against pressure depletion:
*   `pressure`: Pressure step (psia)
*   `Sw`: Water Saturation (fraction)
*   `So`: Oil Saturation (fraction)
*   `Sg`: Gas Saturation (fraction)
*   `krw` / `kro`: Relative permeability values at current saturation state

## Integration
All pressure data is loaded via `loadMaterialBalanceSampleData` in `src/utils/materialBalanceDataLoader.js` and exposed via the `useMaterialBalance` hook.
/**
 * Petrophysical Calculations Engine
 * 
 * This utility provides a set of functions for industry-standard petrophysical calculations.
 * Each function includes input validation and returns null if inputs are invalid or missing.
 */

const validateInputs = (inputs) => {
    for (const input of inputs) {
        if (input === null || input === undefined || isNaN(parseFloat(input))) {
            return false;
        }
    }
    return true;
};

/**
 * Calculates Total Porosity (PHIt) from a density log.
 * Formula: PHIt = (rho_matrix - rho_bulk) / (rho_matrix - rho_fluid)
 * @param {number} rhoMatrix - Matrix density (e.g., 2.65 g/cm³ for sandstone).
 * @param {number} rhoBulk - Bulk density from log (g/cm³).
 * @param {number} rhoFluid - Fluid density (e.g., 1.0 g/cm³ for water).
 * @returns {number|null} Total porosity as a fraction, or null if inputs are invalid.
 */
export const calculatePorosityFromDensity = (rhoMatrix, rhoBulk, rhoFluid) => {
    if (!validateInputs([rhoMatrix, rhoBulk, rhoFluid])) return null;

    const rhoM = parseFloat(rhoMatrix);
    const rhoB = parseFloat(rhoBulk);
    const rhoF = parseFloat(rhoFluid);

    if (rhoM - rhoF === 0) return null; // Avoid division by zero

    const porosity = (rhoM - rhoB) / (rhoM - rhoF);
    
    // Return null if porosity is not physically possible
    return (porosity >= 0 && porosity <= 1) ? porosity : null;
};


/**
 * Calculates Volume of Clay (Vcl) from a gamma-ray log.
 * Formula: Vcl = (GR_log - GR_min) / (GR_max - GR_min)
 * @param {number} grLog - Gamma Ray log reading (API).
 * @param {number} grMin - Gamma Ray reading in clean sand (API).
 * @param {number} grMax - Gamma Ray reading in shale (API).
 * @returns {number|null} Volume of clay as a fraction, or null if inputs are invalid.
 */
export const calculateVclFromGammaRay = (grLog, grMin, grMax) => {
    if (!validateInputs([grLog, grMin, grMax])) return null;

    const grL = parseFloat(grLog);
    const grN = parseFloat(grMin);
    const grX = parseFloat(grMax);

    if (grX - grN === 0) return null;

    let vcl = (grL - grN) / (grX - grN);

    // Clamp the value between 0 and 1
    vcl = Math.max(0, Math.min(1, vcl));

    return vcl;
};


/**
 * Calculates Water Saturation (Sw) using Archie's equation.
 * Formula: Sw = ((a * Rw) / (PHIt^m * Rt))^(1/n)
 * @param {number} porosity - Total porosity (PHIt) as a fraction.
 * @param {number} rt - True resistivity from deep log (ohm.m).
 * @param {number} rw - Formation water resistivity (ohm.m).
 * @param {number} a - Tortuosity factor (typically ~1).
 * @param {number} m - Cementation exponent (typically ~2).
 * @param {number} n - Saturation exponent (typically ~2).
 * @returns {number|null} Water saturation as a fraction, or null if inputs are invalid.
 */
export const calculateWaterSaturationArchie = (porosity, rt, rw, a, m, n) => {
    if (!validateInputs([porosity, rt, rw, a, m, n])) return null;
    
    const phi = parseFloat(porosity);
    const pRt = parseFloat(rt);
    const pRw = parseFloat(rw);
    const pA = parseFloat(a);
    const pM = parseFloat(m);
    const pN = parseFloat(n);
    
    if (phi <= 0 || pRt <= 0 || pRw <= 0 || pN === 0) return null;

    const numerator = pA * pRw;
    const denominator = Math.pow(phi, pM) * pRt;

    if (denominator === 0) return null;

    const sw = Math.pow(numerator / denominator, 1 / pN);
    
    // Clamp the value between 0 and 1
    return Math.max(0, Math.min(1, sw));
};

/**
 * Calculates API gravity from Specific Gravity (SG).
 * Formula: API = (141.5 / SG) - 131.5
 * @param {number} sg - Specific Gravity of the fluid.
 * @returns {number|null} API gravity, or null if input is invalid.
 */
export const calculateAPIGravity = (sg) => {
    if (!validateInputs([sg])) return null;
    const pSg = parseFloat(sg);
    if (pSg <= 0) return null;

    return (141.5 / pSg) - 131.5;
};

/**
 * Calculates Hydrocarbon Saturation (Sh).
 * Formula: Sh = 1 - Sw
 * @param {number} sw - Water Saturation as a fraction.
 * @returns {number|null} Hydrocarbon Saturation as a fraction, or null.
 */
export const calculateHydrocarbonSaturation = (sw) => {
    if (!validateInputs([sw])) return null;
    const pSw = parseFloat(sw);
    if (pSw < 0 || pSw > 1) return null;

    return 1 - pSw;
};
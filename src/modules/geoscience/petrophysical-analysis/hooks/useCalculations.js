import { useEffect, useRef } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';

export const useCalculations = () => {
    const { activeWell, wellLogs } = useGlobalDataStore();
    const { localChanges, updateLocalChanges } = usePetrophysicalStore();
    const processingRef = useRef(false);

    // Inputs
    const parameters = localChanges.parameters || {};
    const logs = wellLogs[activeWell] || {};

    useEffect(() => {
        if (!activeWell || processingRef.current || Object.keys(logs).length === 0) return;

        const performCalculations = async () => {
            processingRef.current = true;

            // 1. Identify necessary logs
            // We use simple heuristic matching. In real app, use alias mapping.
            const findLog = (keywords) => {
                const key = Object.keys(logs).find(k => keywords.some(kw => k.toUpperCase().includes(kw)));
                return key ? logs[key] : null;
            };

            const grLog = findLog(['GR', 'GAMMA']);
            const rhoLog = findLog(['RHOB', 'DENS', 'DEN']);
            const nphiLog = findLog(['NPHI', 'NEUT']);
            const rtLog = findLog(['RT', 'RES', 'RD']);

            const calculated = {};

            // Need a master depth array to iterate
            const masterLog = grLog || rhoLog || nphiLog || rtLog;
            if (!masterLog) {
                processingRef.current = false;
                return;
            }

            const depth = masterLog.depth_array;
            const count = depth.length;

            // Parameters
            const grClean = parseFloat(parameters.grClean) || 20;
            const grClay = parseFloat(parameters.grClay) || 120;
            const rhoMatrix = parseFloat(parameters.matrixDensity) || 2.65;
            const rhoFluid = parseFloat(parameters.fluidDensity) || 1.0; // Water/Mud
            const a = parseFloat(parameters.archieA) || 1;
            const m = parseFloat(parameters.archieM) || 2;
            const n = parseFloat(parameters.archieN) || 2;
            const rw = parseFloat(parameters.rw) || 0.1;

            // Arrays for results
            const vshArray = new Array(count).fill(null);
            const phiArray = new Array(count).fill(null);
            const swArray = new Array(count).fill(null);

            for (let i = 0; i < count; i++) {
                // --- VSH (Volume of Shale) ---
                // Linear GR Index: Igr = (GR - GRclean) / (GRclay - GRclean)
                let vsh = 0;
                if (grLog && grLog.value_array[i] != null) {
                    const gr = grLog.value_array[i];
                    const igr = (gr - grClean) / (grClay - grClean);
                    vsh = Math.max(0, Math.min(1, igr)); // Clamp 0-1
                }
                vshArray[i] = vsh;

                // --- PHI (Porosity) ---
                // Density Porosity: PhiD = (rhoMatrix - rhoLog) / (rhoMatrix - rhoFluid)
                let phi = 0;
                if (rhoLog && rhoLog.value_array[i] != null) {
                    const rho = rhoLog.value_array[i];
                    // Sanity check for rho to avoid division by zero or invalid physical values
                    if (rho > 0 && rho < 4) {
                        phi = (rhoMatrix - rho) / (rhoMatrix - rhoFluid);
                    }
                } else if (nphiLog && nphiLog.value_array[i] != null) {
                    // Fallback to Neutron only if Density missing (simplified)
                    phi = nphiLog.value_array[i]; // Assuming NPHI is decimal v/v
                    // Adjust if NPHI is percent (0-100)
                    if (phi > 1) phi = phi / 100;
                }
                
                // Shale correction for porosity could be added here: Phi_eff = Phi_total - Vsh * Phi_shale
                // Keeping it simple: basic density porosity.
                phi = Math.max(0.001, Math.min(1, phi)); // Clamp, avoid 0 for Archie
                phiArray[i] = phi;

                // --- Sw (Water Saturation) ---
                // Archie: Sw = ( (a * Rw) / (Phi^m * Rt) ) ^ (1/n)
                let sw = 1;
                if (rtLog && rtLog.value_array[i] != null) {
                    const rt = rtLog.value_array[i];
                    if (rt > 0) {
                        const numerator = a * rw;
                        const denominator = Math.pow(phi, m) * rt;
                        if (denominator > 0) {
                            const swSquared = numerator / denominator;
                            sw = Math.pow(swSquared, 1/n);
                        }
                    }
                }
                sw = Math.max(0, Math.min(1, sw)); // Clamp
                swArray[i] = sw;
            }

            // Update State
            calculated.VSH = { depth, values: vshArray, unit: 'v/v' };
            calculated.PHI = { depth, values: phiArray, unit: 'v/v' };
            calculated.SW = { depth, values: swArray, unit: 'v/v' };

            // Only update if different to avoid loop? 
            // useCalculations runs on parameter change.
            // We assume updateLocalChanges handles merging.
            
            updateLocalChanges({
                calculations: calculated
            });

            processingRef.current = false;
        };

        // Debounce slightly
        const timer = setTimeout(performCalculations, 500);
        return () => clearTimeout(timer);

    }, [parameters, logs, activeWell, updateLocalChanges]);
};
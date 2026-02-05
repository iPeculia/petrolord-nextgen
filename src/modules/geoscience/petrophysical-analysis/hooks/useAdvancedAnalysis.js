import { useEffect, useRef } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { 
    identifyLithology, 
    calculateOverburdenStress, 
    calculatePorePressure, 
    calculateReservoirQuality 
} from '../utils/advancedCalculations';

export const useAdvancedAnalysis = () => {
    const { activeWell, wellLogs } = useGlobalDataStore();
    const { localChanges, updateLocalChanges } = usePetrophysicalStore();
    const processingRef = useRef(false);

    // Get Basic Calculations first (PHI, VSH, SW)
    const basicCalcs = localChanges.calculations || {};
    const logs = wellLogs[activeWell] || {};

    useEffect(() => {
        if (!activeWell || processingRef.current || !basicCalcs.PHI) return;

        const performAdvancedAnalysis = async () => {
            processingRef.current = true;
            
            const depth = basicCalcs.PHI.depth;
            if (!depth) {
                processingRef.current = false;
                return;
            }

            // Inputs
            const phi = basicCalcs.PHI.values;
            const vsh = basicCalcs.VSH.values;
            const sw = basicCalcs.SW.values;
            
            // Find raw logs for Lithology
            const findLog = (keywords) => {
                const key = Object.keys(logs).find(k => keywords.some(kw => k.toUpperCase().includes(kw)));
                return key ? logs[key].value_array : null;
            };
            
            const grVals = findLog(['GR', 'GAMMA']);
            const rhoVals = findLog(['RHOB', 'DENS', 'DEN']);
            const nphiVals = findLog(['NPHI', 'NEUT']);
            const dtVals = findLog(['DT', 'SONIC', 'AC']);

            const count = depth.length;
            const lithology = new Array(count).fill(null);
            const reservoirQuality = new Array(count).fill(0);
            
            for(let i=0; i<count; i++) {
                // Lithology
                lithology[i] = identifyLithology(
                    grVals ? grVals[i] : null,
                    rhoVals ? rhoVals[i] : null,
                    nphiVals ? nphiVals[i] : null,
                    dtVals ? dtVals[i] : null
                );
                
                // Reservoir Quality
                reservoirQuality[i] = calculateReservoirQuality(
                    phi[i], vsh[i], sw[i]
                );
            }
            
            // Geomechanics & Pressure
            const overburden = calculateOverburdenStress(depth, rhoVals);
            const porePressure = calculatePorePressure(depth, dtVals);

            // Update Store with Advanced Results
            updateLocalChanges({
                calculations: {
                    ...basicCalcs,
                    LITHOLOGY: { depth, values: lithology, unit: 'class' },
                    RES_QUALITY: { depth, values: reservoirQuality, unit: 'score' },
                    OVERBURDEN: { depth, values: overburden, unit: 'psi' },
                    PORE_PRESSURE: { depth, values: porePressure, unit: 'psi' }
                }
            });

            processingRef.current = false;
        };

        const timer = setTimeout(performAdvancedAnalysis, 1000); // Run after basic calcs stabilize
        return () => clearTimeout(timer);

    }, [basicCalcs, logs, activeWell, updateLocalChanges]);
};
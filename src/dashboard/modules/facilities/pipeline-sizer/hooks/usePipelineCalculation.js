import { useState, useCallback } from 'react';
import { PIPE_SCHEDULES, ROUGHNESS_VALUES, MATERIAL_LIMITS } from '../utils/constants';

export const usePipelineCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);
  const [sensitivityResults, setSensitivityResults] = useState(null);

  const calculateHydraulics = useCallback((props) => {
    const { fluidProps, flowRate, flowUnit, segments, designParams, constraints, selectedSize } = props;
    
    const density = fluidProps.density;
    const viscosity = fluidProps.viscosity;
    const pipeSchedule = PIPE_SCHEDULES[designParams.schedule] || PIPE_SCHEDULES['40'];
    const matLimits = MATERIAL_LIMITS[designParams.material] || MATERIAL_LIMITS['CS'];

    // If selectedSize provided, only calc that one, else calc all
    const sizesToCalc = selectedSize 
      ? { [selectedSize]: pipeSchedule[selectedSize] } 
      : pipeSchedule;

    const calculatedResults = [];

    Object.entries(sizesToCalc).forEach(([nps, idInches]) => {
      if(!idInches) return;
      const idFeet = idInches / 12;
      const areaSqFt = (Math.PI * Math.pow(idFeet, 2)) / 4;
      
      // Flow conversion
      let flowCfs = flowRate;
      if (flowUnit === 'bpd') flowCfs = flowRate * 0.000065;
      else if (flowUnit === 'm3d') flowCfs = flowRate * 0.000409;
      else if (flowUnit === 'mmscfd') flowCfs = (flowRate * 1000000) / 86400 / 379.5; // Rough gas approx

      const velocity = flowCfs / areaSqFt;
      
      // Reynolds
      const reynolds = (92.1 * density * velocity * idInches) / viscosity;
      
      // Friction (Swamee-Jain)
      const roughness = ROUGHNESS_VALUES[segments[0]?.roughness || 'new_steel'] / 12;
      const epsilon = roughness / idFeet;
      let f = 0.02;
      if (reynolds > 2300) {
        f = 0.25 / Math.pow(Math.log10(epsilon/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
      } else {
        f = 64 / (reynolds || 1);
      }

      let totalPressureDrop = 0;
      let totalLength = 0;
      let totalElevation = 0;

      segments.forEach(seg => {
        const segLen = seg.length || 0;
        const segElev = seg.elevation || 0;
        
        // Simplified equivalent length for fittings
        const fitLen = (seg.fittings?.elbow90 || 0) * 30 * idFeet; 
        
        const g = 32.174;
        const headLoss = f * ((segLen + fitLen) / idFeet) * (Math.pow(velocity, 2) / (2 * g));
        const frictionDrop = (headLoss * density) / 144;
        const elevDrop = (density * segElev) / 144;

        totalPressureDrop += frictionDrop;
        totalElevation += segElev;
        totalLength += segLen;
      });

      const totalDrop = totalPressureDrop + (density * totalElevation / 144);
      const arrivalPressure = designParams.startPressure - totalDrop;

      // Integrity Checks
      const erosionalVelocity = (100 * matLimits.erosionLimit) / Math.sqrt(density);
      const erosionRatio = velocity / erosionalVelocity;
      
      // Power (Hydraulic HP)
      const hhp = (flowRate * totalDrop) / 1714; // for BPD and PSI
      const kw = hhp * 0.746;

      let status = 'pass';
      const flags = [];
      if (velocity > constraints.maxVelocity) { status = 'fail'; flags.push('Max Vel'); }
      if (velocity < constraints.minVelocity) { status = 'warning'; flags.push('Min Vel'); }
      if (arrivalPressure < constraints.minArrivalPressure) { status = 'fail'; flags.push('Low P_arr'); }
      if (erosionRatio > constraints.erosionalVelocityRatio) { status = 'warning'; flags.push('Erosion'); }
      if (totalDrop > constraints.maxPressureDrop) { status = 'warning'; flags.push('High dP'); }

      calculatedResults.push({
        nps,
        idInches,
        velocity: parseFloat(velocity.toFixed(2)),
        reynolds: parseInt(reynolds),
        frictionFactor: parseFloat(f.toFixed(4)),
        totalDrop: parseFloat(totalDrop.toFixed(1)),
        arrivalPressure: parseFloat(arrivalPressure.toFixed(1)),
        erosionRatio: parseFloat(erosionRatio.toFixed(2)),
        erosionalVelocity: parseFloat(erosionalVelocity.toFixed(2)),
        powerKW: parseFloat(kw.toFixed(1)),
        status,
        flags
      });
    });

    return calculatedResults;
  }, []);

  const runFullAnalysis = async (inputs) => {
    setIsCalculating(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const hydraulicResults = calculateHydraulics(inputs);
        setResults(hydraulicResults);
        setIsCalculating(false);
        resolve(hydraulicResults);
      }, 800);
    });
  };

  const runSensitivity = async (inputs, variable, rangeMin, rangeMax, steps = 10) => {
    setIsCalculating(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const stepSize = (rangeMax - rangeMin) / steps;
        const sensData = [];
        
        for(let i=0; i <= steps; i++) {
            const val = rangeMin + (i * stepSize);
            const modifiedInputs = { ...inputs };
            
            // Apply variation
            if (variable === 'flowRate') modifiedInputs.flowRate = val;
            if (variable === 'temperature') modifiedInputs.fluidProps = { ...inputs.fluidProps, viscosity: inputs.fluidProps.viscosity * (1 + (inputs.designParams.startTemp - val)/100) }; // Mock viscosity temp dependence
            
            // For sensitivity we typically track one selected size
            // Defaulting to 8" if none selected or the first passing one
            const res = calculateHydraulics({ ...modifiedInputs, selectedSize: inputs.selectedSize || '8' });
            if (res.length > 0) {
                sensData.push({
                    x: val,
                    pressureDrop: res[0].totalDrop,
                    velocity: res[0].velocity,
                    power: res[0].powerKW
                });
            }
        }
        setSensitivityResults(sensData);
        setIsCalculating(false);
        resolve(sensData);
      }, 1000);
    });
  };

  return { 
    calculateHydraulics, 
    runFullAnalysis, 
    runSensitivity,
    isCalculating, 
    results,
    sensitivityResults
  };
};
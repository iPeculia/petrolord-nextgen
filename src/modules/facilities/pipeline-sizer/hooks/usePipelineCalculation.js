import { useState } from 'react';
import { DEFAULT_FLUID_PROPS, PIPE_SCHEDULES, ROUGHNESS_VALUES, FITTING_EQUIV_LENGTH } from '../utils/constants';

export const usePipelineCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);

  const calculate = async ({ fluidProps, flowRate, flowUnit, segments, designParams, constraints }) => {
    setIsCalculating(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const calculatedResults = [];
        const density = fluidProps.density; // lb/ft3
        const viscosity = fluidProps.viscosity; // cP
        const pipeSchedule = PIPE_SCHEDULES[designParams.schedule] || PIPE_SCHEDULES['40'];

        Object.entries(pipeSchedule).forEach(([nps, idInches]) => {
          const idFeet = idInches / 12;
          const areaSqFt = (Math.PI * Math.pow(idFeet, 2)) / 4;
          
          let flowCfs = 0;
          if (flowUnit === 'bpd') flowCfs = flowRate * 0.000065;
          else if (flowUnit === 'm3d') flowCfs = flowRate * 0.000409; 
          else flowCfs = flowRate; 

          const velocity = flowCfs / areaSqFt; 
          
          // Reynolds Number (Simplified Field Unit Formula)
          const reynolds = (92.1 * density * velocity * idInches) / viscosity;
          
          // Friction Factor (Swamee-Jain)
          const roughness = ROUGHNESS_VALUES[segments[0]?.roughness || 'new_steel'] / 12; 
          const epsilon = roughness / idFeet;
          let f = 0.02; 
          if (reynolds > 2300) {
              f = 0.25 / Math.pow(Math.log10(epsilon/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
          } else {
              f = 64 / (reynolds || 1);
          }

          let totalPressureDrop = 0;
          let totalElevationDrop = 0;
          let totalEquivalentLength = 0;

          segments.forEach(seg => {
              const fitLen = 
                  (seg.fittings.elbow90 * FITTING_EQUIV_LENGTH.elbow90 * idFeet) +
                  (seg.fittings.elbow45 * FITTING_EQUIV_LENGTH.elbow45 * idFeet) +
                  (seg.fittings.tee * FITTING_EQUIV_LENGTH.tee * idFeet) +
                  (seg.fittings.valve * FITTING_EQUIV_LENGTH.valve * idFeet);
              
              totalEquivalentLength += seg.length + fitLen;

              const g = 32.174;
              const headLoss = f * ((seg.length + fitLen) / idFeet) * (Math.pow(velocity, 2) / (2 * g));
              const frictionDrop = (headLoss * density) / 144; 

              const elevDrop = (density * seg.elevation) / 144; 

              totalPressureDrop += frictionDrop;
              totalElevationDrop += elevDrop;
          });

          const totalDrop = totalPressureDrop + totalElevationDrop;
          const arrivalPressure = designParams.startPressure - totalDrop;

          const erosionalVelocity = 100 / Math.sqrt(density);
          const erosionRatio = velocity / erosionalVelocity;

          let status = 'pass';
          const flags = [];
          if (velocity > constraints.maxVelocity) { status = 'fail'; flags.push('Max Velocity Exceeded'); }
          if (velocity < constraints.minVelocity) { status = 'warning'; flags.push('Low Velocity / Solids Risk'); }
          if (arrivalPressure < 0) { status = 'fail'; flags.push('Negative Arrival Pressure'); }
          if (erosionRatio > constraints.erosionalVelocityRatio) { status = 'warning'; flags.push('Erosion Risk'); }
          if (totalDrop > constraints.maxPressureDrop) { status = 'warning'; flags.push('High Pressure Drop'); }

          calculatedResults.push({
              nps,
              idInches,
              velocity: velocity.toFixed(2),
              reynolds: reynolds.toFixed(0),
              frictionFactor: f.toFixed(4),
              totalDrop: totalDrop.toFixed(1),
              arrivalPressure: arrivalPressure.toFixed(1),
              erosionRatio: erosionRatio.toFixed(2),
              status,
              flags
          });
        });

        setResults(calculatedResults);
        setIsCalculating(false);
        resolve(calculatedResults);
      }, 1200);
    });
  };

  return { calculate, isCalculating, results };
};
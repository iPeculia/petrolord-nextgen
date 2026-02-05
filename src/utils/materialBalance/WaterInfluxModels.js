/**
 * Aquifer Water Influx Models
 */

// 1. Constant Influx (Steady State)
export const constantInfluxModel = (timeSteps, pressures, params) => {
  const { influxRate, initialPressure } = params;
  return timeSteps.map((t, i) => {
    const deltaP = initialPressure - pressures[i];
    const We = influxRate * t * (deltaP > 0 ? deltaP : 0); // Simplified approximation
    return { t, We, dWe_dt: influxRate * deltaP };
  });
};

// 2. Schilthuis (Steady State)
export const schilthuisModel = (timeSteps, pressures, params) => {
  const { C, initialPressure } = params; // C is aquifer constant
  let cumulativeWe = 0;
  
  return timeSteps.map((t, i) => {
    const p = pressures[i];
    const deltaP = initialPressure - p;
    const dWe = C * deltaP * (i > 0 ? t - timeSteps[i-1] : t);
    cumulativeWe += dWe;
    return { t, We: cumulativeWe, dWe_dt: C * deltaP };
  });
};

// 3. Van Everdingen-Hurst (Unsteady State) - Simplified
export const vehModel = (timeSteps, pressures, params) => {
  const { U, tD_factor, re_rw_ratio } = params; 
  // U: Aquifer constant (bbl/psi)
  // Real implementation requires solving dimensionless water influx Q(tD)
  // Using simplified polynomial approximation for Q(tD) here
  
  return timeSteps.map((t, i) => {
    const tD = t * tD_factor;
    const QtD = (1.12838 * Math.sqrt(tD)) + (1.19328 * tD) + (0.269872 * tD * Math.sqrt(tD)); // Infinite aquifer approx
    const p = pressures[i];
    const deltaP = params.initialPressure - p;
    const We = U * deltaP * QtD;
    
    return { t, We, dWe_dt: 0 }; // Rate needs numerical differentiation
  });
};

// 4. Fetkovich (Pseudo-Steady State)
export const fetkovichModel = (timeSteps, pressures, params) => {
  const { Wei, J, initialPressure } = params;
  // Wei: Max encrouchable water
  // J: Productivity index
  
  let cumulativeWe = 0;
  let prevP = initialPressure;
  
  return timeSteps.map((t, i) => {
    const p = pressures[i];
    const dt = i > 0 ? t - timeSteps[i-1] : t;
    const p_avg = (prevP + p) / 2;
    
    // dWe = Wei/Pi * (Pi - p) * (1 - exp(-J*Pi*dt/Wei)) -- Conceptual form
    // Using standard iteration:
    const deltaWe = (Wei / initialPressure) * (prevP - p) * (1 - Math.exp((-J * initialPressure * dt) / Wei));
    
    cumulativeWe += deltaWe || 0;
    prevP = p;
    
    return { t, We: cumulativeWe, dWe_dt: deltaWe/dt };
  });
};
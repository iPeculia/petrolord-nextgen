/**
 * Water Influx Calculation Service
 * Supports Schilthuis, Fetkovich, and VEH models.
 */

export const calculateWaterInflux = (modelType, pressureData, params, initialPressure) => {
    let cumulativeWe = 0;
    
    // Sort pressure data chronologically
    const sortedData = [...pressureData].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    return sortedData.map((point, i) => {
        const currentPressure = parseFloat(point.pressure);
        const pi = initialPressure;
        const dp = Math.max(0, pi - currentPressure);
        
        // Time diff (simplified to days from start)
        const date = new Date(point.date);
        const startDate = new Date(sortedData[0].date);
        const days = (date - startDate) / (1000 * 60 * 60 * 24);
        const dt = i > 0 ? (date - new Date(sortedData[i-1].date))/(1000*60*60*24) : 0;

        switch (modelType) {
            case 'schilthuis':
                // Steady State: dWe/dt = U * (Pi - P)
                // We_n = We_{n-1} + U * (Pi - P_avg) * dt
                if (i > 0) {
                    const prevP = parseFloat(sortedData[i-1].pressure);
                    const avgP = (currentPressure + prevP) / 2;
                    // Simple numeric integration
                    const stepInflux = params.aquiferConstant * (pi - avgP) * dt;
                    cumulativeWe += Math.max(0, stepInflux);
                }
                break;

            case 'fetkovich':
                // Pseudo-Steady State - Simplified implementation for visualization
                // Wei = (pi/5.615) * (ra^2 - re^2) * h * phi * ct
                const Wei = (Math.PI * (Math.pow(params.aquiferRadius, 2) - Math.pow(params.reservoirRadius, 2)) * params.thickness * params.porosity * params.compressibility) / 5.615;
                
                // J approx (radial flow)
                const mu = params.viscosity;
                const k = params.permeability;
                const theta = params.encroachmentAngle;
                const h = params.thickness;
                
                // J = 0.00708 * k * h * (theta/360) / (mu * (ln(ra/re) - 0.75))
                const denom = (Math.log(params.aquiferRadius/params.reservoirRadius) - 0.75);
                const J = denom > 0 ? (0.00708 * k * h * (theta/360)) / (mu * denom) : 0.1;
                
                // Max potential influx at current dp
                const maxInflux = Wei * (dp / pi); 
                // Time constant
                const tc = Wei / (J * pi || 1); 
                
                // Fetkovich approximation for cumulative We
                cumulativeWe = maxInflux * (1 - Math.exp(-days / (tc || 1000)));
                break;
                
            case 'veh':
                // Van Everdingen-Hurst (Unsteady State) - Polynomial Approximation
                const B = 1.119 * params.porosity * params.compressibility * params.thickness * Math.pow(params.reservoirRadius, 2) * (params.encroachmentAngle/360);
                const tD = (0.006328 * params.permeability * days) / (params.porosity * params.viscosity * params.compressibility * Math.pow(params.reservoirRadius, 2));
                
                // Qd approx for infinite aquifer (Edwardson et al.)
                let Qd = 0;
                if (tD < 0.01) Qd = 2 * Math.sqrt(tD / Math.PI);
                else if (tD < 200) Qd = (1.12838 * Math.sqrt(tD)) + 1.19328 * tD + 0.269872 * tD * Math.sqrt(tD) + 0.00855294 * tD * tD; 
                else Qd = (2 * Math.sqrt(tD)) / Math.PI; // fall back large tD

                // Correct application is convolution (superposition), simplified here to single step from Pi
                cumulativeWe = B * dp * (Qd || 0);
                break;

            default:
                break;
        }

        return {
            date: point.date,
            pressure: currentPressure,
            We: cumulativeWe,
            days: days
        };
    });
};
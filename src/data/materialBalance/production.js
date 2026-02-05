export const generateProductionHistory = (reservoir) => {
    const data = [];
    // 3 to 5 years of data
    const months = 36 + Math.floor(Math.random() * 24); 
    const startDate = new Date('2020-01-01');

    let Pi = reservoir.parameters.initialPressure;
    let cumOil = 0;
    let cumGas = 0;
    let cumWater = 0;

    // Initial Rates based on size
    let qo = reservoir.parameters.originalOilInPlace / 10000; // rough rule of thumb initial monthly rate
    if (qo > 30000) qo = 30000; // Cap at 1000 bbl/d equivalent
    if (qo < 2000) qo = 2000;

    let qg = qo * (reservoir.fluidProperties.initialGor / 1000); // mcf
    let qw = qo * 0.5; // initial water cut

    // Decline parameters
    const declineRate = 0.05; // 5% monthly effective decline (steep)
    const b = 0.8; // hyperbolic exponent
    
    // Pressure decline
    const pressureDropPerBbl = (Pi - 1000) / (reservoir.parameters.originalOilInPlace * 0.15); // Pressure drops to 1000 after 15% recovery

    for (let t = 1; t <= months; t++) {
        // Rate calc (Arps)
        let rateMod = 1.0;
        
        // Seasonal / Operational Noise
        if (Math.random() > 0.9) rateMod = 0.5; // Downtime
        
        const q_oil_t = (qo / Math.pow(1 + b * declineRate * t, 1/b)) * rateMod;
        const q_gas_t = q_oil_t * (reservoir.fluidProperties.initialGor / 1000) * (1 + t*0.01); // GOR rises
        const q_water_t = (qw * Math.log(t+1)) * rateMod; // Water production rises
        
        // Pressure update
        const P_avg = Pi - (cumOil * pressureDropPerBbl);
        
        cumOil += q_oil_t;
        cumGas += q_gas_t;
        cumWater += q_water_t;

        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + t);

        data.push({
            date: date.toISOString().split('T')[0],
            pressure: Math.max(Math.round(P_avg), 500),
            oilProd: Math.round(q_oil_t),
            gasProd: Math.round(q_gas_t),
            waterProd: Math.round(q_water_t),
            cumOil: Math.round(cumOil),
            cumGas: Math.round(cumGas),
            cumWater: Math.round(cumWater),
            daysOn: rateMod < 1 ? 15 : 30
        });
    }

    return data;
};
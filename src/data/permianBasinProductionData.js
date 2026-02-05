import { permianBasinWells } from './permianBasinWells';

const generateProductionData = (wells) => {
    const data = {};

    wells.forEach(well => {
        const prodData = [];
        const startDate = new Date(well.firstProdDate);
        const today = new Date(); // Assume current date for simulation end
        let currentDate = new Date(startDate);
        
        let qi = well.formation.includes("Wolfcamp") ? 1200 : well.formation.includes("Bone Spring") ? 1000 : 600; // Initial Oil Rate
        if (well.type === "Vertical") qi = 150;
        
        let qg_i = qi * (well.fluidType === "Gas" ? 5 : 2); // GOR approx 2-5 mcf/bbl or higher for gas wells
        let qw_i = qi * 1.5; // Water cut
        
        // Decline parameters (Hyperbolic)
        const b = well.formation.includes("Shale") ? 1.2 : 0.8;
        const Di = 0.65; // Nominal annual decline
        const Di_monthly = 1 - Math.pow(1 - Di, 1/12);

        let t = 0;
        let cumOil = 0;
        let cumGas = 0;
        let cumWater = 0;

        while (currentDate <= today) {
            t++;
            // Hyperbolic decline equation: q(t) = qi / (1 + b * Di * t)^(1/b)
            // Adding some noise and operational events
            
            let noise = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% noise
            let eventFactor = 1.0;

            // Simulate shut-in or workover
            if (Math.random() < 0.02) eventFactor = 0; // Random shut-in
            else if (t === 24 && well.type === 'Horizontal') eventFactor = 1.2; // Artificial lift install or small workover boost
            
            let q_oil = (qi / Math.pow(1 + b * Di_monthly * t, 1/b)) * noise * eventFactor;
            let q_gas = (qg_i / Math.pow(1 + b * Di_monthly * t, 1/b)) * noise * eventFactor * 1.1; // GOR increases over time slightly
            let q_water = (qw_i / Math.pow(1 + (b - 0.2) * Di_monthly * t, 1/(b-0.2))) * noise * eventFactor; // Water declines differently
            
            if (q_oil < 0) q_oil = 0;
            if (q_gas < 0) q_gas = 0;
            if (q_water < 0) q_water = 0;

            cumOil += q_oil * 30.4; // Monthly volume
            cumGas += q_gas * 30.4;
            cumWater += q_water * 30.4;

            prodData.push({
                date: currentDate.toISOString().split('T')[0],
                oilRate: Math.round(q_oil),
                gasRate: Math.round(q_gas),
                waterRate: Math.round(q_water),
                cumOil: Math.round(cumOil),
                cumGas: Math.round(cumGas),
                cumWater: Math.round(cumWater),
                status: eventFactor === 0 ? "Shut-in" : "Active",
                daysOn: eventFactor === 0 ? 0 : 30
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        data[well.id] = prodData;
    });

    return data;
};

export const permianBasinProductionData = generateProductionData(permianBasinWells);
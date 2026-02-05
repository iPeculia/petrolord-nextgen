// Realistic sample data for material balance analysis

const generateProductionData = (scenario) => {
    let data = [];
    let currentDate = new Date('2020-01-01');
    let oilRate = scenario.initialOilRate;
    let gasRate = scenario.initialGasRate;
    let waterRate = scenario.initialWaterRate;
    let cumulativeProduction = 0;

    for (let i = 0; i < 120; i++) {
        cumulativeProduction += oilRate * 30; // Monthly cumulative
        data.push({
            date: currentDate.toISOString().split('T')[0],
            oil_rate: Math.round(oilRate),
            gas_rate: Math.round(gasRate),
            water_rate: Math.round(waterRate),
            cumulative_production: Math.round(cumulativeProduction),
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
        
        // Apply decline and changes based on scenario
        oilRate *= scenario.declineRate;
        gasRate *= scenario.gasDecline;
        waterRate += scenario.waterIncrease;
    }
    return data;
};

const generatePvtData = (scenario) => {
    let data = [];
    const pressureSteps = 15;
    const pressureDrop = (scenario.initialPressure - scenario.finalPressure) / pressureSteps;

    for (let i = 0; i <= pressureSteps; i++) {
        const pressure = scenario.initialPressure - (i * pressureDrop);
        // Simplified PVT correlations
        const bo = scenario.initialBo * (1 + 0.0001 * (scenario.initialPressure - pressure));
        const rs = scenario.initialRs * (pressure / scenario.initialPressure);
        const bg = scenario.initialBg * (scenario.initialPressure / pressure);
        const viscosity = scenario.initialViscosity * (1 + 0.0005 * (scenario.initialPressure - pressure));

        data.push({
            pressure: Math.round(pressure),
            bo: parseFloat(bo.toFixed(4)),
            bg: parseFloat(bg.toFixed(4)),
            rs: parseFloat(rs.toFixed(2)),
            viscosity: parseFloat(viscosity.toFixed(3)),
        });
    }
    return data.reverse(); // Ensure pressure is ascending
};

const scenarios = {
    solution_gas_drive: {
        name: 'Solution Gas Drive',
        description: 'A volatile oil reservoir produced by solution gas drive.',
        initialPressure: 4500,
        finalPressure: 1000,
        initialOilRate: 5000,
        initialGasRate: 7500,
        initialWaterRate: 50,
        declineRate: 0.98,
        gasDecline: 0.97,
        waterIncrease: 5,
        initialBo: 1.5,
        initialBg: 0.005,
        initialRs: 1500,
        initialViscosity: 0.5,
    },
    water_influx: {
        name: 'Active Water Influx',
        description: 'A reservoir with strong aquifer support maintaining pressure.',
        initialPressure: 3800,
        finalPressure: 2500,
        initialOilRate: 8000,
        initialGasRate: 4000,
        initialWaterRate: 200,
        declineRate: 0.99, // Slower decline due to pressure support
        gasDecline: 0.98,
        waterIncrease: 150, // Significant water cut increase
        initialBo: 1.2,
        initialBg: 0.008,
        initialRs: 800,
        initialViscosity: 0.8,
    },
    gas_cap: {
        name: 'Gas Cap Expansion',
        description: 'A reservoir with a significant gas cap providing pressure support.',
        initialPressure: 5000,
        finalPressure: 1500,
        initialOilRate: 6000,
        initialGasRate: 12000, // High initial GOR
        initialWaterRate: 20,
        declineRate: 0.985,
        gasDecline: 0.96, // GOR increases over time
        waterIncrease: 2,
        initialBo: 1.6,
        initialBg: 0.004,
        initialRs: 2000,
        initialViscosity: 0.4,
    },
};

export const getSampleProductionData = (scenarioName = 'solution_gas_drive') => {
    return generateProductionData(scenarios[scenarioName]);
};

export const getSamplePvtData = (scenarioName = 'solution_gas_drive') => {
    return generatePvtData(scenarios[scenarioName]);
};

export const getSampleDataAsCSV = (type, scenarioName = 'solution_gas_drive') => {
    const data = type === 'production' ? getSampleProductionData(scenarioName) : getSamplePvtData(scenarioName);
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ];
    return csvRows.join('\n');
};

export const getAllScenarios = () => {
    return Object.keys(scenarios).map(key => ({
        id: key,
        name: scenarios[key].name,
        description: scenarios[key].description,
    }));
};
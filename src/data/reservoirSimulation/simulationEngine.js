// Physics-based Simulation Engine for Mini Simulator
// Implements simplified 1D radial flow and material balance calculations

export const runSimulation = (params) => {
    // 1. Destructure & Validate Parameters
    const {
        initialPressure = 3500, // psia
        injectionRate = 500,    // bbl/d
        productionRate = 500,   // bbl/d
        duration = 365,         // days
        timeStep = 30,          // days
        permeability = 100,     // md
        porosity = 0.2,         // fraction
        viscosity = 1.0         // cp
    } = params;

    // Numerical validation to prevent NaN/Infinity
    if (duration <= 0 || timeStep <= 0) throw new Error("Invalid time parameters");

    // 2. Setup Grid / Time
    const steps = Math.ceil(duration / timeStep);
    const timeSteps = Array.from({ length: steps + 1 }, (_, i) => i * timeStep);
    
    // 3. Initialize Arrays
    const pressure = [initialPressure];
    const production = {
        oilRate: [productionRate],
        waterRate: [0],
        cumulativeOil: [0],
        waterCut: [0],
        reservoirPressure: [initialPressure]
    };

    // 4. Physics Loop (Simplified Material Balance & Decline)
    // Using a compressibility-based tank model approximation for speed in "Mini" sim
    
    let currentPressure = initialPressure;
    let currentCumOil = 0;
    let currentWaterCut = 0;
    
    // Reservoir constants
    const compressibility = 1.5e-5; // 1/psi
    const poreVolume = 1000000; // bbl (Assumed for mini-sim scale)
    const productivityIndex = (permeability * 0.01); // Simplified PI relationship

    for (let i = 1; i <= steps; i++) {
        const dt = timeStep;
        
        // A. Material Balance: Voidage Replacement
        // dP = -(q_out - q_in) * B / (c * V)
        const netVoidage = (productionRate - injectionRate) * dt; 
        const pressureChange = -(netVoidage) / (poreVolume * compressibility);
        
        currentPressure += pressureChange;
        
        // Physics check: Pressure cannot be negative
        if (currentPressure < 14.7) currentPressure = 14.7;

        // B. Production Performance (Inflow Performance Relationship - IPR)
        // Rate declines as pressure drops
        const drawDown = Math.max(0, currentPressure - 500); // 500 psi flowing BHP
        let potentialRate = drawDown * productivityIndex * 10; // *10 scaling factor for realism
        
        // Cap potential rate at max facility limit (initial requested rate)
        let actualRate = Math.min(productionRate, potentialRate);
        
        // C. Water Breakthrough (Buckley-Leverett approximation)
        // Breakthrough time proportional to pore volume / injection rate
        const injectedVolume = injectionRate * (i * dt);
        const breakthroughVolume = poreVolume * porosity * 0.4; // 0.4 sweep efficiency
        
        if (injectedVolume > breakthroughVolume) {
            // Water cut rises sigmoidally after breakthrough
            const excess = (injectedVolume - breakthroughVolume) / poreVolume;
            currentWaterCut = Math.min(0.95, 1 / (1 + Math.exp(-10 * (excess - 0.2))));
        } else {
            currentWaterCut = 0;
        }

        const oilRate = actualRate * (1 - currentWaterCut);
        const waterRate = actualRate * currentWaterCut;
        
        currentCumOil += oilRate * dt;

        // D. Store Step Data
        production.reservoirPressure.push(currentPressure);
        production.oilRate.push(oilRate);
        production.waterRate.push(waterRate);
        production.waterCut.push(currentWaterCut * 100); // Percentage
        production.cumulativeOil.push(currentCumOil / 1000); // MSTB
    }

    return {
        timeSteps,
        results: production,
        summary: {
            finalPressure: currentPressure,
            totalOil: currentCumOil,
            finalWaterCut: currentWaterCut * 100
        }
    };
};
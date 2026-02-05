import { sampleReservoirs } from './reservoirs';

// Helper to generate realistic pressure history
export const generateDetailedPressureHistory = (reservoir) => {
    const { initialPressure, currentPressure } = reservoir.parameters;
    const history = [];
    const months = 36; // 3 years history
    const startDate = new Date('2021-01-01');
    
    // Determine decline profile based on drive mechanism
    let declineExp = 0.5; // Default square root decline
    if (reservoir.driveMechanism === "Water Drive") declineExp = 0.2; // Slower pressure decline
    if (reservoir.driveMechanism === "Gas Expansion") declineExp = 0.8; // Faster initial decline

    const totalDrop = initialPressure - currentPressure;

    for (let i = 0; i <= months; i++) {
        const t = i / months;
        // Non-linear pressure drop based on mechanism
        const currentDrop = totalDrop * Math.pow(t, declineExp); 
        let pressure = Math.round(initialPressure - currentDrop);

        // Add some noise/seasonality
        const noise = (Math.random() - 0.5) * 20; 
        pressure += Math.round(noise);

        // Simulating a shut-in or buildup at month 18
        if (i === 18) {
            pressure += 150; // Buildup
        }
        if (i > 18 && i < 21) {
            // Transient effect after buildup
             pressure += 50; 
        }

        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);

        // Derive monthly stats
        const pMin = pressure - 15 - Math.random() * 10;
        const pMax = pressure + 15 + Math.random() * 10;
        
        // Prev pressure for change calc
        const prevP = i > 0 ? history[i-1].averagePressure : initialPressure;

        history.push({
            date: date.toISOString().split('T')[0],
            averagePressure: pressure,
            minPressure: Math.round(pMin),
            maxPressure: Math.round(pMax),
            pressureChange: Math.round(pressure - prevP),
            cumulativeDecline: Math.round(initialPressure - pressure),
            // Correlation to production rates (inverse relationship usually)
            estProductionRate: Math.round(1000 * (pressure / initialPressure)), 
            aquiferInflux: reservoir.driveMechanism === "Water Drive" ? Math.round(500 * (1 - (pressure/initialPressure))) : 0,
            comment: i === 18 ? "Extended Shut-in / Buildup test" : ""
        });
    }

    return history;
};

export const samplePressureHistory = {};
sampleReservoirs.forEach(res => {
    samplePressureHistory[res.id] = generateDetailedPressureHistory(res);
});
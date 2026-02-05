export const generatePressureSaturation = (reservoir) => {
    const swi = reservoir.parameters.swi;
    const history = [];
    
    const initialP = reservoir.parameters.initialPressure;
    const currentP = reservoir.parameters.currentPressure;
    
    // Simulate saturation changes from Pi down to Current P
    const steps = 10;
    const pStep = (initialP - currentP) / steps;

    for (let i = 0; i <= steps; i++) {
        const p = initialP - (i * pStep);
        const depletionFactor = i/steps; // 0 to 1

        // Water saturation increases if aquifer support, else stays near Swi
        let Sw = swi;
        if (reservoir.driveMechanism.includes("Water") || reservoir.parameters.pressureMaintenanceStatus.includes("Injection")) {
             Sw = swi + (0.3 * depletionFactor); // Water encroaches
        }

        // Gas saturation (Sg)
        let Sg = 0;
        if (p < reservoir.parameters.bubblePointPressure) {
             // Secondary gas cap forms
             Sg = 0.2 * depletionFactor;
        }

        // Oil saturation (So)
        const So = 1 - Sw - Sg;

        history.push({
            pressure: Math.round(p),
            Sw: parseFloat(Sw.toFixed(3)),
            So: parseFloat(So.toFixed(3)),
            Sg: parseFloat(Sg.toFixed(3)),
            krw: parseFloat((0.2 * Math.pow(Sw, 3)).toFixed(4)), // Simple RelPerm link
            kro: parseFloat((0.8 * Math.pow(So, 2)).toFixed(4))
        });
    }

    return history;
};
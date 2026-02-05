/**
 * Detects flow regimes based on derivative signatures.
 * 
 * Rules of thumb (Log-Log Slope):
 * - Wellbore Storage: Slope ~ 1
 * - Radial Flow: Slope ~ 0 (Horizontal Derivative)
 * - Linear Flow: Slope ~ 0.5
 * - Bilinear Flow: Slope ~ 0.25
 * - Spherical Flow: Slope ~ -0.5
 * - Boundary (Closed): Slope increases (unit slope late time)
 * - Boundary (Constant Pressure): Derivative drops rapidly
 */
export const detectFlowRegimes = (data) => {
    if (!data || data.length < 10) return [];

    const regimes = [];
    const windowSize = 5;
    
    // Helper to calculate slope between points i and i+window
    const getSlope = (idx) => {
        if (idx + windowSize >= data.length) return null;
        
        const p1 = data[idx];
        const p2 = data[idx + windowSize];
        
        if (!p1.derivative || !p2.derivative || p1.derivative <= 0 || p2.derivative <= 0) return null;

        const dy = Math.log10(p2.derivative) - Math.log10(p1.derivative);
        const dx = Math.log10(p2.time) - Math.log10(p1.time);
        
        return dx !== 0 ? dy / dx : 0;
    };

    let currentRegime = null;
    let regimeStart = 0;

    for (let i = 0; i < data.length - windowSize; i += 2) { // Step by 2 for speed
        const slope = getSlope(i);
        if (slope === null) continue;

        let detected = 'Transition';

        if (Math.abs(slope - 1) < 0.2) detected = 'Wellbore Storage';
        else if (Math.abs(slope) < 0.1) detected = 'Infinite Acting Radial Flow'; // Flat
        else if (Math.abs(slope - 0.5) < 0.15) detected = 'Linear Flow';
        else if (slope > 0.8 && i > data.length / 2) detected = 'Boundary Effect (Closed)';
        else if (slope < -0.8 && i > data.length / 2) detected = 'Boundary Effect (Const. P)';

        if (detected !== currentRegime) {
            if (currentRegime && currentRegime !== 'Transition') {
                regimes.push({
                    type: currentRegime,
                    startIndex: regimeStart,
                    endIndex: i,
                    startTime: data[regimeStart].time,
                    endTime: data[i].time
                });
            }
            currentRegime = detected;
            regimeStart = i;
        }
    }

    // Close last regime
    if (currentRegime && currentRegime !== 'Transition') {
        regimes.push({
            type: currentRegime,
            startIndex: regimeStart,
            endIndex: data.length - 1,
            startTime: data[regimeStart].time,
            endTime: data[data.length - 1].time
        });
    }

    // Filter short blips
    return regimes.filter(r => (r.endTime - r.startTime) > (data[data.length-1].time * 0.05));
};
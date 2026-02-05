export const calculateIPR = (pi, reservoirPressure, type = 'oil') => {
    const points = [];
    const maxRate = pi * reservoirPressure; // AOF for straight line IPR (PI > 0)
    
    // 20 points for the curve
    const steps = 20;
    const pStep = reservoirPressure / steps;

    for (let i = 0; i <= steps; i++) {
        const pwf = reservoirPressure - (i * pStep);
        let q = 0;

        if (type === 'oil') {
            // Straight line IPR (J * dp) above Pb, Vogel below Pb
            // Simplified: Straight line for entire range if undersaturated
            q = pi * (reservoirPressure - pwf);
        } else if (type === 'gas') {
            // Backpressure equation: q = C * (Pr^2 - Pwf^2)^n
            // Simplified C calculation based on linear PI at low drawdown
            const n = 0.8; // typical
            const C = pi / (2 * reservoirPressure); // rough approx
            q = C * (Math.pow(reservoirPressure, 2) - Math.pow(pwf, 2));
        }

        points.push({
            pressure: pwf,
            rate: Math.max(0, q)
        });
    }

    return points.sort((a,b) => b.pressure - a.pressure); // High P to Low P
};
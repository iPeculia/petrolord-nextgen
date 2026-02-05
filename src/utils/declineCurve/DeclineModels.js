// Arps Decline Curve Models and Calculations

/**
 * Calculates rate at time t based on model parameters
 * t: time (days)
 * qi: initial rate (vol/day)
 * Di_annual: nominal annual decline rate (decimal, e.g., 0.5 for 50%)
 * b: decline exponent
 */
export const calculateRate = (t, qi, Di_annual, b) => {
    // Convert Di from annual effective to daily nominal approx
    // Standard industry practice: Di input is usually Nominal Annual.
    // Daily nominal Di = Di_annual / 365
    const Di = Di_annual / 365.0;

    if (t < 0) return 0;
    if (qi <= 0) return 0;

    // Exponential (b=0)
    if (Math.abs(b) < 1e-4) {
        return qi * Math.exp(-Di * t);
    }

    // Harmonic (b=1)
    if (Math.abs(b - 1.0) < 1e-4) {
        return qi / (1.0 + Di * t);
    }

    // Hyperbolic (0 < b < 1 or b > 1)
    // q(t) = qi / (1 + b * Di * t)^(1/b)
    const base = 1.0 + b * Di * t;
    if (base <= 0) return 0; // Mathematical safety
    return qi / Math.pow(base, (1.0 / b));
};

/**
 * Calculates Cumulative Production at time t
 */
export const calculateCumulative = (t, qi, Di_annual, b) => {
    const Di = Di_annual / 365.0;

    if (t <= 0) return 0;
    if (qi <= 0) return 0;

    // Exponential (b=0)
    if (Math.abs(b) < 1e-4) {
        // Np = (qi - q(t)) / Di
        const qt = calculateRate(t, qi, Di_annual, b);
        return (qi - qt) / Di;
    }

    // Harmonic (b=1)
    if (Math.abs(b - 1.0) < 1e-4) {
        // Np = (qi / Di) * ln(1 + Di*t)
        return (qi / Di) * Math.log(1.0 + Di * t);
    }

    // Hyperbolic
    // Np = (qi^b / (Di * (1-b))) * (qi^(1-b) - q(t)^(1-b))
    // Simplified form used often: (qi / (Di*(1-b))) * [1 - (1 + b*Di*t)^(1 - 1/b)]
    const term1 = qi / (Di * (1.0 - b));
    const inner = 1.0 + b * Di * t;
    const exponent = 1.0 - (1.0 / b);
    return term1 * (1.0 - Math.pow(inner, exponent));
};

/**
 * Calculate Time to Economic Limit
 * q_limit: Economic limit rate
 */
export const calculateTimeToLimit = (q_limit, qi, Di_annual, b) => {
    const Di = Di_annual / 365.0;
    
    if (qi <= q_limit) return 0;
    if (q_limit <= 0) return 0; // Avoid log(0) or division by zero issues in logic

    // Exponential
    if (Math.abs(b) < 1e-4) {
        // t = -ln(q_limit/qi) / Di
        return -Math.log(q_limit / qi) / Di;
    }

    // Harmonic
    if (Math.abs(b - 1.0) < 1e-4) {
        // t = ( (qi/q_limit) - 1 ) / Di
        return ((qi / q_limit) - 1.0) / Di;
    }

    // Hyperbolic
    // q = qi / (1 + b*Di*t)^(1/b) => (qi/q)^b = 1 + b*Di*t => t = [ (qi/q)^b - 1 ] / (b*Di)
    return (Math.pow((qi / q_limit), b) - 1.0) / (b * Di);
};

/**
 * Generate full curve data points for visualization
 */
export const generateCurve = (params, durationDays) => {
    const { qi, Di, b } = params;
    const points = [];
    
    // Step size logic: finer at start (daily for 1st year), coarser at end (monthly)
    for (let t = 0; t <= durationDays; t += (t < 365 ? 1 : 30)) {
        points.push({
            days: t,
            rate: calculateRate(t, qi, Di, b),
            cumulative: calculateCumulative(t, qi, Di, b)
        });
    }
    return points;
};
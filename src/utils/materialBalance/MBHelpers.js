export const estimateOOIP = (F, Eo, slope) => {
    // Basic estimation from slope of F vs Eo
    // Typically Slope = N
    return slope > 0 ? slope : 0;
};

export const estimateOGIP = (slope, intercept) => {
    // For P/Z plot: P/Z = Pi/Zi - (Pi/Zi / G) * Gp
    // Slope m = - (Pi/Zi) / G
    // Intercept c = Pi/Zi
    // So G = -c / m
    if (slope === 0) return 0;
    return -intercept / slope;
};

export const calculateDriveContribution = (diagnostic_results) => {
    // Advanced: Calculate indices (DDI, SDI, WDI)
    // Placeholder for Phase 4
    return { ddi: 0, sdi: 0, wdi: 0 };
};

export const assessDataQuality = (diagnostic_data) => {
    // Placeholder
    return { quality: 'good', issues: [] };
};

export const formatDiagnosticResults = (results) => {
    if (!results) return [];
    return Object.entries(results).map(([key, value]) => ({
        parameter: key,
        value: typeof value === 'number' ? value.toFixed(4) : value
    }));
};
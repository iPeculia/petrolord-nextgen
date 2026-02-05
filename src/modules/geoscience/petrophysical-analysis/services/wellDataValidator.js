/**
 * Validator for imported well data
 */
export const validateWellData = (data) => {
    const issues = [];
    let isValid = true;

    if (!data) {
        return { valid: false, issues: ["No data provided"] };
    }

    if (data.needsMapping) {
        return { valid: true, issues: [], needsMapping: true };
    }

    // Check depth
    if (!data.depth) {
        issues.push("No depth information found.");
        isValid = false;
    } else {
        if (typeof data.depth.min !== 'number' || typeof data.depth.max !== 'number') {
             issues.push("Invalid depth range.");
             isValid = false;
        }
    }

    // Check logs
    if (!data.logs || Object.keys(data.logs).length === 0) {
        issues.push("No curve data found.");
        isValid = false;
    } else {
        Object.entries(data.logs).forEach(([name, log]) => {
            if (!log.values || log.values.length === 0) {
                issues.push(`Curve ${name} has no data values.`);
            }
            if (!log.depth || log.depth.length !== log.values.length) {
                issues.push(`Curve ${name} data length mismatch with depth.`);
            }
        });
    }

    return {
        valid: isValid && issues.length === 0,
        issues: issues
    };
};
export const validateData = (data) => {
  const issues = [];
  let validPoints = 0;
  let missingValues = 0;
  let negativePressure = 0;
  let nonMonotonicTime = 0;

  if (!data || data.length === 0) {
    return { isValid: false, score: 0, issues: ['No data provided'], stats: {} };
  }

  // Check required fields existence in first row
  const hasTime = 'time' in data[0];
  const hasPressure = 'pressure' in data[0];

  if (!hasTime || !hasPressure) {
     return { isValid: false, score: 0, issues: ['Missing required columns (Time or Pressure)'], stats: {} };
  }

  let prevTime = -Infinity;
  let minTime = Infinity;
  let maxTime = -Infinity;
  let minPres = Infinity;
  let maxPres = -Infinity;

  data.forEach((row, index) => {
    // Check Time
    if (row.time === null || row.time === undefined || isNaN(row.time)) {
        missingValues++;
    } else {
        if (row.time < prevTime) {
            nonMonotonicTime++;
        }
        prevTime = row.time;
        if (row.time < minTime) minTime = row.time;
        if (row.time > maxTime) maxTime = row.time;
    }

    // Check Pressure
    if (row.pressure === null || row.pressure === undefined || isNaN(row.pressure)) {
        missingValues++;
    } else {
        if (row.pressure < 0) negativePressure++;
        if (row.pressure < minPres) minPres = row.pressure;
        if (row.pressure > maxPres) maxPres = row.pressure;
    }
    
    validPoints++;
  });

  if (nonMonotonicTime > 0) issues.push(`${nonMonotonicTime} instances of non-increasing time found.`);
  if (missingValues > 0) issues.push(`${missingValues} missing values found.`);
  if (negativePressure > 0) issues.push(`${negativePressure} negative pressure values found.`);

  // Calculate Score (Simple heuristic)
  const totalRows = data.length;
  const errorCount = missingValues + nonMonotonicTime + negativePressure;
  const score = Math.max(0, Math.min(100, 100 - (errorCount / totalRows) * 100));

  return {
    isValid: score > 50, // Threshold
    score: Math.round(score),
    issues,
    stats: {
        count: totalRows,
        timeRange: [minTime, maxTime],
        pressureRange: [minPres, maxPres],
        missingCount: missingValues
    }
  };
};
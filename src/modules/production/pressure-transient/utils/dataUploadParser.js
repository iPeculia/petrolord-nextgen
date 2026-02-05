import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numbers
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
          return;
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const validateTestData = (data) => {
  const errors = [];
  const validData = [];
  
  // Required columns normalization (case-insensitive)
  const requiredColumns = ['time', 'pressure']; // flow_rate is optional but recommended
  
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['File is empty'], data: [] };
  }

  // Check headers of first row
  const headers = Object.keys(data[0]).map(h => h.toLowerCase());
  const missingColumns = requiredColumns.filter(col => !headers.some(h => h.includes(col)));
  
  if (missingColumns.length > 0) {
    return { 
      isValid: false, 
      errors: [`Missing required columns: ${missingColumns.join(', ')}`], 
      data: [] 
    };
  }

  // Validate rows
  let previousTime = -1;
  
  data.forEach((row, index) => {
    // Normalize keys
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('time')) normalizedRow.time = row[key];
      else if (lowerKey.includes('pressure')) normalizedRow.pressure = row[key];
      else if (lowerKey.includes('flow')) normalizedRow.flow_rate = row[key];
      else if (lowerKey.includes('rate')) normalizedRow.flow_rate = row[key]; // Alternative for flow rate
    });

    // Validation checks
    if (typeof normalizedRow.time !== 'number' || isNaN(normalizedRow.time)) {
      errors.push(`Row ${index + 1}: Invalid time value`);
    } else if (normalizedRow.time <= previousTime) {
      errors.push(`Row ${index + 1}: Time must be increasing (Time: ${normalizedRow.time})`);
    } else if (typeof normalizedRow.pressure !== 'number' || isNaN(normalizedRow.pressure)) {
      errors.push(`Row ${index + 1}: Invalid pressure value`);
    } else {
      previousTime = normalizedRow.time;
      // Default flow_rate to 0 if missing/invalid, or keep as is? 
      // Let's assume 0 if not provided for calculation safety, or undefined if strict.
      // For PTA, rate history is often separate. We'll keep it if present.
      validData.push({
        time_hours: normalizedRow.time,
        pressure_psi: normalizedRow.pressure,
        flow_rate: typeof normalizedRow.flow_rate === 'number' ? normalizedRow.flow_rate : 0
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};
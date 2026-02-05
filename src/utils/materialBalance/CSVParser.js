import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided."));
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          // Log errors but return what we have if possible, or reject if fatal
          console.warn("CSV Parsing errors:", results.errors);
        }
        resolve({ headers: results.meta.fields, data: results.data });
      },
      error: (error) => {
        reject(new Error("Error reading file: " + error.message));
      }
    });
  });
};

/**
 * Maps raw CSV data to the internal schema based on user-provided mapping.
 * @param {Array} data - Raw parsed CSV data rows.
 * @param {Object} mapping - Object mapping internal keys to CSV headers (e.g., { date: 'Date_Col', oilProd: 'Np_Col' }).
 * @returns {Array} Mapped data array ready for state.
 */
export const mapColumns = (data, mapping) => {
  return data.map(row => {
    const newRow = {};
    Object.keys(mapping).forEach(internalKey => {
      const csvHeader = mapping[internalKey];
      if (csvHeader && row[csvHeader] !== undefined) {
        let value = row[csvHeader];
        // Basic type cleaning
        if (internalKey === 'date') {
           // Keep date as string or parsed date object? Let's keep raw string or standard ISO here if needed.
           // For now, pass through, Validator will handle format checks.
        } else {
           // Ensure numbers are numbers
           if (typeof value === 'string') {
               value = parseFloat(value.replace(/,/g, '')); // Handle comma separators
           }
        }
        newRow[internalKey] = value;
      }
    });
    return newRow;
  });
};
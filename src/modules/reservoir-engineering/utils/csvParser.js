import Papa from 'papaparse';

const normalizeColumnNames = (name) => {
    const lowerCaseName = name.toLowerCase().trim();
    const synonyms = {
        'date': ['date', 'time', 'day'],
        'pressure': ['pressure', 'pres', 'p'],
        'oil_rate': ['oil_rate', 'oilrate', 'qo', 'oil production'],
        'gas_rate': ['gas_rate', 'gasrate', 'qg', 'gas production'],
        'water_rate': ['water_rate', 'waterrate', 'qw', 'water production'],
        'cumulative_production': ['cumulative_production', 'cum_prod', 'np', 'cumulative oil'],
        'bo': ['bo', 'oil formation volume factor', 'fvf_oil'],
        'bg': ['bg', 'gas formation volume factor', 'fvf_gas'],
        'rs': ['rs', 'solution gas-oil ratio', 'gor'],
        'viscosity': ['viscosity', 'oil_viscosity', 'visc_oil', 'mu_o'],
    };

    for (const standardName in synonyms) {
        if (synonyms[standardName].includes(lowerCaseName)) {
            return standardName;
        }
    }
    return lowerCaseName;
};

const detectAndNormalizeColumns = (headers) => {
    const normalized = {};
    headers.forEach(h => {
        normalized[h] = normalizeColumnNames(h);
    });
    return normalized;
};

const convertToNumbers = (data, numericColumns) => {
    return data.map(row => {
        const newRow = { ...row };
        for (const col of numericColumns) {
            if (newRow[col] !== undefined && newRow[col] !== null && newRow[col] !== '') {
                const num = Number(newRow[col]);
                newRow[col] = isNaN(num) ? null : num;
            } else {
                 newRow[col] = null;
            }
        }
        return newRow;
    });
};

export const parseCSV = (csvText) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(results.errors);
                } else {
                    const headers = results.meta.fields;
                    const normalizedMap = detectAndNormalizeColumns(headers);
                    
                    const renamedData = results.data.map(row => {
                        const newRow = {};
                        for(const originalHeader in row) {
                            const normalizedHeader = normalizedMap[originalHeader];
                            if(normalizedHeader) {
                                newRow[normalizedHeader] = row[originalHeader];
                            }
                        }
                        return newRow;
                    });

                    resolve({ data: renamedData, originalHeaders: headers });
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

export const validateProductionData = (data) => {
    const errors = [];
    const warnings = [];
    const requiredCols = ['date', 'oil_rate', 'gas_rate', 'water_rate', 'cumulative_production'];
    const numericCols = ['oil_rate', 'gas_rate', 'water_rate', 'cumulative_production'];
    
    const presentCols = Object.keys(data[0] || {});
    requiredCols.forEach(col => {
        if (!presentCols.includes(col)) {
            errors.push({ message: `Missing required column: ${col}. Please ensure your CSV has a column with a name like '${col}'.` });
        }
    });

    if (errors.length > 0) return { isValid: false, errors, warnings };

    const numberedData = convertToNumbers(data, numericCols);
    let lastDate = null;
    let lastCumProd = -1;

    numberedData.forEach((row, index) => {
        const rowNum = index + 2; // For user-friendly row number (1-based + header)
        
        // Date validation
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
            errors.push({ row: rowNum, column: 'date', message: `Invalid date format: '${row.date}'. Use YYYY-MM-DD or MM/DD/YYYY.` });
        } else {
            if (lastDate && date <= lastDate) {
                warnings.push({ row: rowNum, column: 'date', message: `Dates are not in chronological order.` });
            }
            lastDate = date;
        }

        // Numeric validation
        numericCols.forEach(col => {
            if (row[col] === null) {
                errors.push({ row: rowNum, column: col, message: `Invalid or missing numeric value.` });
            } else if (row[col] < 0) {
                warnings.push({ row: rowNum, column: col, message: `Value is negative (${row[col]}). This is unusual.` });
            }
        });

        // Cumulative production validation
        if (row.cumulative_production !== null) {
            if (lastCumProd !== -1 && row.cumulative_production < lastCumProd) {
                errors.push({ row: rowNum, column: 'cumulative_production', message: `Cumulative production decreased from ${lastCumProd} to ${row.cumulative_production}.` });
            }
            lastCumProd = row.cumulative_production;
        }
    });

    return { isValid: errors.length === 0, errors, warnings, data: numberedData };
};

export const validatePvtData = (data) => {
    const errors = [];
    const warnings = [];
    const requiredCols = ['pressure', 'bo', 'bg', 'rs', 'viscosity'];
    const numericCols = ['pressure', 'bo', 'bg', 'rs', 'viscosity'];

    const presentCols = Object.keys(data[0] || {});
    requiredCols.forEach(col => {
        if (!presentCols.includes(col)) {
            errors.push({ message: `Missing required column: ${col}. Please ensure your CSV has a column with a name like '${col}'.` });
        }
    });

    if (errors.length > 0) return { isValid: false, errors, warnings };

    const numberedData = convertToNumbers(data, numericCols);
    let lastPressure = -1;

    numberedData.forEach((row, index) => {
        const rowNum = index + 2;

        numericCols.forEach(col => {
            if (row[col] === null) {
                errors.push({ row: rowNum, column: col, message: `Invalid or missing numeric value.` });
            } else if (row[col] <= 0) {
                errors.push({ row: rowNum, column: col, message: `Value must be positive, but got ${row[col]}.` });
            }
        });

        if (row.pressure !== null) {
            if (lastPressure !== -1 && row.pressure <= lastPressure) {
                warnings.push({ row: rowNum, column: 'pressure', message: `Pressure values are not in ascending order.` });
            }
            lastPressure = row.pressure;
        }
    });

    return { isValid: errors.length === 0, errors, warnings, data: numberedData };
};

export const parseProductionData = async (csvText) => {
    const { data } = await parseCSV(csvText);
    return validateProductionData(data);
};

export const parsePvtData = async (csvText) => {
    const { data } = await parseCSV(csvText);
    return validatePvtData(data);
};
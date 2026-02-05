import Papa from 'papaparse';

export const parseCSV = (file, callback) => {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
            callback({
                data: results.data,
                meta: results.meta,
                errors: results.errors
            });
        },
        error: (error) => {
            callback({ error });
        }
    });
};

export const normalizeData = (rawData, mapping) => {
    // mapping: { date: 'DateCol', rate: 'OilRateCol', cumulative: 'CumCol' }
    return rawData.map(row => {
        // Handle Date parsing
        let dateVal = row[mapping.date];
        if (typeof dateVal === 'string') {
            // Try standard parser
            const parsed = new Date(dateVal);
            if (!isNaN(parsed)) dateVal = parsed.toISOString().split('T')[0];
        }

        return {
            date: dateVal,
            oilRate: parseFloat(row[mapping.oilRate] || 0),
            gasRate: parseFloat(row[mapping.gasRate] || 0),
            waterRate: parseFloat(row[mapping.waterRate] || 0),
            cumulativeOil: parseFloat(row[mapping.cumulativeOil] || 0),
            cumulativeGas: parseFloat(row[mapping.cumulativeGas] || 0),
            days: parseFloat(row[mapping.days] || 0) // Optional, calculated later usually
        };
    }).filter(d => d.date); // Filter out rows without valid dates
};
import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically converts numbers
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn("CSV Parsing warning:", results.errors);
        }
        resolve({
            data: results.data,
            columns: results.meta.fields || []
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
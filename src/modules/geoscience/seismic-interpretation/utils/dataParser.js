import Papa from 'papaparse';

export const parseSeismicCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.error("Parsing errors:", results.errors);
            reject(new Error('Error parsing CSV file.'));
            return;
          }
          
          const data = results.data;
          if (data.length < 2) {
            reject(new Error('Invalid seismic CSV format: Not enough rows.'));
            return;
          }

          const time = data.map(row => row[0]);
          const traces = [];
          const traceCount = data[0].length - 1;

          for (let i = 0; i < traceCount; i++) {
            traces.push(data.map(row => row[i + 1]));
          }

          const sampleCount = time.length;

          resolve({ traces, time, traceCount, sampleCount });
        } catch (error) {
          reject(new Error('Failed to process seismic data from CSV.'));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    });
  });
};

export const generateSampleSeismicData = () => {
    const traceCount = 50;
    const sampleCount = 200;
    const dt = 0.004; // 4ms sample interval

    const time = Array.from({ length: sampleCount }, (_, i) => i * dt);
    const traces = [];

    // Generate some synthetic seismic data
    for (let i = 0; i < traceCount; i++) {
        const trace = new Array(sampleCount).fill(0);
        // Add some events (Ricker wavelets)
        addRicker(trace, 50, 25, 0.5, dt);
        addRicker(trace, 100 + Math.sin(i / 10) * 10, 25, -0.8, dt);
        addRicker(trace, 150 + Math.sin(i/5) * 5, 25, 0.6, dt);
        // Add some noise
        for (let j = 0; j < sampleCount; j++) {
            trace[j] += (Math.random() - 0.5) * 0.1;
        }
        traces.push(trace);
    }

    return { traces, time, traceCount, sampleCount };
};

function addRicker(trace, position, frequency, amplitude, dt) {
    const nc = Math.floor(position);
    for (let i = 0; i < trace.length; i++) {
        const t = (i - nc) * dt;
        const val = (1.0 - 2.0 * Math.pow(Math.PI * frequency * t, 2.0)) * Math.exp(-Math.pow(Math.PI * frequency * t, 2.0));
        trace[i] += val * amplitude;
    }
}
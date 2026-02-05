import { SegyReader } from 'segy-js';

/**
 * Parses a SEG-Y file from an ArrayBuffer.
 * @param {ArrayBuffer} arrayBuffer - The content of the SEG-Y file.
 * @param {function} progressCallback - A function to call with parsing progress.
 * @returns {Promise<Object>} A promise that resolves to a structured object with SEG-Y data.
 */
export const parseSegy = (arrayBuffer, progressCallback) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new SegyReader(arrayBuffer);
      
      // segy-js doesn't have a built-in progress callback during initial parsing,
      // as it's mostly synchronous. We can simulate it.
      progressCallback({ percent: 10, message: 'Reading file headers...' });
      
      const textHeader = reader.getTextHeader();
      const fileHeader = reader.getFileHeader();
      
      progressCallback({ percent: 30, message: 'Reading trace headers...' });
      const traceHeaders = [];
      for (let i = 0; i < reader.traceCount; i++) {
        traceHeaders.push(reader.getTraceHeader(i));
      }

      progressCallback({ percent: 60, message: 'Reading trace data...' });
      const traces = [];
      for (let i = 0; i < reader.traceCount; i++) {
        traces.push(reader.getTrace(i));
      }

      const sampleCount = fileHeader.samplesPerTrace;
      const sampleInterval = fileHeader.sampleInterval;
      const time = Array.from({ length: sampleCount }, (_, i) => i * (sampleInterval / 1000)); // Time in ms

      progressCallback({ percent: 100, message: 'Parsing complete.' });

      resolve({
        textHeader,
        binaryHeader: fileHeader,
        traceHeaders,
        traces,
        time,
        traceCount: reader.traceCount,
        sampleCount
      });

    } catch (error) {
      console.error("Failed to parse SEG-Y file:", error);
      reject(new Error("Invalid or unsupported SEG-Y file format. Check console for details."));
    }
  });
};
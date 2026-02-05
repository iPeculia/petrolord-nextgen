/**
 * Utility to export volumetric data
 */
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const DataExporter = {
    exportToCSV: (data, filename = 'volumetrics_data.csv') => {
        // Flatten data for CSV
        const flatData = [
            ['Metric', 'Value', 'Unit'],
            ['STOIIP', data.metrics.stoiip.toFixed(2), data.units.volume],
            ['Recoverable', data.metrics.recoverable.toFixed(2), data.units.volume],
            ['Date', new Date().toLocaleDateString(), '']
        ];
        
        const csvContent = flatData.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        saveAs(blob, filename);
    },

    exportToJSON: (data, filename = 'volumetrics_project.json') => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        saveAs(blob, filename);
    }
};
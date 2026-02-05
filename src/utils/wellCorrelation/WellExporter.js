import { saveAs } from 'file-saver';

export const WellExporter = {
    exportToJSON: (well) => {
        const blob = new Blob([JSON.stringify(well, null, 2)], { type: 'application/json' });
        saveAs(blob, `${well.name}_export.json`);
    },
    
    exportToCSV: (well) => {
        if (!well || !well.data) return;
        
        // Header
        const curveNames = well.curves.map(c => c.name).join(',');
        const header = `Depth,${curveNames}\n`;
        const units = `M,${well.curves.map(c => c.unit).join(',')}\n`;
        
        // Body
        const body = well.data.map(row => {
            // Assuming depth column is normalized or available
            const depth = row[well.metadata.depthColumn] || row.DEPT;
            const values = well.curves.map(c => row[c.name]).join(',');
            return `${depth},${values}`;
        }).join('\n');
        
        const blob = new Blob([header + units + body], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${well.name}_data.csv`);
    }
};
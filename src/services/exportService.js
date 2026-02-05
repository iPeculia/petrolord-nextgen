import * as XLSX from 'xlsx';

/**
 * Exports a summary of a petrophysical analysis to an Excel (.xlsx) file.
 * @param {object} analysis - The analysis object from the petrophysical store.
 */
export const exportPetrophysicalSummary = (analysis) => {
  if (!analysis) {
    console.error("Export failed: No analysis data provided.");
    return;
  }

  const wb = XLSX.utils.book_new();

  const summaryData = [
    ["Analysis Name", analysis.name || 'N/A'],
    ["Analysis Type", "Petrophysical Summary"],
    ["Date Exported", new Date().toLocaleDateString()],
    [], 
    ["Key Calculated Properties"],
    ["Property", "Value", "Unit"],
    ["Porosity", analysis.calculations?.porosity?.toFixed(4) || 'N/A', 'v/v'],
    ["Permeability", analysis.calculations?.permeability?.toFixed(2) || 'N/A', 'mD'],
    ["Water Saturation", analysis.calculations?.saturation?.toFixed(4) || 'N/A', 'v/v'],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  const params = analysis.parameters || {};
  const paramsData = [
      ["Input Parameters"],
      ["Parameter", "Value"],
      ...Object.entries(params).map(([key, value]) => [key, value])
  ];
  const wsParams = XLSX.utils.aoa_to_sheet(paramsData);
  XLSX.utils.book_append_sheet(wb, wsParams, "Parameters");

  XLSX.writeFile(wb, `${analysis.name || 'PetroAnalysis'}_Summary.xlsx`);
};

/**
 * Export well data to CSV or JSON
 * @param {object} well - Well metadata
 * @param {object} logs - Well logs object { logName: { depth, values, unit } }
 * @param {string} format - 'csv' or 'json'
 */
export const exportWellData = (well, logs, format = 'csv') => {
    if (!well || !logs) {
        console.error("Export failed: Missing well or logs data.");
        return;
    }

    if (format === 'json') {
        const exportObj = {
            well: well,
            logs: logs,
            exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${well.name || 'well'}_data.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } else {
        // CSV Export
        // 1. Create Header with Metadata
        const wb = XLSX.utils.book_new();
        
        const metadataRows = [
            ["Well Name", well.name],
            ["Operator", well.metadata?.operator || 'N/A'],
            ["Field", well.metadata?.field || 'N/A'],
            ["Date Exported", new Date().toLocaleDateString()],
            [] // Spacer
        ];

        // 2. Prepare log data columns
        // Get all unique depths combined or just use first log's depth if aligned
        // For simplicity, assuming logs are aligned or we take the first one as reference
        const logKeys = Object.keys(logs);
        if (logKeys.length === 0) return;

        const referenceLog = logs[logKeys[0]];
        const depths = referenceLog.depth_array || referenceLog.depth;
        
        const tableHeader = ["Depth", ...logKeys.map(k => `${k} (${logs[k].unit || '-'})`)];
        
        const tableData = [];
        depths.forEach((d, i) => {
            const row = [d];
            logKeys.forEach(key => {
                const valArr = logs[key].value_array || logs[key].values;
                row.push(valArr[i]);
            });
            tableData.push(row);
        });

        const wsData = [...metadataRows, tableHeader, ...tableData];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Well Data");
        XLSX.writeFile(wb, `${well.name || 'well'}_data.csv`);
    }
};

export const exportCrossModuleReport = () => {
  console.log("Generating and exporting cross-module report...");
};
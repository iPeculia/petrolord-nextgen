import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const ImportReportGenerator = {
  /**
   * Generates and downloads a CSV report for an import
   * @param {Object} importData - The import object containing records
   * @param {Array} records - Array of record objects
   * @param {string} fileName - Optional custom filename
   */
  generateAndDownload(importData, records, fileName = null) {
    if (!records || !records.length) return;

    // Flatten data for CSV
    const csvData = records.map(record => {
      // Parse row_data if it's a string, otherwise use as is
      const rowData = typeof record.row_data === 'string' 
        ? JSON.parse(record.row_data) 
        : record.row_data;

      return {
        'Import ID': importData.id,
        'Import Date': new Date(importData.created_at).toLocaleString(),
        'Status': record.status,
        'Error Message': record.error_message || '',
        'Email': rowData.email || '',
        'First Name': rowData.first_name || '',
        'Last Name': rowData.last_name || '',
        'User Type': rowData.user_type || rowData.role || '',
        'Department': rowData.department || '',
        'Processed At': new Date(record.created_at).toLocaleString()
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const finalName = fileName || `import_report_${importData.id}_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, finalName);
  }
};
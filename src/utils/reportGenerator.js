import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import Papa from 'papaparse';

export const ReportGenerator = {
  exportToCSV(data, filename = 'report.csv') {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  },

  exportToPDF(title, columns, data, filename = 'report.pdf') {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }, // Dark slate
    });

    doc.save(filename);
  },

  async downloadBulkReports(importIds) {
    // In a real app, this would trigger a backend job
    // For now, we'll simulate it or handle small batches client side
    console.log("Downloading reports for:", importIds);
    // Implementation would call the edge function
  }
};
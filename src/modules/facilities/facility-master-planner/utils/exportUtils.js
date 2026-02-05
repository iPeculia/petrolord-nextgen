import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Exports data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Exports data to Excel
 * @param {Object} sheets - Object where keys are sheet names and values are data arrays
 * @param {string} filename - Filename without extension
 */
export const exportToExcel = (sheets, filename) => {
  const workbook = XLSX.utils.book_new();
  
  Object.entries(sheets).forEach(([sheetName, data]) => {
    if (data && data.length) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31)); // Excel limit
    }
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Captures a DOM element as PNG
 * @param {string} elementId - ID of the DOM element
 * @param {string} filename - Filename without extension
 */
export const exportChartToPNG = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#1e293b' }); // Dark background for dark mode charts
    canvas.toBlob((blob) => {
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.png`);
    });
  } catch (error) {
    console.error('Export to PNG failed:', error);
  }
};

/**
 * Generates a full PDF report
 * @param {Object} reportData - Data for the report
 * @param {string} reportTitle - Title of the report
 */
export const generatePDFReport = async (reportData, reportTitle, elementIdsToCapture = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text(reportTitle, 14, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
  yPos += 20;

  // Key Metrics Table
  if (reportData.metrics) {
      doc.setFontSize(14);
      doc.text("Key Metrics", 14, yPos);
      yPos += 10;
      
      const metricsData = Object.entries(reportData.metrics).map(([key, value]) => [key, value]);
      autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: metricsData,
          theme: 'grid'
      });
      yPos = doc.lastAutoTable.finalY + 20;
  }

  // Recommendations Table
  if (reportData.recommendations) {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setFontSize(14);
      doc.text("Recommendations", 14, yPos);
      yPos += 10;

      const recData = reportData.recommendations.map(r => [r.risk_name, r.mitigation_strategy, r.risk_severity]);
      autoTable(doc, {
          startY: yPos,
          head: [['Risk/Issue', 'Mitigation', 'Severity']],
          body: recData,
          theme: 'striped'
      });
      yPos = doc.lastAutoTable.finalY + 20;
  }

  // Charts Screenshots
  for (const id of elementIdsToCapture) {
      const element = document.getElementById(id);
      if (element) {
          if (yPos > 200) { doc.addPage(); yPos = 20; }
          try {
              const canvas = await html2canvas(element, { scale: 1.5, backgroundColor: '#ffffff' });
              const imgData = canvas.toDataURL('image/png');
              const imgProps = doc.getImageProperties(imgData);
              const pdfWidth = pageWidth - 28;
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              
              doc.addImage(imgData, 'PNG', 14, yPos, pdfWidth, pdfHeight);
              yPos += pdfHeight + 10;
          } catch (e) {
              console.warn(`Could not capture element ${id}`, e);
          }
      }
  }

  doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
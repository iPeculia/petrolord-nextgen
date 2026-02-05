import jsPDF from 'jspdf';

export const exportToPNG = (canvasElement, filename = 'correlation.png') => {
  return new Promise((resolve, reject) => {
    if (!canvasElement) {
      reject(new Error("Canvas element not found."));
      return;
    }
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvasElement.toDataURL('image/png');
    link.click();
    resolve();
  });
};

export const exportToPDF = (canvasElement, filename = 'correlation.pdf') => {
  return new Promise((resolve, reject) => {
    if (!canvasElement) {
      reject(new Error("Canvas element not found."));
      return;
    }
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvasElement.width, canvasElement.height]
    });
    const imgData = canvasElement.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvasElement.width, canvasElement.height);
    pdf.save(filename);
    resolve();
  });
};

export const exportToSVG = (panelData, filename = 'correlation.svg') => {
  // This is a complex implementation and is marked as WIP.
  console.warn("Export to SVG is not fully implemented.");
  return Promise.reject(new Error("Export to SVG is a work in progress."));
};

export const exportToCSV = (panelData, filename = 'correlation.csv') => {
  // This is a complex implementation and is marked as WIP.
  console.warn("Export to CSV is not fully implemented.");
  return Promise.reject(new Error("Export to CSV is a work in progress."));
};
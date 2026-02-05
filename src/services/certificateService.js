import jsPDF from 'jspdf';

export const certificateService = {
  generatePDF: (certificate, studentName, courseTitle, moduleName) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background color
    doc.setFillColor(20, 30, 40); // Dark Slate/Navy
    doc.rect(0, 0, 297, 210, 'F');

    // Ornamental Border
    doc.setLineWidth(2);
    doc.setDrawColor(191, 255, 0); // Petrolord Lime #BFFF00
    doc.rect(10, 10, 277, 190);
    
    // Inner Thin Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 255, 255);
    doc.rect(15, 15, 267, 180);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(191, 255, 0); // Lime
    doc.text("CERTIFICATE OF COMPLETION", 148.5, 50, { align: "center" });

    // Subheader
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(200, 200, 200);
    doc.text("This certifies that", 148.5, 70, { align: "center" });

    // Student Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text(studentName, 148.5, 90, { align: "center" });
    
    // Line under name
    doc.setDrawColor(100, 100, 100);
    doc.line(70, 95, 227, 95);

    // Course Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(200, 200, 200);
    doc.text("has successfully completed the course", 148.5, 110, { align: "center" });

    // Course Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(191, 255, 0);
    doc.text(courseTitle, 148.5, 125, { align: "center" });

    // Module
    if (moduleName) {
        doc.setFontSize(14);
        doc.setTextColor(180, 180, 180);
        doc.text(`Module: ${moduleName}`, 148.5, 135, { align: "center" });
    }

    // Score & Date
    const dateStr = new Date(certificate.issued_date).toLocaleDateString();
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`Completed on ${dateStr} • Score: ${certificate.final_grade || 'N/A'}%`, 148.5, 150, { align: "center" });

    // Footer / Verification
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Certificate ID: ${certificate.certificate_number}`, 148.5, 185, { align: "center" });
    doc.text("Verified by Petrolord NextGen Suite", 148.5, 190, { align: "center" });

    // Logo Placeholder (Text for now)
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("PETROLORD", 20, 195);

    doc.save(`Certificate_${certificate.certificate_number}.pdf`);
  }
};
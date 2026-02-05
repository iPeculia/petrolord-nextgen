import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { FileText, Download, Table, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const ReportGenerator = () => {
    const { currentProject, currentWell } = useDeclineCurve();
    const [reportType, setReportType] = useState('well_summary');
    const [includeCharts, setIncludeCharts] = useState(true);

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text("Decline Curve Analysis Report", 14, 20);
        
        doc.setFontSize(10);
        doc.text(`Project: ${currentProject?.name || 'N/A'}`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

        if (reportType === 'well_summary' && currentWell) {
            doc.setFontSize(14);
            doc.text(`Well Summary: ${currentWell.name}`, 14, 50);

            // Table of Data
            const tableData = [
                ['Parameter', 'Value'],
                ['Formation', currentWell.metadata?.formation || 'N/A'],
                ['Data Points', currentWell.data?.length || 0],
                ['Last Rate', currentWell.data?.length > 0 ? currentWell.data[currentWell.data.length-1].oilRate : 'N/A']
            ];

            doc.autoTable({
                startY: 55,
                head: [tableData[0]],
                body: tableData.slice(1),
            });
            
            // Scenarios Table
            const scenarios = currentProject.scenarios || [];
            if (scenarios.length > 0) {
                 const scenarioData = scenarios.map(s => [
                     s.name, 
                     s.results?.modelType || '-',
                     s.results?.metrics?.eur ? (s.results.metrics.eur/1000).toFixed(1) + 'k' : '-'
                 ]);
                 
                 doc.text("Scenarios & Forecasts", 14, doc.lastAutoTable.finalY + 15);
                 doc.autoTable({
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['Scenario Name', 'Model', 'EUR (bbl)']],
                    body: scenarioData
                 });
            }
        }

        doc.save(`${reportType}_report.pdf`);
    };

    const generateCSV = () => {
        if (!currentWell || !currentWell.data) return;
        
        const csv = Papa.unparse(currentWell.data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${currentWell.name}_production_data.csv`);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
             <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300">Report & Export Center</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PDF Reports */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-2">
                            <FileText className="w-4 h-4 text-red-400" />
                            <h3>PDF Reports</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Report Type</label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value="well_summary">Single Well Summary</SelectItem>
                                        <SelectItem value="project_summary">Project Overview</SelectItem>
                                        <SelectItem value="reserves_report">Reserves Booking Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                                <label htmlFor="charts" className="text-sm text-slate-300">Include Charts & Plots</label>
                            </div>

                            <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={generatePDF}>
                                <Download className="w-4 h-4 mr-2" /> Generate PDF
                            </Button>
                        </div>
                    </div>

                    {/* Data Exports */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-2">
                            <FileSpreadsheet className="w-4 h-4 text-green-400" />
                            <h3>Data Export</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" className="justify-start border-slate-700 text-slate-300 hover:bg-slate-800" onClick={generateCSV}>
                                <Table className="w-4 h-4 mr-2 text-blue-400" /> Export Well Data (CSV)
                            </Button>
                            <Button variant="outline" className="justify-start border-slate-700 text-slate-300 hover:bg-slate-800">
                                <Table className="w-4 h-4 mr-2 text-green-400" /> Export Forecast Parameters (JSON)
                            </Button>
                            <Button variant="outline" className="justify-start border-slate-700 text-slate-300 hover:bg-slate-800">
                                <Table className="w-4 h-4 mr-2 text-amber-400" /> Export Project Archive (Zip)
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportGenerator;
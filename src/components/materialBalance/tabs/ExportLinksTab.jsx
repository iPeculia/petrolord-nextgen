import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, Link as LinkIcon, ExternalLink, Activity, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportLinksTab = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { 
        productionHistory, 
        pressureData, 
        pvtTables, 
        currentProject, 
        tankParameters,
        diagnosticStats,
        modelFitting
    } = useMaterialBalance();

    const handleExport = (type) => {
        const filename = `MBA_${currentProject?.name || 'Project'}_${new Date().toISOString().slice(0,10)}`;

        try {
            switch (type) {
                case "Excel":
                    exportToExcel(filename);
                    break;
                case "CSV":
                    exportToCSV(filename);
                    break;
                case "JSON":
                    exportToJSON(filename);
                    break;
                case "Summary Report":
                case "Diagnostic Report":
                case "Full Technical Report":
                    generatePDFReport(type, filename);
                    break;
                default:
                    toast({ title: "Not Implemented", description: `${type} is coming soon.` });
            }
        } catch (error) {
            console.error("Export Error:", error);
            toast({ title: "Export Failed", description: error.message, variant: "destructive" });
        }
    };

    // --- Export Implementations ---

    const exportToExcel = (filename) => {
        const wb = XLSX.utils.book_new();

        // 1. Production Data
        if (productionHistory.length > 0) {
            const wsProd = XLSX.utils.json_to_sheet(productionHistory);
            XLSX.utils.book_append_sheet(wb, wsProd, "Production");
        }

        // 2. Pressure Data
        if (pressureData.length > 0) {
            const wsPres = XLSX.utils.json_to_sheet(pressureData);
            XLSX.utils.book_append_sheet(wb, wsPres, "Pressure");
        }

        // 3. Parameters
        const paramsData = Object.entries(tankParameters).map(([k, v]) => ({ Parameter: k, Value: v }));
        const wsParams = XLSX.utils.json_to_sheet(paramsData);
        XLSX.utils.book_append_sheet(wb, wsParams, "Parameters");

        // 4. Diagnostics (if available)
        if (Object.keys(diagnosticStats).length > 0) {
             const diagData = Object.entries(diagnosticStats).map(([k, v]) => ({ 
                 Plot: k, 
                 Slope: v.slope, 
                 Intercept: v.intercept, 
                 R2: v.r2 
             }));
             const wsDiag = XLSX.utils.json_to_sheet(diagData);
             XLSX.utils.book_append_sheet(wb, wsDiag, "Diagnostics");
        }

        XLSX.writeFile(wb, `${filename}.xlsx`);
        toast({ title: "Export Successful", description: "Excel file generated." });
    };

    const exportToCSV = (filename) => {
        // Merges production and pressure for a flat CSV
        const data = productionHistory.map((row, i) => ({
            ...row,
            pressure: pressureData[i]?.pressure || ''
        }));
        
        const ws = XLSX.utils.json_to_sheet(data);
        const csvOutput = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8" });
        saveAs(blob, `${filename}.csv`);
        toast({ title: "Export Successful", description: "CSV file generated." });
    };

    const exportToJSON = (filename) => {
        const fullData = {
            project: currentProject,
            parameters: tankParameters,
            production: productionHistory,
            pressure: pressureData,
            pvt: pvtTables,
            diagnostics: diagnosticStats,
            exportedAt: new Date()
        };
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
        saveAs(blob, `${filename}.json`);
        toast({ title: "Export Successful", description: "JSON file generated." });
    };

    const generatePDFReport = (reportType, filename) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Header
        doc.setFontSize(18);
        doc.setTextColor(40, 44, 52);
        doc.text(reportType, 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Project: ${currentProject?.name || 'Untitled'}`, 14, 32);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
        
        let yPos = 50;

        // Section: Parameters
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Reservoir Parameters", 14, yPos);
        yPos += 6;
        
        const paramRows = Object.entries(tankParameters).map(([k, v]) => [k, String(v)]);
        doc.autoTable({
            startY: yPos,
            head: [['Parameter', 'Value']],
            body: paramRows,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });
        yPos = doc.lastAutoTable.finalY + 15;

        // Section: Diagnostics (if strictly requested or full report)
        if (reportType !== "Summary Report") {
             doc.text("Diagnostic Analysis", 14, yPos);
             yPos += 6;
             const diagRows = Object.entries(diagnosticStats).map(([k, v]) => [k, v.slope?.toExponential(3), v.r2?.toFixed(4)]);
             doc.autoTable({
                startY: yPos,
                head: [['Plot Type', 'Slope (N)', 'R²']],
                body: diagRows,
                theme: 'striped'
            });
        }

        doc.save(`${filename}_${reportType.replace(/\s/g, '')}.pdf`);
        toast({ title: "Report Generated", description: "PDF report downloaded." });
    };

    const handleShare = () => {
         const url = window.location.href;
         navigator.clipboard.writeText(url);
         toast({
            title: "Link Copied",
            description: "Project link copied to clipboard.",
        });
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export Data Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white"><Download className="mr-2 h-5 w-5 text-[#BFFF00]" /> Export Data</CardTitle>
                        <CardDescription>Download project data in various formats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => handleExport("Excel")}>
                                <FileText className="mr-2 h-4 w-4 text-green-500" /> Excel (.xlsx)
                            </Button>
                            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => handleExport("CSV")}>
                                <FileText className="mr-2 h-4 w-4 text-blue-400" /> CSV (.csv)
                            </Button>
                            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => handleExport("JSON")}>
                                <FileText className="mr-2 h-4 w-4 text-yellow-500" /> JSON (.json)
                            </Button>
                            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300" disabled title="Requires Backend">
                                <FileText className="mr-2 h-4 w-4 text-purple-500" /> RESQML (.xml)
                            </Button>
                        </div>
                        
                        <Separator className="bg-slate-800 my-4" />
                        
                        <div className="space-y-2">
                             <h4 className="text-sm font-medium text-slate-400">Data Included</h4>
                             <div className="flex flex-wrap gap-2">
                                {['Production', 'Pressure', 'PVT', 'Diagnostics', 'Results'].map(item => (
                                    <span key={item} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-300 cursor-default">
                                        {item}
                                    </span>
                                ))}
                             </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Generate Reports Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white"><FileText className="mr-2 h-5 w-5 text-blue-400" /> Reports</CardTitle>
                        <CardDescription>Generate comprehensive PDF reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700" onClick={() => handleExport("Summary Report")}>
                            <span>Executive Summary</span>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700" onClick={() => handleExport("Diagnostic Report")}>
                            <span>Diagnostic Analysis Report</span>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700" onClick={() => handleExport("Full Technical Report")}>
                            <span>Full Technical Report (PDF)</span>
                            <Download className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Links to Other Modules */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center text-white"><LinkIcon className="mr-2 h-5 w-5 text-orange-400" /> Integrated Modules</CardTitle>
                    <CardDescription>Directly access related analysis tools with current data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                            className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-[#BFFF00]/50 cursor-pointer transition-colors group"
                            onClick={() => navigate('/volumetrics-pro')}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-blue-500/10 p-2 rounded">
                                    <PieChart className="h-6 w-6 text-blue-400" />
                                </div>
                                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </div>
                            <h4 className="font-semibold text-white">Volumetrics</h4>
                            <p className="text-xs text-slate-400 mt-1">Estimate STOIIP/GIIP using Monte Carlo simulation.</p>
                        </div>

                        <div 
                            className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-[#BFFF00]/50 cursor-pointer transition-colors group"
                            onClick={() => navigate('/modules/economics')}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-green-500/10 p-2 rounded">
                                    <DollarSign className="h-6 w-6 text-green-400" />
                                </div>
                                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </div>
                            <h4 className="font-semibold text-white">PetroEconomics</h4>
                            <p className="text-xs text-slate-400 mt-1">Run cash flow analysis and economic indicators.</p>
                        </div>

                        <div 
                            className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-[#BFFF00]/50 cursor-pointer transition-colors group"
                            onClick={() => navigate('/modules/production')}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-purple-500/10 p-2 rounded">
                                    <TrendingUp className="h-6 w-6 text-purple-400" />
                                </div>
                                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </div>
                            <h4 className="font-semibold text-white">Decline Curve Analysis</h4>
                            <p className="text-xs text-slate-400 mt-1">Forecast future production using decline curves.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

             {/* Sharing */}
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center text-white"><Share2 className="mr-2 h-5 w-5 text-pink-400" /> Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center gap-4">
                        <Button className="bg-[#BFFF00] text-black hover:bg-[#BFFF00]/90" onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" /> Copy Project Link
                        </Button>
                        <p className="text-sm text-slate-500">
                            Share this project configuration with team members.
                        </p>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default ExportLinksTab;
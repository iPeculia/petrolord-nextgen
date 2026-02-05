import React from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import { generateQCReportPDF, exportQCCSV } from '@/modules/geoscience/petrophysical-analysis/utils/qcReportUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, FileDigit, Zap } from 'lucide-react';

const ReportsExportView = () => {
  const { qcResults, issues, activeWellName } = useQC();
  const curveCount = Object.keys(qcResults).length;

  const handleDownloadPDF = () => {
      generateQCReportPDF(activeWellName || 'Unknown Well', qcResults, issues);
  };

  const handleExportCSV = () => {
      exportQCCSV(activeWellName || 'Unknown Well', qcResults, issues);
  };

  if (curveCount === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <FileText className="w-12 h-12 mb-4 opacity-20" />
             <p>Run QC Analysis first to generate reports.</p>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
        
        <div className="flex flex-col gap-2 text-center mb-8">
            <h2 className="text-2xl font-bold text-white">QC Report Generation</h2>
            <p className="text-slate-400">Export analysis findings and certificates for well <span className="text-emerald-400 font-mono font-semibold text-lg">{activeWellName}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Report Card */}
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-red-400" />
                    </div>
                    <CardTitle className="text-white">Formal QC Certificate</CardTitle>
                    <CardDescription>Comprehensive PDF report suitable for archiving and stakeholders.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="space-y-2 bg-slate-950/50 p-4 rounded border border-slate-800">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Summary for {activeWellName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Metrics Table ({curveCount} curves)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Issues List ({issues.length} detected)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Digital Signature Placeholder
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-red-600 hover:bg-red-500 text-white" onClick={handleDownloadPDF}>
                        <Download className="w-4 h-4 mr-2" /> Download PDF Report
                    </Button>
                </CardFooter>
            </Card>

            {/* CSV Export Card */}
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                        <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                    </div>
                    <CardTitle className="text-white">Raw Data Export</CardTitle>
                    <CardDescription>CSV format for further analysis in Excel or Python.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                     <div className="space-y-2 bg-slate-950/50 p-4 rounded border border-slate-800">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <FileDigit className="w-4 h-4 text-blue-400" /> Raw Metric Values
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <AlertTriangle className="w-4 h-4 text-amber-400" /> Full Outlier Lists
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Zap className="w-4 h-4 text-purple-400" /> Statistics (Mean, StdDev, etc.)
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV Data
                    </Button>
                </CardFooter>
            </Card>
        </div>

        {/* Report Preview Section - Visual Summary */}
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Preview Summary for {activeWellName}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-slate-950 rounded border border-slate-800">
                        <p className="text-3xl font-bold text-white">{curveCount}</p>
                        <p className="text-xs text-slate-500 mt-1">Curves</p>
                    </div>
                     <div className="p-4 bg-slate-950 rounded border border-slate-800">
                        <p className="text-3xl font-bold text-amber-400">{issues.filter(i => i.severity === 'High').length}</p>
                        <p className="text-xs text-slate-500 mt-1">Critical Flags</p>
                    </div>
                     <div className="p-4 bg-slate-950 rounded border border-slate-800">
                        <p className="text-3xl font-bold text-blue-400">{issues.length}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Issues</p>
                    </div>
                     <div className="p-4 bg-slate-950 rounded border border-slate-800">
                        <p className="text-3xl font-bold text-emerald-400">Ready</p>
                        <p className="text-xs text-slate-500 mt-1">Status</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default ReportsExportView;
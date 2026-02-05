import React, { useState, useEffect } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { generateReportData, exportToPDF } from '../../utils/reportGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Printer, Loader2, AlertCircle, LayoutTemplate } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ReportsTabContent = () => {
    const { activeWell, wells, wellLogs } = useGlobalDataStore();
    const [selectedTemplate, setSelectedTemplate] = useState('well_summary');
    const [reportData, setReportData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Get full well object from ID
    const well = activeWell ? wells[activeWell] : null;

    useEffect(() => {
        if (well) {
            handleGeneratePreview();
        }
    }, [well, selectedTemplate]);

    const handleGeneratePreview = () => {
        setIsGenerating(true);
        // Simulate slight delay for effect
        setTimeout(() => {
            const data = generateReportData(well, wellLogs, selectedTemplate);
            setReportData(data);
            setIsGenerating(false);
        }, 500);
    };

    const handleExport = () => {
        if (reportData) {
            exportToPDF(reportData);
        }
    };

    if (!well) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950 p-8">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-slate-300">No Well Selected</h3>
                <p className="text-sm">Please select a well from the Data Panel to generate reports.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-slate-950 gap-6 p-4">
            {/* Configuration Panel */}
            <div className="w-80 shrink-0 flex flex-col gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4 text-[#BFFF00]" />
                            Report Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">Report Template</label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="well_summary">Well Summary Report</SelectItem>
                                    <SelectItem value="curve_statistics">Curve Statistics Analysis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs space-y-2">
                            <div className="flex justify-between text-slate-400">
                                <span>Target Well</span>
                                <span className="text-white font-medium">{well.name}</span>
                            </div>
                             <div className="flex justify-between text-slate-400">
                                <span>Curves Available</span>
                                <span className="text-white font-medium">{wellLogs[well.id] ? Object.keys(wellLogs[well.id]).length : 0}</span>
                            </div>
                        </div>

                        <Button 
                            onClick={handleGeneratePreview} 
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                            Refresh Preview
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Download className="w-4 h-4 text-blue-400" />
                            Export Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button onClick={handleExport} className="w-full bg-[#BFFF00] hover:bg-[#a6dd00] text-black font-medium">
                            Download PDF Report
                        </Button>
                        <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                            Export CSV Data
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Live Preview Panel */}
            <div className="flex-1 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-w-4xl mx-auto border border-slate-800">
                {/* Paper Toolbar */}
                <div className="bg-slate-100 border-b border-slate-300 p-2 flex justify-between items-center shrink-0">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">Print Preview - A4</span>
                    <div className="flex gap-1">
                         <Button variant="ghost" size="sm" className="h-8 text-slate-600 hover:bg-slate-200">
                            <Printer className="w-4 h-4" />
                         </Button>
                    </div>
                </div>

                {/* Report Page Content */}
                <ScrollArea className="flex-1 bg-slate-500/10 p-8">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                            <Loader2 className="w-10 h-10 mb-4 animate-spin text-blue-500" />
                            <p>Generating Report...</p>
                        </div>
                    ) : reportData ? (
                        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-lg p-[20mm] text-slate-900">
                            {/* Report Header */}
                            <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PETROLORD</h1>
                                    <p className="text-sm text-slate-500 font-medium">INTELLIGENT ENERGY SUITE</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Generated Report</div>
                                    <div className="font-mono text-sm">{reportData.generatedAt}</div>
                                </div>
                            </div>

                            {/* Report Title */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-blue-900 mb-2">{reportData.title}</h2>
                                <h3 className="text-lg text-slate-500">{reportData.subtitle}</h3>
                            </div>

                            {/* Well Info Block */}
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-8 grid grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Well Name</span>
                                    <span className="block font-mono text-lg font-semibold">{reportData.wellName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Operator</span>
                                    <span className="block font-medium">{reportData.operator}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Field / Location</span>
                                    <span className="block font-medium">{reportData.field}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Depth Range</span>
                                    <span className="block font-medium">{reportData.depthRange}</span>
                                </div>
                            </div>

                            {/* Dynamic Sections */}
                            {reportData.sections?.map((section, idx) => (
                                <div key={idx} className="mb-8">
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">
                                        {section.title}
                                    </h4>
                                    
                                    {section.type === 'key_value' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(section.data).map(([k, v]) => (
                                                <div key={k} className="flex justify-between border-b border-slate-100 py-2">
                                                    <span className="text-sm font-medium text-slate-600">{k}</span>
                                                    <span className="text-sm font-bold text-slate-900">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.type === 'table' && (
                                        <div className="overflow-hidden rounded border border-slate-200">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                                                    <tr>
                                                        {section.headers.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {section.rows.map((row, rI) => (
                                                        <tr key={rI} className={rI % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                            {row.map((cell, cI) => <td key={cI} className="px-4 py-2">{cell}</td>)}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Footer */}
                            <div className="mt-20 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                                <p>This report is confidential and intended solely for the use of the individual or entity to whom it is addressed.</p>
                                <p className="mt-1">Generated by PetroLord NextGen Suite</p>
                            </div>
                        </div>
                    ) : null}
                </ScrollArea>
            </div>
        </div>
    );
};

export default ReportsTabContent;
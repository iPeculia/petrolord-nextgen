import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, FileSpreadsheet, Presentation, File, Download, Calendar, Share2, LayoutTemplate, Printer, Archive } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generatePetrophysicalReport } from '../../services/reportService'; // Assume this exists or reuse from before

const ReportingExportTab = () => {
    const [activeTab, setActiveTab] = useState('generate');
    const { toast } = useToast();
    
    const [reportType, setReportType] = useState('full_analysis');
    const [format, setFormat] = useState('pdf');
    
    // Sections State
    const [sections, setSections] = useState({
        summary: true,
        parameters: true,
        plots: true,
        crossplots: true,
        tables: true,
        methodology: false
    });

    const handleSectionToggle = (key) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleGenerate = () => {
        toast({ 
            title: "Generating Report...", 
            description: `Preparing ${reportType} in ${format.toUpperCase()} format.` 
        });
        
        // Simulate async generation
        setTimeout(() => {
            toast({ 
                title: "Report Ready", 
                description: "Download has started automatically." 
            });
            
            // Trigger actual download function here if real data was connected
            // generatePetrophysicalReport('Demo Well 1', { parameters: {}, calculations: {} }); 
        }, 1500);
    };

    const reportsHistory = [
        { id: 1, name: 'Well-001 Final Analysis', type: 'Full Analysis', date: '2024-12-01', format: 'PDF' },
        { id: 2, name: 'Field A Overview', type: 'Summary', date: '2024-11-28', format: 'PPTX' },
        { id: 3, name: 'Log QC Report', type: 'QC', date: '2024-11-25', format: 'Excel' }
    ];

    return (
        <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Advanced Reporting</h2>
                        <p className="text-xs text-slate-400">Generate, schedule, and export professional reports</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <TabsList className="bg-slate-900 border border-slate-800 w-fit mb-6">
                        <TabsTrigger value="generate" className="flex items-center gap-2"><Printer className="w-4 h-4" /> Report Builder</TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2"><Archive className="w-4 h-4" /> History</TabsTrigger>
                        <TabsTrigger value="templates" className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Templates</TabsTrigger>
                        <TabsTrigger value="schedule" className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Scheduled</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="flex-1 mt-0 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
                            {/* Left Config Panel */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardHeader><CardTitle className="text-white">Report Configuration</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Report Type</Label>
                                                <Select value={reportType} onValueChange={setReportType}>
                                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="full_analysis">Full Analysis Report</SelectItem>
                                                        <SelectItem value="executive_summary">Executive Summary</SelectItem>
                                                        <SelectItem value="qc_report">Data QC Report</SelectItem>
                                                        <SelectItem value="quick_look">Quick Look Interpretation</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Export Format</Label>
                                                <Select value={format} onValueChange={setFormat}>
                                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                                        <SelectItem value="xlsx">Excel Workbook</SelectItem>
                                                        <SelectItem value="docx">Word Document</SelectItem>
                                                        <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Content Sections</Label>
                                            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                                                {Object.entries(sections).map(([key, checked]) => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox id={key} checked={checked} onCheckedChange={() => handleSectionToggle(key)} />
                                                        <Label htmlFor={key} className="capitalize cursor-pointer">{key.replace('_', ' ')}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Report Title</Label>
                                            <Input placeholder="e.g. Petrophysical Evaluation - Well 001" className="bg-slate-950 border-slate-700" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Action Panel */}
                            <div className="space-y-6">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardHeader><CardTitle className="text-white">Export Actions</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button onClick={handleGenerate} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg">
                                            <Download className="w-5 h-5 mr-2" /> Generate & Download
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" className="border-slate-700 text-slate-300">
                                                <Share2 className="w-4 h-4 mr-2" /> Share
                                            </Button>
                                            <Button variant="outline" className="border-slate-700 text-slate-300">
                                                <Calendar className="w-4 h-4 mr-2" /> Schedule
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-900 border-slate-800">
                                    <CardHeader><CardTitle className="text-white">Preview</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="aspect-[1/1.4] bg-white rounded shadow-sm p-4">
                                            <div className="w-full h-4 bg-slate-200 mb-4"></div>
                                            <div className="w-2/3 h-4 bg-slate-200 mb-8"></div>
                                            <div className="space-y-2">
                                                <div className="w-full h-2 bg-slate-100"></div>
                                                <div className="w-full h-2 bg-slate-100"></div>
                                                <div className="w-full h-2 bg-slate-100"></div>
                                            </div>
                                            <div className="mt-8 w-full h-32 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                                [Chart Placeholder]
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-slate-500 mt-2">Preview of cover page layout</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 mt-0 overflow-hidden">
                        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                            <CardHeader><CardTitle className="text-white">Report History</CardTitle></CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full">
                                    <div className="space-y-1 p-6 pt-0">
                                        {reportsHistory.map(report => (
                                            <div key={report.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-slate-800 rounded text-slate-400">
                                                        {report.format === 'PDF' ? <FileText className="w-5 h-5" /> : 
                                                         report.format === 'PPTX' ? <Presentation className="w-5 h-5" /> : 
                                                         <FileSpreadsheet className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{report.name}</h4>
                                                        <p className="text-xs text-slate-500">{report.type} • {report.date}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="templates" className="flex-1 mt-0">
                        <div className="flex items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                            Templates Library Coming Soon
                        </div>
                    </TabsContent>

                    <TabsContent value="schedule" className="flex-1 mt-0">
                         <div className="flex items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                            No Scheduled Reports Configured
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ReportingExportTab;
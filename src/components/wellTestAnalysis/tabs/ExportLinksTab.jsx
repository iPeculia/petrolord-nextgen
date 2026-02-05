import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Printer, Share2, FileSpreadsheet, FileImage, Link as LinkIcon, ArrowRight, Table } from 'lucide-react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { generateResultSummary } from '@/utils/wellTestAnalysis/resultSummary';
import { useNavigate } from 'react-router-dom';

const ExportLinksTab = () => {
    const { state, log } = useWellTestAnalysisContext();
    const navigate = useNavigate();

    const handleDownload = (format) => {
        try {
            const summary = generateResultSummary(state);
            let content, type, extension;

            if (format === 'json') {
                content = JSON.stringify(summary, null, 2);
                type = 'application/json';
                extension = 'json';
            } else if (format === 'csv') {
                // Simple flatten for CSV
                content = `Property,Value\nWell,${summary.meta.well}\nPermeability,${summary.results.permeability}\nSkin,${summary.results.skin}\n`;
                type = 'text/csv';
                extension = 'csv';
            }

            if (content) {
                const blob = new Blob([content], { type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `WTA_Report_${new Date().toISOString().slice(0,10)}.${extension}`;
                a.click();
                log(`Report exported as ${format.toUpperCase()}`, 'success');
            } else {
                log(`${format.toUpperCase()} export simulation started...`, 'info');
            }
        } catch (e) {
            log('Export failed: ' + e.message, 'error');
        }
    };

    const integrations = [
        { 
            title: "Material Balance", 
            desc: "Export reservoir pressure and properties to MB for drive mechanism analysis.",
            icon: Table,
            path: "/material-balance",
            color: "text-emerald-400"
        },
        { 
            title: "Decline Curve Analysis", 
            desc: "Use calculated permeability and skin to constrain DCA forecasts.",
            icon: TrendingUpIcon, 
            path: "/decline-curve-analysis",
            color: "text-blue-400"
        },
        { 
            title: "Well Correlation", 
            desc: "Correlate test results with log-derived properties across the field.",
            icon: ActivityIcon, 
            path: "/modules/geoscience/well-log-correlation",
            color: "text-purple-400"
        }
    ];

    return (
        <div className="p-6 h-full overflow-y-auto bg-slate-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                
                {/* Export Section */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileDown className="w-5 h-5 text-[#BFFF00]" />
                                Report Generation
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Generate comprehensive reports of your analysis results.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    variant="outline" 
                                    className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-200 justify-start"
                                    onClick={() => handleDownload('json')}
                                >
                                    <Share2 className="w-4 h-4 mr-2 text-blue-400" /> JSON Data
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-200 justify-start"
                                    onClick={() => handleDownload('csv')}
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" /> CSV Summary
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-200 justify-start"
                                    onClick={() => handleDownload('pdf')}
                                >
                                    <Printer className="w-4 h-4 mr-2 text-red-400" /> PDF Report
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-200 justify-start"
                                    onClick={() => handleDownload('png')}
                                >
                                    <FileImage className="w-4 h-4 mr-2 text-purple-400" /> Plot Images
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-base">Results Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-950 rounded border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Permeability (k)</span>
                                    <span>{state.matchingResults.parameters.k?.toFixed(2)} md</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Skin (s)</span>
                                    <span>{state.matchingResults.parameters.s?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Extrapolated Pressure (P*)</span>
                                    <span>{state.testConfig.initialPressure} psia</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Flow Capacity (kh)</span>
                                    <span>{state.matchingResults.flowCapacity?.kh?.toFixed(1) || '-'} md-ft</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Integration Section */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-blue-400" />
                                Cross-Module Integration
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Send analysis results to other Petrolord engineering modules.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {integrations.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors">
                                    <div className={`mt-1 p-2 rounded bg-slate-900 ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                                            <Badge variant="secondary" className="bg-slate-900 text-[10px] text-slate-500">Ready</Badge>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 mb-3">{item.desc}</p>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-7 px-0 text-blue-400 hover:text-blue-300 hover:bg-transparent p-0"
                                            onClick={() => navigate(item.path)}
                                        >
                                            Open Module <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Helper icons
const TrendingUpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const ActivityIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);


export default ExportLinksTab;
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileJson, FileSpreadsheet, Database } from 'lucide-react';
import DataImporter from './DataImporter';
import ReportGenerator from './ReportGenerator';

const ExportImportPanel = () => {
    const [isImportOpen, setIsImportOpen] = useState(false);

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Import Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-blue-400" /> Data Import
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-slate-400">
                            Import production history, well headers, or existing decline parameters from external sources.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            <Button className="justify-start bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => setIsImportOpen(true)}>
                                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" /> Import CSV / Excel Data
                            </Button>
                            <Button className="justify-start bg-slate-800 hover:bg-slate-700 text-slate-200" disabled>
                                <Database className="w-4 h-4 mr-2 text-blue-500" /> Connect to Database (SQL)
                            </Button>
                            <Button className="justify-start bg-slate-800 hover:bg-slate-700 text-slate-200" disabled>
                                <FileJson className="w-4 h-4 mr-2 text-amber-500" /> Import JSON Project File
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Export Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-400" /> Data Export
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Reuse the existing ReportGenerator which handles exports nicely */}
                        <ReportGenerator embedded={true} />
                    </CardContent>
                </Card>
            </div>
            
            <DataImporter isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </div>
    );
};

export default ExportImportPanel;
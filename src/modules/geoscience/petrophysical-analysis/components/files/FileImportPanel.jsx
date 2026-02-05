import React from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import DragDropUpload from './DragDropUpload';
import FileHistory from './FileHistory';
import ActiveFileIndicator from './ActiveFileIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const FileImportPanel = () => {
    const { activeWell, wells } = useGlobalDataStore();
    // Safety check for wells object
    const well = (activeWell && wells) ? wells[activeWell] : null;

    return (
        <div className="h-full flex flex-col bg-[#0F172A] text-slate-100 p-4 overflow-hidden">
            <div className="mb-4 shrink-0">
                <h2 className="text-xl font-semibold text-white mb-1">Data Import</h2>
                <p className="text-sm text-slate-400">Manage files and import new log data.</p>
            </div>

            <ErrorBoundary>
                {!well ? (
                    <Alert className="bg-blue-900/20 border-blue-800 text-blue-200">
                        <Info className="h-4 w-4" />
                        <AlertTitle>No Well Selected</AlertTitle>
                        <AlertDescription>
                            Please select a well from the list to manage its files.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Tabs defaultValue="upload" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="bg-slate-900 border-slate-800 mb-4 shrink-0 w-full justify-start">
                            <TabsTrigger value="upload">Upload & Import</TabsTrigger>
                            <TabsTrigger value="history">File History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="flex-1 flex flex-col gap-4 overflow-auto m-0">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-slate-200">Upload LAS File</h3>
                                        <p className="text-sm text-slate-500">
                                            Import log data for well <span className="text-white font-semibold">{well.name}</span>.
                                            Supported formats: .LAS (2.0/3.0), CSV, JSON, Excel
                                        </p>
                                    </div>
                                    <DragDropUpload wellId={well.id} projectId={well.project_id} />
                                </CardContent>
                            </Card>
                            
                            <ActiveFileIndicator wellId={well.id} />
                        </TabsContent>

                        <TabsContent value="history" className="flex-1 overflow-hidden m-0">
                            <FileHistory wellId={well.id} />
                        </TabsContent>
                    </Tabs>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default FileImportPanel;
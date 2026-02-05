import React, { useEffect } from 'react';
import { NodalAnalysisProvider, useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, FolderOpen, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Placeholder components for forms (will be fully implemented in Phase 2)
const WellDataForm = () => <div className="p-4 border border-dashed border-slate-700 rounded text-slate-500 text-center">Well Data Form Placeholder</div>;
const EquipmentForm = () => <div className="p-4 border border-dashed border-slate-700 rounded text-slate-500 text-center">Equipment Data Form Placeholder</div>;
const FluidPropertiesForm = () => <div className="p-4 border border-dashed border-slate-700 rounded text-slate-500 text-center">Fluid Properties Form Placeholder</div>;
const CalculationForm = () => <div className="p-4 border border-dashed border-slate-700 rounded text-slate-500 text-center">Calculation Parameters Form Placeholder</div>;

const NodalAnalysisContent = () => {
    const { sessions, currentSession, loadSessions, createSession } = useNodalAnalysis();
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            loadSessions();
        }
    }, [user]);

    return (
        <div className="p-6 space-y-6 bg-[#0F172A] min-h-screen text-slate-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Nodal Analysis</h1>
                    <p className="text-slate-400 text-sm">System performance optimization</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-700 text-slate-300">
                        <FolderOpen className="w-4 h-4 mr-2" /> Load Session
                    </Button>
                    <Button 
                        onClick={() => createSession("New Analysis", "Created via Dashboard")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Analysis
                    </Button>
                </div>
            </div>

            {currentSession ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#1E293B] border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Input Parameters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="well" className="w-full">
                                    <TabsList className="bg-slate-900 w-full justify-start">
                                        <TabsTrigger value="well">Well Data</TabsTrigger>
                                        <TabsTrigger value="equipment">Equipment</TabsTrigger>
                                        <TabsTrigger value="fluid">Fluids</TabsTrigger>
                                        <TabsTrigger value="calc">Calculation</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="well" className="mt-4"><WellDataForm /></TabsContent>
                                    <TabsContent value="equipment" className="mt-4"><EquipmentForm /></TabsContent>
                                    <TabsContent value="fluid" className="mt-4"><FluidPropertiesForm /></TabsContent>
                                    <TabsContent value="calc" className="mt-4"><CalculationForm /></TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card className="bg-[#1E293B] border-slate-800 h-full">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Results & Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-[300px] text-slate-500 text-sm italic">
                                Run calculation to see inflow/outflow curves
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-slate-800 rounded-lg bg-[#1E293B]/50">
                    <Activity className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-xl font-medium text-slate-300">No Session Active</h3>
                    <p className="text-slate-500 mt-2 mb-6">Create a new analysis session or load an existing one to get started.</p>
                    <Button onClick={() => createSession("New Analysis", "Created via Dashboard")} className="bg-blue-600 hover:bg-blue-700">
                        Create New Analysis
                    </Button>
                </div>
            )}
        </div>
    );
};

const NodalAnalysisPage = () => {
    return (
        <NodalAnalysisProvider>
            <NodalAnalysisContent />
        </NodalAnalysisProvider>
    );
};

export default NodalAnalysisPage;
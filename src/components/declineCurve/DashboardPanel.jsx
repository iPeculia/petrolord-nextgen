import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, BarChart2, Calendar, Database, Trash2 } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { loadPermianBasinSampleData } from '@/utils/permianBasinDataLoader';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
                    <p className="text-xs text-slate-500 mt-1">{subtext}</p>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const DashboardPanel = () => {
    const { currentProject, loadProjectData, clearData } = useDeclineCurve();
    const { toast } = useToast();
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleLoadSample = () => {
        const sampleData = loadPermianBasinSampleData();
        loadProjectData(sampleData.project);
        toast({
            title: "Sample Data Loaded",
            description: "Permian Basin Analysis Project loaded successfully.",
            className: "bg-emerald-900 border-emerald-800 text-white"
        });
    };

    const handleClearConfirm = () => {
        clearData();
        setShowClearDialog(false);
        toast({
            title: "Data Cleared",
            description: "All project data has been removed.",
            className: "bg-slate-900 border-slate-800 text-white"
        });
    };

    const wellsCount = currentProject?.wells?.length || 0;
    const scenariosCount = currentProject?.scenarios?.length || 0;
    const groupsCount = currentProject?.groups?.length || 0;
    
    // Calculate simple aggregate stats if data exists
    let totalEUR = 0;
    if (currentProject?.wells) {
        currentProject.wells.forEach(w => {
            if (w.model && w.model.oil && w.model.oil.eur) {
                totalEUR += w.model.oil.eur;
            }
        });
    }

    return (
        <div className="h-full flex flex-col gap-6 overflow-auto p-2">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Project Dashboard</h2>
                    <p className="text-slate-400 text-sm">Overview of your current analysis project.</p>
                </div>
                <div className="flex gap-3">
                    {!currentProject ? (
                        <Button onClick={handleLoadSample} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Database className="w-4 h-4 mr-2" /> Load Permian Sample Data
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowClearDialog(true)} 
                                className="border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Clear Data
                            </Button>
                            <Button variant="outline" onClick={handleLoadSample} className="border-slate-700 bg-slate-900">
                                <Activity className="w-4 h-4 mr-2" /> Reload Samples
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Clear All Data?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action will permanently remove all project data. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleClearConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Clear Data
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {currentProject ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard 
                            title="Active Wells" 
                            value={wellsCount} 
                            subtext="Across Midland & Delaware" 
                            icon={Activity} 
                            color="bg-blue-500" 
                        />
                        <StatCard 
                            title="Total Oil EUR" 
                            value={`${(totalEUR / 1000000).toFixed(2)} MMbbl`} 
                            subtext="Estimated Ultimate Recovery" 
                            icon={TrendingUp} 
                            color="bg-emerald-500" 
                        />
                        <StatCard 
                            title="Scenarios" 
                            value={scenariosCount} 
                            subtext="Economic models defined" 
                            icon={BarChart2} 
                            color="bg-purple-500" 
                        />
                        <StatCard 
                            title="Forecast Range" 
                            value="30 Years" 
                            subtext="Standard projection window" 
                            icon={Calendar} 
                            color="bg-orange-500" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-200">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 bg-slate-800/30 rounded border border-slate-800">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-300">Project Loaded</p>
                                            <p className="text-xs text-slate-500">{new Date(currentProject.created).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {currentProject.wells.slice(0, 3).map(w => (
                                        <div key={w.id} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded border border-slate-800">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-300">Well Imported: {w.name}</p>
                                                <p className="text-xs text-slate-500">{w.field} - {w.formation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-200">Data Source</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center">
                                    <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <h4 className="text-white font-medium mb-1">Permian Sample Dataset</h4>
                                    <p className="text-xs text-slate-500 mb-4">
                                        This project uses synthetic data modeled after real-world Permian Basin unconventional wells.
                                    </p>
                                    <div className="flex justify-center gap-2">
                                        <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">10 Wells</span>
                                        <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">4 Scenarios</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-lg">
                    <Database className="w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Project Loaded</h3>
                    <p className="text-slate-500 max-w-md mb-8">
                        Get started by loading our comprehensive sample dataset or creating a new empty project.
                    </p>
                    <Button onClick={handleLoadSample} size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <Activity className="w-5 h-5 mr-2" /> Load Permian Samples
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DashboardPanel;
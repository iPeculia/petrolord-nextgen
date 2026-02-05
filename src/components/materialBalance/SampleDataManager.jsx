import React, { useState } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { loadMaterialBalanceSampleData } from '@/utils/materialBalanceDataLoader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SampleDataManager = () => {
    const { loadSampleProject, clearLog } = useMaterialBalance();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleLoadData = async () => {
        setIsLoading(true);
        try {
            // Simulate processing delay for realistic feel
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const sampleData = loadMaterialBalanceSampleData();
            loadSampleProject(sampleData);
            
            setIsLoaded(true);
            toast({
                title: "Sample Data Loaded",
                description: "Permian Basin reservoirs loaded successfully.",
                variant: "success"
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Load Failed",
                description: "Could not generate sample data.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = () => {
        window.location.reload();
    };

    return (
        <>
            <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Database className="h-5 w-5 text-[#BFFF00]" />
                                Sample Data Manager
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Load pre-configured Permian Basin reservoirs for demonstration.
                            </CardDescription>
                        </div>
                        {isLoaded && <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-slate-950 p-4 border border-slate-800">
                        <h4 className="text-sm font-medium text-white mb-2">Dataset Contents:</h4>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                            <li>5 Realistic Reservoirs (Midland & Delaware)</li>
                            <li>Wolfcamp, Bone Spring, Spraberry Formations</li>
                            <li>Synthetic Production History (36-60 months)</li>
                            <li>Full PVT Properties Tables</li>
                            <li>Material Balance Scenarios</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            onClick={handleLoadData} 
                            disabled={isLoading || isLoaded}
                            className="flex-1 bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900]"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
                            ) : isLoaded ? (
                                <><CheckCircle className="mr-2 h-4 w-4" /> Loaded</>
                            ) : (
                                "Load Sample Data"
                            )}
                        </Button>
                        
                        {isLoaded && (
                            <Button 
                                variant="destructive"
                                onClick={() => setShowClearDialog(true)}
                                className="w-12 px-0"
                                title="Clear Data"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Clear Sample Data</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This will clear the current session and reload the application. Continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleClearData}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Clear
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SampleDataManager;
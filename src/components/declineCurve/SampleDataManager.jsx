import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, Loader2, AlertCircle, DownloadCloud } from 'lucide-react';
import { loadPermianBasinSampleData } from '@/utils/permianBasinDataLoader';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const SampleDataManager = () => {
    const { loadProjectData, currentProject } = useDeclineCurve();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleLoadSampleData = async () => {
        setIsLoading(true);
        
        try {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const sampleData = loadPermianBasinSampleData();
            loadProjectData(sampleData.project);
            
            toast({
                title: "Sample Data Loaded",
                description: "Permian Basin Analysis Project has been loaded successfully.",
                className: "bg-emerald-900 border-emerald-800 text-white"
            });
        } catch (error) {
            console.error("Failed to load sample data:", error);
            toast({
                title: "Error",
                description: "Failed to load sample data.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isSampleLoaded = currentProject?.id === "proj-permian-demo";

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" /> 
                    Sample Data Manager
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <h4 className="text-sm font-semibold text-white mb-1">Permian Basin Dataset</h4>
                    <p className="text-xs text-slate-400 mb-3">
                        Includes 10 realistic wells from Midland & Delaware basins, production history, 
                        fitted decline models, and economic scenarios.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">10 Wells</Badge>
                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">4 Scenarios</Badge>
                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">4 Groups</Badge>
                    </div>

                    {isSampleLoaded ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/30 p-2 rounded border border-emerald-900/50">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Dataset Currently Active
                        </div>
                    ) : (
                        <Button 
                            size="sm" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                            onClick={handleLoadSampleData}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Loading...
                                </>
                            ) : (
                                <>
                                    <DownloadCloud className="w-3 h-3 mr-2" /> Load Dataset
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SampleDataManager;
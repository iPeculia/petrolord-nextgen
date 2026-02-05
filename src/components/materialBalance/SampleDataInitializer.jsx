import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, PlusCircle, Loader2, BarChart2, Layers, Box } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { loadMaterialBalanceSampleData } from '@/utils/materialBalanceDataLoader';

const SampleDataInitializer = () => {
    const { loadSampleProject } = useMaterialBalance();
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadSample = async () => {
        setIsLoading(true);
        // Simulate loading time
        setTimeout(() => {
            const data = loadMaterialBalanceSampleData();
            loadSampleProject(data);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="flex items-center justify-center h-full bg-slate-950 p-6">
            <Card className="max-w-4xl w-full bg-slate-900 border-slate-800 shadow-2xl">
                <CardContent className="p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#BFFF00]/10 mb-6">
                            <Database className="w-10 h-10 text-[#BFFF00]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Material Balance Analysis</h1>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Advanced reservoir engineering tool for estimating hydrocarbons in place (OOIP/OGIP), 
                            identifying drive mechanisms, and forecasting future performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Box className="w-5 h-5 mr-2 text-blue-400" />
                                Sample Project
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-400 mb-6">
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#BFFF00]">•</span>
                                    5 Realistic Permian Basin Reservoirs
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#BFFF00]">•</span>
                                    Full PVT, Production, and Pressure History
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#BFFF00]">•</span>
                                    Pre-configured Water Influx Models
                                </li>
                            </ul>
                            <Button 
                                onClick={handleLoadSample} 
                                className="w-full bg-[#BFFF00] text-slate-950 hover:bg-[#a3d900] font-bold h-12"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Data...</>
                                ) : (
                                    "Load Sample Data"
                                )}
                            </Button>
                        </div>

                        <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <PlusCircle className="w-5 h-5 mr-2 text-slate-400" />
                                    New Project
                                </h3>
                                <p className="text-sm text-slate-400 mb-6">
                                    Start from scratch. Import your own production data (CSV/Excel), 
                                    configure PVT properties manually, and build custom tank models.
                                </p>
                            </div>
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white h-12">
                                Create Empty Project
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-8 text-xs text-slate-500 border-t border-slate-800 pt-6">
                        <span className="flex items-center"><Layers className="w-3 h-3 mr-1" /> Multi-Tank Modeling</span>
                        <span className="flex items-center"><BarChart2 className="w-3 h-3 mr-1" /> Advanced Diagnostics</span>
                        <span className="flex items-center"><Database className="w-3 h-3 mr-1" /> Secure Cloud Storage</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SampleDataInitializer;
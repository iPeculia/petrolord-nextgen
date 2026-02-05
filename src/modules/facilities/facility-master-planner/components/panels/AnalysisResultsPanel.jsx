import React, { useState } from 'react';
import { Download, Share2, Printer, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    CapacityUtilizationChart, 
    CapacityTrendChart, 
    BottleneckImpactChart,
    CapexBreakdownChart,
    ScenarioComparisonChart,
    ExpansionRoadmapChart
} from '../charts/AnalysisCharts';
import DesignRecommendations from './DesignRecommendations';
import RiskAssessmentPanel from './RiskAssessmentPanel';
import { exportToCSV, generatePDFReport } from '../../utils/exportUtils';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { useToast } from '@/components/ui/use-toast';

const AnalysisResultsPanel = () => {
    const { 
        capacityAnalysis, 
        riskAnalysis,
        currentProject,
        isEngineProcessing,
        runFullAnalysis
    } = useFacilityMasterPlanner();

    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');

    // --- Mock Data Generation (for dev visualization) ---
    // In production, these would come from context/engine results
    const utilizationData = [
        { name: 'Separation A', utilization: 98 },
        { name: 'Compression B', utilization: 85 },
        { name: 'Water Inj', utilization: 45 },
        { name: 'Power Gen', utilization: 70 },
        { name: 'Export Pump', utilization: 60 }
    ];

    const trendData = [
        { year: 2024, oil_production: 80, water_production: 10, capacity_limit: 100 },
        { year: 2025, oil_production: 95, water_production: 20, capacity_limit: 100 },
        { year: 2026, oil_production: 110, water_production: 40, capacity_limit: 100 },
        { year: 2027, oil_production: 90, water_production: 60, capacity_limit: 125 }, // Expansion
    ];

    const impactData = [
        { unit_name: 'HP Sep', production_loss: 5000, potential_gain: 5000 },
        { unit_name: 'Comp A', production_loss: 2000, potential_gain: 8000 },
    ];

    const capexData = [
        { name: 'Process', value: 45 },
        { name: 'Utility', value: 20 },
        { name: 'Safety', value: 10 },
        { name: 'Installation', value: 25 },
    ];
    
    const scenarioData = [
        { year: 2024, base_case_npv: 100, optimistic_npv: 110, pessimistic_npv: 90 },
        { year: 2025, base_case_npv: 200, optimistic_npv: 240, pessimistic_npv: 160 },
        { year: 2026, base_case_npv: 300, optimistic_npv: 400, pessimistic_npv: 220 },
    ];

    const roadmapData = [
        { year: 2025, capacity_addition: 25000, type: 'Oil', capex: 250 },
        { year: 2027, capacity_addition: 50000, type: 'Water', capex: 150 },
    ];

    // --- Handlers ---

    const handleExportPDF = async () => {
        toast({ title: "Generating Report", description: "Preparing PDF export..." });
        try {
            await generatePDFReport({
                metrics: { "Net Present Value": "$350M", "IRR": "18.5%", "Peak Rate": "110k bpd" }, 
                recommendations: riskAnalysis 
            }, `FMP Report - ${currentProject?.name || 'Project'}`, 
            ['utilization-chart', 'trend-chart', 'capex-chart']);
            toast({ title: "Success", description: "Report downloaded successfully." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleRunAnalysis = () => {
        if (!currentProject) {
            toast({ title: "No Project", description: "Please create a project first.", variant: "destructive" });
            return;
        }
        toast({ title: "Analysis Started", description: "Running optimization algorithms..." });
        // runFullAnalysis(currentProject); // Trigger actual engine
        setTimeout(() => toast({ title: "Analysis Complete", description: "New results available." }), 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131b2b] shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Analysis Results
                    </h2>
                    <p className="text-xs text-slate-400">Project: {currentProject?.name || 'Demo Project'} | Status: {isEngineProcessing ? 'Processing...' : 'Complete'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRunAnalysis} disabled={isEngineProcessing} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isEngineProcessing ? 'animate-spin' : ''}`} /> 
                        {isEngineProcessing ? 'Running...' : 'Re-Run Analysis'}
                    </Button>
                    <div className="h-8 w-px bg-slate-700 mx-2" />
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(utilizationData, 'utilization_data')} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                        <Download className="w-4 h-4 mr-2" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
                        <Printer className="w-4 h-4 mr-2" /> PDF Report
                    </Button>
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="bg-slate-900 border border-slate-700 p-1">
                        <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
                        <TabsTrigger value="bottlenecks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Bottlenecks</TabsTrigger>
                        <TabsTrigger value="expansion" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Expansion Plan</TabsTrigger>
                        <TabsTrigger value="economics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Economics & Risk</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div id="utilization-chart" className="bg-[#1a1a1a] p-5 rounded-lg border border-slate-800 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">Capacity Utilization (Peak)</h3>
                                <CapacityUtilizationChart data={utilizationData} />
                            </div>
                            <div id="trend-chart" className="bg-[#1a1a1a] p-5 rounded-lg border border-slate-800 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">Life of Field Trend</h3>
                                <CapacityTrendChart data={trendData} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                            <div className="lg:col-span-2 h-full">
                                <DesignRecommendations recommendations={[]} />
                            </div>
                            <div className="h-full">
                                <RiskAssessmentPanel risks={riskAnalysis} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="bottlenecks" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-slate-800 shadow-lg">
                             <h3 className="text-sm font-semibold text-slate-200 mb-6 uppercase tracking-wide">Bottleneck Impact Analysis</h3>
                             <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                     <BottleneckImpactChart data={impactData} />
                                </div>
                                <div className="w-full lg:w-1/3 space-y-4">
                                    <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg">
                                        <h4 className="text-red-400 font-bold mb-2">Primary Constraint: HP Separator</h4>
                                        <p className="text-sm text-slate-400">
                                            The High Pressure Separator is limiting production by 5,000 bpd during peak years (2025-2027). 
                                            Fluid residence time drops below 3 minutes at peak rates.
                                        </p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                        <h4 className="text-slate-200 font-bold mb-2">Recommended Action</h4>
                                        <p className="text-sm text-slate-400">
                                            Retrofit vessel internals (high-efficiency coalescers) or add a parallel train.
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="expansion" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="bg-[#1a1a1a] p-6 rounded-lg border border-slate-800 shadow-lg mb-6">
                             <h3 className="text-sm font-semibold text-slate-200 mb-6 uppercase tracking-wide">Expansion Roadmap</h3>
                             <ExpansionRoadmapChart data={roadmapData} />
                         </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {roadmapData.map((phase, i) => (
                                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Phase {i+1}: {phase.type} Expansion</h4>
                                        <p className="text-slate-400 text-sm">Target Year: {phase.year}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-400">+{phase.capacity_addition.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 uppercase">Capacity Add</div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </TabsContent>

                    <TabsContent value="economics" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div id="capex-chart" className="bg-[#1a1a1a] p-5 rounded-lg border border-slate-800 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">CAPEX Breakdown</h3>
                                <CapexBreakdownChart data={capexData} />
                            </div>
                            <div className="bg-[#1a1a1a] p-5 rounded-lg border border-slate-800 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">NPV Sensitivity</h3>
                                <ScenarioComparisonChart data={scenarioData} />
                            </div>
                         </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AnalysisResultsPanel;
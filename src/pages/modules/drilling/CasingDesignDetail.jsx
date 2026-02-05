import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDesignDetails } from '@/hooks/useCasingDesign';
import DesignWizardModal from '@/components/casing-design/modals/DesignWizardModal';
import { useDesignCalculations } from '@/components/casing-design/hooks/useDesignCalculations';

// Components
import DesignOverviewCard from '@/components/casing-design/analysis/summary/DesignOverviewCard';
import SectionDetailsTable from '@/components/casing-design/analysis/specifications/SectionDetailsTable';
import LoadCaseAnalysisPanel from '@/components/casing-design/analysis/loadcase/LoadCaseAnalysisPanel';
import EnhancedDepthProfileChart from '@/components/casing-design/analysis/visualizations/EnhancedDepthProfileChart';
import WeightDistributionPanel from '@/components/casing-design/analysis/visualizations/WeightDistributionPanel';
import RatingsComparisonPanel from '@/components/casing-design/analysis/visualizations/RatingsComparisonPanel';
import ExportActions from '@/components/casing-design/reporting/ExportActions';
import ComparisonToolModal from '@/components/casing-design/comparison/ComparisonToolModal';
import OptimizationPanel from '@/components/casing-design/optimization/OptimizationPanel';

const CasingDesignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { design, sections, loading, refetch } = useDesignDetails(id);
    const [wizardOpen, setWizardOpen] = useState(false);
    const [compareOpen, setCompareOpen] = useState(false);
    
    // Memoize calculations
    const calculations = useDesignCalculations(sections);

    if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">Loading design configuration...</div>;
    if (!design) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-400">Design not found.</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/modules/drilling/casing-design')} className="hover:bg-slate-800 text-slate-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Design Analysis</h1>
                        <p className="text-slate-400 text-sm">Case: {design.name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="border-slate-700 hover:bg-slate-800 text-slate-300"
                        onClick={() => setCompareOpen(true)}
                    >
                        <Scale className="mr-2 h-4 w-4" /> Compare
                    </Button>
                    <ExportActions design={design} sections={sections} />
                    <Button 
                        className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-semibold"
                        onClick={() => setWizardOpen(true)}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit Design
                    </Button>
                </div>
            </div>

            {/* Overview Card */}
            <DesignOverviewCard design={design} calculations={calculations} />

            {/* Main Content Tabs */}
            <Tabs defaultValue="specs" className="space-y-4">
                <TabsList className="bg-[#1E293B] border border-slate-700 p-1 w-fit">
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="vis">Visualizations</TabsTrigger>
                    <TabsTrigger value="loads">Load Analysis</TabsTrigger>
                    <TabsTrigger value="optimize" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                        <Sparkles className="w-3 h-3 mr-2" /> Optimization
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="space-y-6">
                    <SectionDetailsTable sections={sections} />
                </TabsContent>

                <TabsContent value="vis" className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-1 h-[600px]">
                            <EnhancedDepthProfileChart sections={sections} design={design} />
                        </div>
                        <div className="xl:col-span-2 space-y-6">
                            <WeightDistributionPanel sections={sections} />
                            <RatingsComparisonPanel sections={sections} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="loads" className="space-y-6">
                    <LoadCaseAnalysisPanel sections={sections} />
                </TabsContent>

                <TabsContent value="optimize" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2">
                             <OptimizationPanel sections={sections} calculations={calculations} />
                         </div>
                         <div className="lg:col-span-1">
                             <DesignOverviewCard design={design} calculations={calculations} />
                         </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            {wizardOpen && (
                 <DesignWizardModal 
                    isOpen={wizardOpen}
                    onClose={() => setWizardOpen(false)}
                    onSuccess={refetch}
                    initialData={{ design, sections }}
                 />
            )}

            {compareOpen && (
                <ComparisonToolModal 
                    isOpen={compareOpen}
                    onClose={() => setCompareOpen(false)}
                    currentDesign={design}
                    currentSections={sections}
                />
            )}
        </div>
    );
};

export default CasingDesignDetail;
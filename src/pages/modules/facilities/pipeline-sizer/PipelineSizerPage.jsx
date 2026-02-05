import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Settings, Calculator, Save, RotateCcw, FileText, 
  ArrowLeft, Plus, Trash2, CheckCircle2, AlertTriangle, 
  ChevronRight, BarChart3, Wind, Download, Zap, ShieldAlert,
  History, FolderOpen, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { pipelineSizerService } from '@/services/facilities/pipelineSizerService';
import { generatePipelinePDF } from '@/modules/facilities/pipeline-sizer/utils/reportGenerator';
import html2canvas from 'html2canvas';

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Module Components
import StepWizard from '@/modules/facilities/pipeline-sizer/components/StepWizard';
import StudyHeader from '@/modules/facilities/pipeline-sizer/components/StudyHeader';
import Step1FluidPVT from '@/modules/facilities/pipeline-sizer/components/steps/Step1FluidPVT';
import Step2RouteGeometry from '@/modules/facilities/pipeline-sizer/components/steps/Step2RouteGeometry';
import Step4ConstraintsStandards from '@/modules/facilities/pipeline-sizer/components/steps/Step4ConstraintsStandards';
import ResultsDashboard from '@/modules/facilities/pipeline-sizer/components/ResultsDashboard';
import { Step5Integrity, Step6Operations, Step7Sensitivity, Step8Optimization, Step9Reporting } from '@/dashboard/modules/facilities/pipeline-sizer/components/AdvancedSteps';

// Hooks & Utils
import { usePipelineCalculation } from '@/modules/facilities/pipeline-sizer/hooks/usePipelineCalculation';
import { DEFAULT_FLUID_PROPS } from '@/modules/facilities/pipeline-sizer/utils/constants';

const PipelineSizerPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { setIsFullscreenApp, setShowMainSidebar } = useApplicationLayout();
  const { runFullAnalysis, runSensitivity, isCalculating, results, sensitivityResults, setResults } = usePipelineCalculation();
  
  // Layout Management
  useEffect(() => {
    setIsFullscreenApp(true);
    setShowMainSidebar(false);
    return () => {
      setIsFullscreenApp(false);
      setShowMainSidebar(true);
    };
  }, [setIsFullscreenApp, setShowMainSidebar]);

  const [currentStep, setCurrentStep] = useState(0);

  // --- Study State ---
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [caseMeta, setCaseMeta] = useState({ caseName: 'New Study', description: '' });

  const [fluidType, setFluidType] = useState('oil');
  const [flowRate, setFlowRate] = useState(5000);
  const [flowUnit, setFlowUnit] = useState('bpd');
  const [fluidProps, setFluidProps] = useState(DEFAULT_FLUID_PROPS['oil']);
  const [segments, setSegments] = useState([
    { id: 1, name: 'Main Line', length: 5000, elevation: 100, roughness: 'new_steel', fittings: { elbow90: 2 }, heatTransfer: 'isothermal' }
  ]);
  const [constraints, setConstraints] = useState({
    maxVelocity: 15, minVelocity: 3, maxPressureDrop: 500, minArrivalPressure: 50, erosionalVelocityRatio: 1.0, standard: 'API 14E'
  });
  const [designParams, setDesignParams] = useState({
    startPressure: 1000, startTemp: 120, schedule: '40', material: 'CS'
  });
  const [selectedSize, setSelectedSize] = useState(null);

  // --- Case Management Modals ---
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [userCases, setUserCases] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [caseReports, setCaseReports] = useState([]);

  // Load user cases on open
  useEffect(() => {
    if (isLoadModalOpen && user) {
      loadCases();
    }
  }, [isLoadModalOpen, user]);

  const loadCases = async () => {
    try {
      const cases = await pipelineSizerService.getCases(user.id);
      setUserCases(cases);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load cases", variant: "destructive" });
    }
  };

  const loadAuditAndReports = async (id) => {
      if (!id) return;
      try {
          const logs = await pipelineSizerService.getAuditLog(id);
          const reps = await pipelineSizerService.getReports(id);
          setAuditLogs(logs);
          setCaseReports(reps);
      } catch (e) {
          console.error(e);
      }
  };

  // --- Actions ---

  const handleCalculate = async () => {
    await runFullAnalysis({ fluidProps, flowRate, flowUnit, segments, designParams, constraints });
    if(currentStep < 3) setCurrentStep(3);
    toast({ title: "Analysis Complete", description: "Hydraulic models updated successfully.", className: "bg-emerald-600 text-white" });
  };

  const handleSaveCase = async () => {
    if (!user) return toast({ title: "Login Required", description: "Please login to save cases.", variant: "destructive" });
    
    const caseData = {
      meta: caseMeta,
      fluidType, flowRate, flowUnit, fluidProps, segments, constraints, designParams, selectedSize,
      results: results // Save results too so we don't have to re-calc immediately
    };

    try {
      const saved = await pipelineSizerService.saveCase(user.id, caseData, currentCaseId);
      setCurrentCaseId(saved.id);
      toast({ title: "Success", description: "Case saved successfully." });
      loadAuditAndReports(saved.id);
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleLoadCase = async (c) => {
    const d = c.case_data;
    setCaseMeta(d.meta || { caseName: c.case_name });
    setFluidType(d.fluidType);
    setFlowRate(d.flowRate);
    setFlowUnit(d.flowUnit);
    setFluidProps(d.fluidProps);
    setSegments(d.segments);
    setConstraints(d.constraints);
    setDesignParams(d.designParams);
    setSelectedSize(d.selectedSize);
    if(d.results) setResults(d.results);
    setCurrentCaseId(c.id);
    setIsLoadModalOpen(false);
    toast({ title: "Case Loaded", description: `Loaded: ${c.case_name}` });
    loadAuditAndReports(c.id);
  };

  // --- Reporting ---
  const resultsRef = useRef(null); // Ref to capture charts

  const handleGenerateReport = async () => {
    if (!results) return toast({ title: "No Results", description: "Run calculation first.", variant: "destructive" });
    
    toast({ title: "Generating Report...", description: "Please wait while we assemble the PDF." });

    // Capture Chart
    let chartImage = null;
    const chartEl = document.getElementById('results-chart-container');
    if (chartEl) {
        try {
            const canvas = await html2canvas(chartEl, { scale: 2 });
            chartImage = canvas.toDataURL('image/png');
        } catch (e) {
            console.warn("Chart capture failed", e);
        }
    }

    const doc = generatePipelinePDF({
        meta: caseMeta, fluidType, flowRate, flowUnit, fluidProps, segments, constraints, designParams, selectedSize
    }, results, { performance: chartImage });

    const pdfBlob = doc.output('blob');
    const fileName = `Pipeline_Report_${caseMeta.caseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    // Upload to Supabase Storage
    if (user && currentCaseId) {
        try {
            const filePath = `${user.id}/${currentCaseId}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('reports').upload(filePath, pdfBlob);
            if (uploadError) throw uploadError;

            await pipelineSizerService.saveReportRecord(currentCaseId, user.id, 'pdf', filePath, {
                 meta: caseMeta, resultsSummary: results.length
            });
            
            loadAuditAndReports(currentCaseId);
        } catch (e) {
            console.error("Report upload failed", e);
            // Fallback to direct download if upload fails or storage not configured
        }
    }

    doc.save(fileName);
    toast({ title: "Report Downloaded", description: "PDF has been generated." });
  };


  const steps = [
    { id: 'fluid', title: 'Fluid & PVT' },
    { id: 'geo', title: 'Route & Geometry' },
    { id: 'const', title: 'Constraints' },
    { id: 'res', title: 'Sizing Results' },
    { id: 'int', title: 'Integrity Check' },
    { id: 'ops', title: 'Operations' },
    { id: 'sens', title: 'Sensitivity' },
    { id: 'opt', title: 'Optimization' },
    { id: 'rep', title: 'Reporting' }
  ];

  return (
    <>
      <Helmet><title>Pipeline Sizer Studio | Petrolord</title></Helmet>
      
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans overflow-hidden">
         {/* Enhanced Header */}
         <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 z-50 shadow-md">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft className="text-slate-400" /></Button>
                <div>
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="text-blue-500 w-5 h-5"/> 
                        {caseMeta.caseName}
                    </h1>
                    <div className="text-xs text-slate-500 flex gap-2">
                        <span>Pipeline Sizer</span>
                        {currentCaseId && <span className="text-emerald-500">• Saved</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                 <Dialog open={isLoadModalOpen} onOpenChange={setIsLoadModalOpen}>
                    <DialogTrigger asChild><Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700"><FolderOpen className="w-4 h-4 mr-2"/> Cases</Button></DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl">
                        <DialogHeader><DialogTitle>My Pipeline Cases</DialogTitle></DialogHeader>
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {userCases.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.case_name}</TableCell>
                                            <TableCell>{new Date(c.updated_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button size="sm" onClick={() => handleLoadCase(c)}>Load</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {userCases.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-slate-500">No cases found.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </DialogContent>
                 </Dialog>

                 <Button variant="outline" size="sm" onClick={handleSaveCase} className="bg-slate-800 border-slate-700 hover:bg-slate-700"><Save className="w-4 h-4 mr-2"/> Save</Button>
                 
                 <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
                    <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => currentCaseId && loadAuditAndReports(currentCaseId)} disabled={!currentCaseId} className="bg-slate-800 border-slate-700 hover:bg-slate-700 disabled:opacity-50"><History className="w-4 h-4 mr-2"/> Audit & Reports</Button></DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader><DialogTitle>Case History: {caseMeta.caseName}</DialogTitle></DialogHeader>
                        <Tabs defaultValue="reports" className="flex-1 overflow-hidden flex flex-col">
                            <TabsList className="bg-slate-800">
                                <TabsTrigger value="reports">Generated Reports</TabsTrigger>
                                <TabsTrigger value="audit">Audit Log</TabsTrigger>
                            </TabsList>
                            <TabsContent value="reports" className="flex-1 overflow-auto p-4">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {caseReports.map(r => (
                                            <TableRow key={r.id}>
                                                <TableCell className="uppercase badge">{r.report_type}</TableCell>
                                                <TableCell>{new Date(r.generated_at).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="ghost" onClick={async () => {
                                                        try {
                                                            const url = await pipelineSizerService.getDownloadUrl(r.file_path);
                                                            if(url) window.open(url, '_blank');
                                                            else toast({title: "Error", description: "File not accessible"});
                                                        } catch(e) { toast({title:"Error", variant:"destructive"}); }
                                                    }}><Download className="w-4 h-4"/></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="audit" className="flex-1 overflow-auto p-4">
                                <div className="space-y-4">
                                    {auditLogs.map(log => (
                                        <div key={log.id} className="flex gap-4 items-start border-l-2 border-slate-700 pl-4 pb-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-sm text-blue-400 uppercase">{log.action}</span>
                                                    <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {JSON.stringify(log.changes)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                 </Dialog>
            </div>
         </div>

         <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950/50">
            <div className="max-w-7xl mx-auto pb-24">
                <StepWizard currentStep={currentStep} steps={steps} onStepClick={setCurrentStep} />

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentStep} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="min-h-[600px]"
                    >
                        {currentStep === 0 && <Step1FluidPVT fluidType={fluidType} setFluidType={setFluidType} fluidProps={fluidProps} setFluidProps={setFluidProps} flowRate={flowRate} setFlowRate={setFlowRate} flowUnit={flowUnit} setFlowUnit={setFlowUnit} designParams={designParams} setDesignParams={setDesignParams} />}
                        {currentStep === 1 && <Step2RouteGeometry segments={segments} setSegments={setSegments} />}
                        {currentStep === 2 && <Step4ConstraintsStandards constraints={constraints} setConstraints={setConstraints} designParams={designParams} setDesignParams={setDesignParams} />}
                        {currentStep === 3 && (
                            <div id="results-chart-container">
                                <ResultsDashboard results={results} constraints={constraints} onSelectSize={setSelectedSize} selectedSize={selectedSize} />
                            </div>
                        )}
                        
                        {/* Advanced Steps */}
                        {currentStep === 4 && <Step5Integrity results={results} selectedSize={selectedSize} onSelectSize={setSelectedSize} material={designParams.material} />}
                        {currentStep === 5 && <Step6Operations results={results} selectedSize={selectedSize} onSelectSize={setSelectedSize} flowRate={flowRate} />}
                        {currentStep === 6 && <Step7Sensitivity runSensitivity={runSensitivity} results={sensitivityResults} inputs={{ fluidProps, flowRate, flowUnit, segments, designParams, constraints, selectedSize }} />}
                        {currentStep === 7 && <Step8Optimization results={results} constraints={constraints} />}
                        {currentStep === 8 && <Step9Reporting studyData={{ fluidType, flowRate, segments, constraints, results, selectedSize, meta: caseMeta }} onGenerateReport={handleGenerateReport} />}
                    </motion.div>
                </AnimatePresence>
            </div>
         </main>

         {/* Sticky Footer */}
         <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#1e293b] border-t-2 border-slate-700 flex items-center justify-between px-8 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
             <Button 
                variant="outline" 
                onClick={() => setCurrentStep(c => Math.max(0, c - 1))} 
                disabled={currentStep === 0} 
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 h-10 px-6 font-medium"
             >
                Previous
             </Button>
             
             <div className="flex items-center gap-4 bg-slate-900/50 py-2 px-6 rounded-full border border-slate-700/50">
                 <Input 
                    value={caseMeta.caseName} 
                    onChange={e => setCaseMeta({...caseMeta, caseName: e.target.value})} 
                    className="bg-transparent border-none h-8 w-64 text-center focus-visible:ring-0 text-white font-medium"
                    placeholder="Case Name..."
                 />
                 <div className="h-4 w-[1px] bg-slate-700"></div>
                 {selectedSize ? (
                     <span className="text-emerald-400 font-mono flex items-center text-sm font-bold animate-pulse">
                        <CheckCircle2 className="w-4 h-4 mr-2"/> Size: {selectedSize}"
                     </span>
                 ) : (
                     <span className="text-xs text-slate-500 font-medium">No Size Selected</span>
                 )}
             </div>

             <Button 
                onClick={currentStep === 2 ? handleCalculate : () => setCurrentStep(c => Math.min(steps.length-1, c+1))} 
                className={`
                    min-w-[140px] h-11 text-base font-bold shadow-lg transition-all
                    ${currentStep === 2 ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'}
                    text-white
                `}
                disabled={currentStep === 2 ? isCalculating : (currentStep >= 3 && !selectedSize)}
             >
                {currentStep === 2 ? (isCalculating ? 'Calculating...' : 'Run Sizing') : currentStep === steps.length - 1 ? 'Finish' : 'Next'} 
                <ChevronRight className="w-5 h-5 ml-2" />
             </Button>
         </div>
      </div>
    </>
  );
};

export default PipelineSizerPage;
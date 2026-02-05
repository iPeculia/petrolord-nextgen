import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Settings, Calculator, Save, RotateCcw, FileText, Info, 
  ArrowLeft, Plus, Trash2, GripVertical, AlertTriangle, CheckCircle2,
  Thermometer, Wind, Scale, Zap, BarChart3, ChevronRight, Download, Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';

// --- Constants & Defaults ---
const DEFAULT_FLUID_PROPS = {
  oil: { density: 53.0, viscosity: 2.5, heatCapacity: 0.5 },
  gas: { density: 0.8, viscosity: 0.015, heatCapacity: 0.6 },
  water: { density: 62.4, viscosity: 1.0, heatCapacity: 1.0 },
  multiphase: { density: 45.0, viscosity: 1.8, heatCapacity: 0.7 }
};

const PIPE_SCHEDULES = {
  '40': { '2': 2.067, '3': 3.068, '4': 4.026, '6': 6.065, '8': 7.981, '10': 10.02, '12': 11.938 },
  '80': { '2': 1.939, '3': 2.900, '4': 3.826, '6': 5.761, '8': 7.625, '10': 9.562, '12': 11.374 },
  '160': { '2': 1.687, '3': 2.624, '4': 3.438, '6': 5.187, '8': 6.813, '10': 8.500, '12': 10.126 }
};

const ROUGHNESS_VALUES = {
  'new_steel': 0.0018,
  'corroded_steel': 0.018,
  'plastic': 0.00006,
  'concrete': 0.012
};

const FITTING_EQUIV_LENGTH = {
  'elbow90': 30, // L/D
  'elbow45': 16,
  'tee': 60,
  'valve': 45,
  'other': 10
};

// --- Sub-Components ---

const StepIndicator = ({ currentStep, steps, onStepClick }) => (
  <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
    {steps.map((step, index) => (
      <div 
        key={step.id} 
        className={`flex items-center cursor-pointer group ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}
        onClick={() => onStepClick(index)}
      >
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
          ${index === currentStep ? 'bg-[#3b82f6] text-white ring-4 ring-[#3b82f6]/20' : 
            index < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'}
        `}>
          {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
        </div>
        <span className={`ml-2 text-sm font-medium whitespace-nowrap ${index === currentStep ? 'text-white' : 'text-slate-400'}`}>
          {step.title}
        </span>
        {index < steps.length - 1 && (
          <div className="w-12 h-0.5 mx-2 bg-slate-700" />
        )}
      </div>
    ))}
  </div>
);

const PipelineSegmentsTable = ({ segments, onChange }) => {
  const addSegment = () => {
    const newId = segments.length > 0 ? Math.max(...segments.map(s => s.id)) + 1 : 1;
    onChange([...segments, { 
      id: newId, 
      name: `Segment ${newId}`, 
      length: 1000, 
      elevation: 0, 
      roughness: 'new_steel', 
      fittings: { elbow90: 0, elbow45: 0, tee: 0, valve: 0 },
      heatTransfer: 'adiabatic',
      ambientTemp: 60
    }]);
  };

  const removeSegment = (id) => {
    if (segments.length > 1) {
      onChange(segments.filter(s => s.id !== id));
    }
  };

  const updateSegment = (id, field, value) => {
    onChange(segments.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateFittings = (id, type, val) => {
    onChange(segments.map(s => 
      s.id === id ? { ...s, fittings: { ...s.fittings, [type]: parseInt(val) || 0 } } : s
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Route Geometry & Segmentation</h3>
        <Button size="sm" onClick={addSegment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Segment
        </Button>
      </div>

      <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-slate-300">Name</TableHead>
              <TableHead className="text-slate-300">Length (ft)</TableHead>
              <TableHead className="text-slate-300">Elev. Change (ft)</TableHead>
              <TableHead className="text-slate-300">Roughness</TableHead>
              <TableHead className="text-slate-300">Heat Transfer</TableHead>
              <TableHead className="text-slate-300 text-center">Fittings</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((seg, idx) => (
              <TableRow key={seg.id} className="border-slate-800 hover:bg-slate-800/30">
                <TableCell className="text-center font-mono text-slate-500">{idx + 1}</TableCell>
                <TableCell>
                  <Input 
                    value={seg.name} 
                    onChange={(e) => updateSegment(seg.id, 'name', e.target.value)}
                    className="h-8 bg-slate-950 border-slate-700" 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={seg.length} 
                    onChange={(e) => updateSegment(seg.id, 'length', parseFloat(e.target.value))}
                    className="h-8 bg-slate-950 border-slate-700 w-24" 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={seg.elevation} 
                    onChange={(e) => updateSegment(seg.id, 'elevation', parseFloat(e.target.value))}
                    className="h-8 bg-slate-950 border-slate-700 w-24" 
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={seg.roughness} 
                    onValueChange={(val) => updateSegment(seg.id, 'roughness', val)}
                  >
                    <SelectTrigger className="h-8 w-32 bg-slate-950 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {Object.keys(ROUGHNESS_VALUES).map(k => (
                        <SelectItem key={k} value={k}>{k.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                   <Select 
                    value={seg.heatTransfer} 
                    onValueChange={(val) => updateSegment(seg.id, 'heatTransfer', val)}
                  >
                    <SelectTrigger className="h-8 w-32 bg-slate-950 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="adiabatic">Adiabatic</SelectItem>
                      <SelectItem value="isothermal">Isothermal</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white">
                          <Settings className="w-4 h-4 mr-2" />
                          {Object.values(seg.fittings).reduce((a, b) => a + b, 0)} Items
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-700 p-4 w-64">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white mb-2">Fitting Counts</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Label className="text-xs">90° Elbows</Label>
                            <Input type="number" size="sm" className="h-6 text-xs" value={seg.fittings.elbow90} onChange={(e) => updateFittings(seg.id, 'elbow90', e.target.value)} />
                            <Label className="text-xs">45° Elbows</Label>
                            <Input type="number" size="sm" className="h-6 text-xs" value={seg.fittings.elbow45} onChange={(e) => updateFittings(seg.id, 'elbow45', e.target.value)} />
                            <Label className="text-xs">Tees</Label>
                            <Input type="number" size="sm" className="h-6 text-xs" value={seg.fittings.tee} onChange={(e) => updateFittings(seg.id, 'tee', e.target.value)} />
                            <Label className="text-xs">Valves</Label>
                            <Input type="number" size="sm" className="h-6 text-xs" value={seg.fittings.valve} onChange={(e) => updateFittings(seg.id, 'valve', e.target.value)} />
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSegment(seg.id)}
                    className="text-slate-500 hover:text-red-400 hover:bg-slate-800"
                    disabled={segments.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 bg-slate-800/50 flex justify-between text-sm text-slate-400 border-t border-slate-700">
          <span>Total Segments: {segments.length}</span>
          <div className="space-x-4">
             <span>Total Length: <span className="text-white font-mono">{segments.reduce((acc, s) => acc + (s.length || 0), 0).toLocaleString()} ft</span></span>
             <span>Net Elevation: <span className="text-white font-mono">{segments.reduce((acc, s) => acc + (s.elevation || 0), 0).toLocaleString()} ft</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const PipelineSizerPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsFullscreenApp, setShowMainSidebar } = useApplicationLayout();
  
  // Set fullscreen mode on mount
  useEffect(() => {
    setIsFullscreenApp(true);
    setShowMainSidebar(false);
    return () => {
      setIsFullscreenApp(false);
      setShowMainSidebar(true);
    };
  }, [setIsFullscreenApp, setShowMainSidebar]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);

  // --- State: Inputs ---
  const [fluidType, setFluidType] = useState('oil');
  const [flowRate, setFlowRate] = useState(5000);
  const [flowUnit, setFlowUnit] = useState('bpd');
  const [fluidProps, setFluidProps] = useState(DEFAULT_FLUID_PROPS['oil']);
  
  const [segments, setSegments] = useState([
    { id: 1, name: 'Main Line', length: 5000, elevation: 100, roughness: 'new_steel', fittings: { elbow90: 2, elbow45: 0, tee: 1, valve: 1 }, heatTransfer: 'isothermal', ambientTemp: 60 }
  ]);

  const [constraints, setConstraints] = useState({
    maxVelocity: 15, // ft/s
    minVelocity: 3,
    maxPressureDrop: 500, // psi
    erosionalVelocityRatio: 0.8,
    standard: 'API 14E'
  });

  const [designParams, setDesignParams] = useState({
    startPressure: 1000, // psi
    startTemp: 120, // F
    schedule: '40',
    material: 'CS'
  });

  // --- Calculations ---
  const performCalculation = () => {
    setIsCalculating(true);

    // Simulate Calculation Engine Latency
    setTimeout(() => {
      const calculatedResults = [];
      const density = fluidProps.density; // lb/ft3
      const viscosity = fluidProps.viscosity; // cP
      const pipeSchedule = PIPE_SCHEDULES[designParams.schedule];

      // Calculate for each standard diameter
      Object.entries(pipeSchedule).forEach(([nps, idInches]) => {
        const idFeet = idInches / 12;
        const areaSqFt = (Math.PI * Math.pow(idFeet, 2)) / 4;
        
        // Convert flow to ft3/s (assuming liquid for simplicity of this demo engine)
        // 1 bpd = 5.615 ft3 / 86400 s = 0.000065 ft3/s
        let flowCfs = 0;
        if (flowUnit === 'bpd') flowCfs = flowRate * 0.000065;
        else if (flowUnit === 'm3d') flowCfs = flowRate * 0.000409; // approx
        else flowCfs = flowRate; // assume cfs

        const velocity = flowCfs / areaSqFt; // ft/s
        
        // Reynolds Number: Re = (rho * v * D) / mu (needs conversion)
        // Re = (92.1 * rho(lb/ft3) * v(ft/s) * d(in)) / mu(cP) -> Simplified Field Unit Formula
        const reynolds = (92.1 * density * velocity * idInches) / viscosity;
        
        // Friction Factor (Swamee-Jain approximation for Colebrook)
        // f = 0.25 / [log10(e/3.7D + 5.74/Re^0.9)]^2
        // Assuming avg roughness from first segment for sizing scan
        const roughness = ROUGHNESS_VALUES[segments[0].roughness] / 12; // ft
        const epsilon = roughness / idFeet;
        let f = 0.02; // laminar default
        if (reynolds > 2300) {
            f = 0.25 / Math.pow(Math.log10(epsilon/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
        } else {
            f = 64 / reynolds;
        }

        // Pressure Drop Calculation (Darcy-Weisbach)
        // dP = f * (L/D) * (rho * v^2) / 2
        let totalPressureDrop = 0;
        let totalElevationDrop = 0;
        let totalEquivalentLength = 0;
        let currentPressure = designParams.startPressure;

        segments.forEach(seg => {
            // Fittings Equivalent Length
            const fitLen = 
                (seg.fittings.elbow90 * FITTING_EQUIV_LENGTH.elbow90 * idFeet) +
                (seg.fittings.elbow45 * FITTING_EQUIV_LENGTH.elbow45 * idFeet) +
                (seg.fittings.tee * FITTING_EQUIV_LENGTH.tee * idFeet) +
                (seg.fittings.valve * FITTING_EQUIV_LENGTH.valve * idFeet);
            
            totalEquivalentLength += seg.length + fitLen;

            // Friction Loss (psi)
            // Head Loss (ft) h_f = f * (L/D) * (v^2 / 2g)
            const g = 32.174;
            const headLoss = f * ((seg.length + fitLen) / idFeet) * (Math.pow(velocity, 2) / (2 * g));
            const frictionDrop = (headLoss * density) / 144; // psi

            // Elevation Loss (psi)
            // dP_elev = rho * delta_h / 144
            const elevDrop = (density * seg.elevation) / 144; 

            totalPressureDrop += frictionDrop;
            totalElevationDrop += elevDrop;
        });

        const totalDrop = totalPressureDrop + totalElevationDrop;
        const arrivalPressure = designParams.startPressure - totalDrop;

        // Erosional Velocity (API 14E)
        // Ve = C / sqrt(rho), C=100 for continuous
        const erosionalVelocity = 100 / Math.sqrt(density);
        const erosionRatio = velocity / erosionalVelocity;

        // Status Check
        let status = 'pass';
        const flags = [];
        if (velocity > constraints.maxVelocity) { status = 'fail'; flags.push('Max Velocity Exceeded'); }
        if (velocity < constraints.minVelocity) { status = 'warning'; flags.push('Low Velocity / Solids Risk'); }
        if (arrivalPressure < 0) { status = 'fail'; flags.push('Negative Arrival Pressure'); }
        if (erosionRatio > constraints.erosionalVelocityRatio) { status = 'warning'; flags.push('Erosion Risk'); }
        if (totalDrop > constraints.maxPressureDrop) { status = 'warning'; flags.push('High Pressure Drop'); }

        calculatedResults.push({
            nps,
            idInches,
            velocity: velocity.toFixed(2),
            reynolds: reynolds.toFixed(0),
            frictionFactor: f.toFixed(4),
            totalDrop: totalDrop.toFixed(1),
            arrivalPressure: arrivalPressure.toFixed(1),
            erosionRatio: erosionRatio.toFixed(2),
            status,
            flags
        });
      });

      setResults(calculatedResults);
      setIsCalculating(false);
      setCurrentStep(3); // Jump to results
      toast({
        title: "Calculation Successful",
        description: "Hydraulic analysis complete for all standard sizes.",
        className: "bg-emerald-600 text-white border-none"
      });
    }, 1200);
  };

  // --- Step Content Renderers ---

  const renderFluidStep = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Droplets className="w-5 h-5 text-blue-400"/> Fluid Definition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label className="text-slate-300">Fluid Type</Label>
                <Select value={fluidType} onValueChange={(v) => { setFluidType(v); setFluidProps(DEFAULT_FLUID_PROPS[v]); }}>
                    <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="oil">Crude Oil (Single Phase)</SelectItem>
                        <SelectItem value="gas">Natural Gas (Single Phase)</SelectItem>
                        <SelectItem value="water">Produced Water</SelectItem>
                        <SelectItem value="multiphase">Multiphase (Black Oil)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Density (lb/ft³)</Label>
                    <Input type="number" className="bg-slate-950 border-slate-700" value={fluidProps.density} onChange={e => setFluidProps({...fluidProps, density: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Viscosity (cP)</Label>
                    <Input type="number" className="bg-slate-950 border-slate-700" value={fluidProps.viscosity} onChange={e => setFluidProps({...fluidProps, viscosity: parseFloat(e.target.value)})} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Flow Rate</Label>
                    <Input type="number" className="bg-slate-950 border-slate-700" value={flowRate} onChange={e => setFlowRate(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Unit</Label>
                    <Select value={flowUnit} onValueChange={setFlowUnit}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="bpd">BPD</SelectItem>
                            <SelectItem value="m3d">m³/d</SelectItem>
                            <SelectItem value="mmscfd">MMSCFD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>

             {fluidType === 'multiphase' && (
                 <div className="p-3 bg-amber-900/20 border border-amber-900/50 rounded-md text-amber-200 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong>Multiphase Mode:</strong> Using simplified homogeneous flow model. 
                        Ensure liquid holdup correlations are verified for high gas fractions.
                    </div>
                 </div>
             )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 shadow-xl">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><Thermometer className="w-5 h-5 text-red-400"/> Operating Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Inlet Pressure (psig)</Label>
                        <Input type="number" className="bg-slate-950 border-slate-700" value={designParams.startPressure} onChange={e => setDesignParams({...designParams, startPressure: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">Inlet Temp (°F)</Label>
                        <Input type="number" className="bg-slate-950 border-slate-700" value={designParams.startTemp} onChange={e => setDesignParams({...designParams, startTemp: parseFloat(e.target.value)})} />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
         <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center border-4 border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Wind className="w-16 h-16 text-[#3b82f6]" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">Hydraulic Engine Ready</h3>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto">
                    Define fluid properties to initialize friction loss and heat transfer models.
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-8">
                 <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-xs text-slate-500 uppercase">Viscosity</div>
                    <div className="text-lg font-mono text-white">{fluidProps.viscosity} cP</div>
                 </div>
                 <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-xs text-slate-500 uppercase">Density</div>
                    <div className="text-lg font-mono text-white">{fluidProps.density} lb/ft³</div>
                 </div>
                 <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="text-xs text-slate-500 uppercase">Flow</div>
                    <div className="text-lg font-mono text-white">{flowRate.toLocaleString()}</div>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderGeometryStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <Card className="bg-slate-900 border-slate-700 shadow-xl">
        <CardContent className="p-6">
           <PipelineSegmentsTable segments={segments} onChange={setSegments} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400"/> Pipe Specification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-slate-300">Material</Label>
                    <Select value={designParams.material} onValueChange={(v) => setDesignParams({...designParams, material: v})}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="CS">Carbon Steel (API 5L)</SelectItem>
                            <SelectItem value="SS">Stainless Steel (316L)</SelectItem>
                            <SelectItem value="CRA">Corrosion Resistant Alloy</SelectItem>
                            <SelectItem value="HDPE">HDPE</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-slate-300">Schedule / Wall Thickness</Label>
                    <Select value={designParams.schedule} onValueChange={(v) => setDesignParams({...designParams, schedule: v})}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="40">Schedule 40</SelectItem>
                            <SelectItem value="80">Schedule 80</SelectItem>
                            <SelectItem value="160">Schedule 160</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-700">
             <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><Scale className="w-5 h-5 text-yellow-400"/> Design Constraints</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-slate-300 text-xs">Max Velocity (ft/s)</Label>
                        <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={constraints.maxVelocity} onChange={e => setConstraints({...constraints, maxVelocity: parseFloat(e.target.value)})} />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-slate-300 text-xs">Min Velocity (ft/s)</Label>
                        <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={constraints.minVelocity} onChange={e => setConstraints({...constraints, minVelocity: parseFloat(e.target.value)})} />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-slate-300 text-xs">Max Pressure Drop (psi)</Label>
                        <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={constraints.maxPressureDrop} onChange={e => setConstraints({...constraints, maxPressureDrop: parseFloat(e.target.value)})} />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-slate-300 text-xs">Erosion Ratio Limit</Label>
                        <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={constraints.erosionalVelocityRatio} onChange={e => setConstraints({...constraints, erosionalVelocityRatio: parseFloat(e.target.value)})} />
                     </div>
                </div>
                <div className="pt-2">
                    <Label className="text-slate-300 text-xs mb-2 block">Standard Preset</Label>
                    <div className="flex gap-2">
                        {['API 14E', 'ISO 13623', 'NORSOK'].map(std => (
                            <Badge 
                                key={std} 
                                variant={constraints.standard === std ? 'default' : 'outline'}
                                className={`cursor-pointer ${constraints.standard === std ? 'bg-[#3b82f6]' : 'border-slate-600 text-slate-400'}`}
                                onClick={() => setConstraints({...constraints, standard: std})}
                            >
                                {std}
                            </Badge>
                        ))}
                    </div>
                </div>
             </CardContent>
         </Card>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Summary Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2 bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Performance vs Diameter</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={results}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="idInches" stroke="#94a3b8" label={{ value: 'Diameter (in)', position: 'insideBottom', offset: -5 }} />
                            <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Pressure Drop (psi)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Velocity (ft/s)', angle: 90, position: 'insideRight' }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="totalDrop" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.2} name="Pressure Drop" />
                            <Line yAxisId="right" type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={2} name="Velocity" />
                            <ReferenceLine yAxisId="right" y={constraints.maxVelocity} stroke="#ef4444" strokeDasharray="3 3" label="Max Vel" />
                            <ReferenceLine yAxisId="right" y={constraints.minVelocity} stroke="#f59e0b" strokeDasharray="3 3" label="Min Vel" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center h-[300px] space-y-4">
                    {(() => {
                        const optimal = results?.find(r => r.status === 'pass');
                        if (optimal) {
                            return (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-white">{optimal.nps}"</div>
                                        <div className="text-sm text-slate-400">Optimal NPS Size</div>
                                    </div>
                                    <div className="text-sm text-center text-slate-400 px-4">
                                        Provides balanced velocity ({optimal.velocity} ft/s) and pressure drop ({optimal.totalDrop} psi) within constraints.
                                    </div>
                                </>
                            );
                        } else {
                            return (
                                <div className="text-center text-red-400">
                                    <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold">No Passing Solution</h4>
                                    <p className="text-sm">Adjust constraints or pipe schedule.</p>
                                </div>
                            );
                        }
                    })()}
                </CardContent>
             </Card>
        </div>

        {/* Detailed Table */}
        <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Detailed Size Screening</CardTitle>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-slate-800">
                        <TableRow>
                            <TableHead className="text-slate-300">NPS</TableHead>
                            <TableHead className="text-slate-300">ID (in)</TableHead>
                            <TableHead className="text-slate-300">Velocity (ft/s)</TableHead>
                            <TableHead className="text-slate-300">Reynolds</TableHead>
                            <TableHead className="text-slate-300">Total dP (psi)</TableHead>
                            <TableHead className="text-slate-300">Arr. Press. (psi)</TableHead>
                            <TableHead className="text-slate-300">Erosion Ratio</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Flags</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results && results.map(row => (
                            <TableRow key={row.nps} className="border-slate-800 hover:bg-slate-800/30">
                                <TableCell className="font-bold text-white">{row.nps}"</TableCell>
                                <TableCell className="text-slate-400">{row.idInches.toFixed(3)}</TableCell>
                                <TableCell className={
                                    parseFloat(row.velocity) > constraints.maxVelocity ? 'text-red-400 font-bold' : 
                                    parseFloat(row.velocity) < constraints.minVelocity ? 'text-amber-400' : 'text-emerald-400'
                                }>{row.velocity}</TableCell>
                                <TableCell className="text-slate-400 font-mono text-xs">{parseInt(row.reynolds).toLocaleString()}</TableCell>
                                <TableCell className="text-slate-300">{row.totalDrop}</TableCell>
                                <TableCell className={parseFloat(row.arrivalPressure) < 0 ? 'text-red-400' : 'text-slate-300'}>{row.arrivalPressure}</TableCell>
                                <TableCell className={parseFloat(row.erosionRatio) > 1 ? 'text-red-400' : 'text-slate-300'}>{row.erosionRatio}</TableCell>
                                <TableCell>
                                    <Badge variant={row.status === 'pass' ? 'default' : 'destructive'} className={
                                        row.status === 'pass' ? 'bg-emerald-600' : 
                                        row.status === 'warning' ? 'bg-amber-600' : 'bg-red-600'
                                    }>
                                        {row.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {row.flags.map(f => (
                                            <span key={f} className="text-[10px] bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-400">{f}</span>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Pipeline Sizer Studio | Petrolord Facilities</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
         {/* Studio Header */}
         <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/modules/facilities')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-500" />
                        Pipeline Sizer Studio
                    </h1>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="bg-slate-800 px-1.5 rounded text-amber-500 font-mono">Project: DEFAULT</span>
                        <span>•</span>
                        <span>Fluid: {fluidType.toUpperCase()}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-900/20" disabled={isCalculating} onClick={performCalculation}>
                    {isCalculating ? (
                        <>
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Calculator className="w-4 h-4 mr-2" />
                            Run Analysis
                        </>
                    )}
                </Button>
            </div>
         </header>

         {/* Main Content Area */}
         <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
                <StepIndicator 
                    currentStep={currentStep} 
                    steps={[
                        { id: 'fluid', title: 'Fluid Properties' }, 
                        { id: 'geo', title: 'Route & Geometry' }, 
                        { id: 'constraints', title: 'Design Constraints' }, 
                        { id: 'results', title: 'Results Analysis' }
                    ]} 
                    onStepClick={setCurrentStep}
                />

                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {renderFluidStep()}
                        </motion.div>
                    )}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {renderGeometryStep()}
                        </motion.div>
                    )}
                    {currentStep === 2 && ( // Repurposing geometry render for constraints page logic clarity in this demo, usually separate
                         <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {renderGeometryStep()} 
                        </motion.div>
                    )}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {renderResultsStep()}
                        </motion.div>
                    )}
                </AnimatePresence>
            
                {/* Navigation Footer */}
                <div className="mt-8 flex justify-between border-t border-slate-800 pt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="border-slate-700 text-slate-300 hover:text-white"
                    >
                        Back
                    </Button>
                    {currentStep < 3 && (
                        <Button 
                            onClick={() => {
                                if (currentStep === 2) performCalculation();
                                else setCurrentStep(currentStep + 1);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {currentStep === 2 ? 'Run Calculation' : 'Next Step'} <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
         </main>
      </div>
    </>
  );
};

export default PipelineSizerPage;
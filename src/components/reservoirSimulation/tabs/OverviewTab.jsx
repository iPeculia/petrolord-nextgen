import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Grid3X3, 
  Layers, 
  Droplets, 
  Activity, 
  Thermometer, 
  Maximize2,
  Calendar,
  Box,
  Share2,
  MapPin,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';

const OverviewTab = () => {
  const { state, dispatch } = useReservoirSimulation();
  const { selectedModel, simulationState } = state;

  // Empty State / Landing Page view
  if (!selectedModel) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-6 bg-slate-950">
        <div className="text-center space-y-4 max-w-2xl">
           <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
             Reservoir Simulation Lab
           </h1>
           <p className="text-slate-400 text-lg">
             Select a model to begin analyzing reservoir behavior, fluid flow dynamics, and recovery mechanisms.
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
           <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group" onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'lab' })}>
              <CardHeader>
                 <PlayCircle className="w-8 h-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                 <CardTitle>Simulation Lab</CardTitle>
                 <CardDescription>Run interactive simulations</CardDescription>
              </CardHeader>
           </Card>
           <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                 <Grid3X3 className="w-8 h-8 text-blue-500 mb-2" />
                 <CardTitle>Model Library</CardTitle>
                 <CardDescription>Access pre-built reservoirs</CardDescription>
              </CardHeader>
           </Card>
           <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                 <Activity className="w-8 h-8 text-purple-500 mb-2" />
                 <CardTitle>Advanced Analytics</CardTitle>
                 <CardDescription>Detailed production data</CardDescription>
              </CardHeader>
           </Card>
        </div>
        
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white mt-8"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'lab' })}
        >
          Go to Simulation Lab <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Derived calculations for display
  const totalCells = (selectedModel.nx || 0) * (selectedModel.ny || 0) * (selectedModel.nz || 0);
  const activeCells = selectedModel.activeCells || Math.floor(totalCells * 0.85); // Mock active cells if missing
  const progressPercent = ((simulationState.currentTimeStep || 0) / (simulationState.totalTimeSteps || 1)) * 100;
  
  // Safe access for nested properties
  const fluidProps = selectedModel.fluidProps || {};
  const rockProps = selectedModel.rockProps || {};
  const wells = selectedModel.wells || [];

  return (
    <ScrollArea className="h-full w-full bg-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{selectedModel.name}</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                {selectedModel.type || 'Standard Model'}
              </Badge>
            </div>
            <p className="text-slate-400 max-w-2xl text-lg">{selectedModel.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-slate-700">
               {selectedModel.field || 'Synthetic Field'}
            </Badge>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-slate-700">
               {selectedModel.country || 'Global'}
            </Badge>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Model Specs */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Simulation Status Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-200">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Simulation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Progress (Time Step {simulationState.currentTimeStep} / {simulationState.totalTimeSteps})</span>
                    <span className="text-emerald-400 font-mono">{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800/50">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Start Date</div>
                      <div className="text-slate-200 font-mono text-sm">01 Jan 2024</div>
                    </div>
                     <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Duration</div>
                      <div className="text-slate-200 font-mono text-sm">{(selectedModel.timeSteps?.length || 0) * 30} Days</div>
                    </div>
                     <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Step Size</div>
                      <div className="text-slate-200 font-mono text-sm">30 Days</div>
                    </div>
                     <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Steps</div>
                      <div className="text-slate-200 font-mono text-sm">{simulationState.totalTimeSteps}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid & Reservoir Properties */}
            <div className="grid md:grid-cols-2 gap-6">
               <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <Grid3X3 className="w-4 h-4 text-purple-400" />
                    Grid Specification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Dimensions (NX, NY, NZ)</span>
                    <span className="text-slate-200 font-mono">{selectedModel.nx} x {selectedModel.ny} x {selectedModel.nz}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Total Cells</span>
                    <span className="text-slate-200 font-mono">{totalCells.toLocaleString()}</span>
                  </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Active Cells</span>
                    <span className="text-slate-200 font-mono">{activeCells.toLocaleString()}</span>
                  </div>
                   <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-400 text-sm">Grid Type</span>
                    <span className="text-slate-200 text-sm">Corner Point Geometry</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <Layers className="w-4 h-4 text-orange-400" />
                    Rock Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Avg. Porosity</span>
                    <span className="text-slate-200 font-mono">{rockProps.avgPorosity ? (rockProps.avgPorosity * 100).toFixed(1) + '%' : '18-25%'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Avg. Permeability</span>
                    <span className="text-slate-200 font-mono">{rockProps.avgPerm ? rockProps.avgPerm + ' mD' : '50-500 mD'}</span>
                  </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400 text-sm">Rock Compressibility</span>
                    <span className="text-slate-200 font-mono text-xs">3.0e-6 psi⁻¹</span>
                  </div>
                   <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-400 text-sm">Environment</span>
                    <span className="text-slate-200 text-sm">{selectedModel.environment || 'Fluvial Deltaic'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fluid Properties */}
             <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    Fluid System & Initial Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phase Properties</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Oil Gravity</span>
                        <span className="text-slate-200">35° API</span>
                      </div>
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Gas Specific Gravity</span>
                        <span className="text-slate-200">0.75 (Air=1)</span>
                      </div>
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Water Salinity</span>
                        <span className="text-slate-200">25,000 ppm</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Initial State</h4>
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Initial Pressure (Datum)</span>
                        <span className="text-slate-200">3500 psi</span>
                      </div>
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Temperature</span>
                        <span className="text-slate-200">180° F</span>
                      </div>
                       <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Datum Depth</span>
                        <span className="text-slate-200">8000 ft</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

          </div>

          {/* Right Column - Wells & Contacts */}
          <div className="space-y-6">
            
            {/* Well Summary */}
            <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Well Configuration
                  </CardTitle>
                  <CardDescription>Active wells in the simulation model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {wells.map((well, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${well.type === 'Producer' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                          <div>
                            <div className="text-sm font-medium text-slate-200">{well.name}</div>
                            <div className="text-[10px] text-slate-500">{well.type} • ({well.x}, {well.y})</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-[10px] h-5 ${well.status === 'Active' ? 'text-emerald-500 border-emerald-500/20' : 'text-slate-500 border-slate-700'}`}>
                          {well.status || 'Active'}
                        </Badge>
                      </div>
                    ))}
                    {wells.length === 0 && (
                      <div className="text-sm text-slate-500 text-center py-4">No wells configured</div>
                    )}
                  </div>
                </CardContent>
            </Card>

            {/* Fluid Contacts */}
             <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <Maximize2 className="w-4 h-4 text-yellow-400" />
                    Fluid Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative pt-6 pb-2 px-2">
                    {/* Visual Representation */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col opacity-20 pointer-events-none rounded overflow-hidden">
                      <div className="h-1/3 bg-yellow-500 w-full" />
                      <div className="h-1/3 bg-green-600 w-full" />
                      <div className="h-1/3 bg-blue-600 w-full" />
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-center border-b border-dashed border-slate-600 pb-1">
                        <span className="text-xs text-yellow-400 font-medium">Gas-Oil Contact (GOC)</span>
                        <span className="text-sm text-slate-200 font-mono">2360 m</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-dashed border-slate-600 pb-1">
                        <span className="text-xs text-blue-400 font-medium">Oil-Water Contact (OWC)</span>
                        <span className="text-sm text-slate-200 font-mono">2420 m</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>

            {/* Boundary Conditions */}
            <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <Box className="w-4 h-4 text-slate-400" />
                    Boundary Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Type</span>
                     <span className="text-slate-200">No-Flow (Closed)</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Aquifer Support</span>
                     <span className="text-slate-200">Bottom Drive (Weak)</span>
                   </div>
                   <p className="text-xs text-slate-500 mt-2 bg-slate-900 p-2 rounded border border-slate-800">
                      Boundaries are modeled as sealing faults on all 4 sides with a weak bottom-water aquifer support acting on the lowest layer.
                   </p>
                </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default OverviewTab;
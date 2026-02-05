import React from 'react';
import { Droplets, Thermometer, AlertTriangle, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_FLUID_PROPS } from '../../utils/constants';

const Step1FluidPVT = ({ fluidType, setFluidType, fluidProps, setFluidProps, flowRate, setFlowRate, flowUnit, setFlowUnit, designParams, setDesignParams }) => {
  return (
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
                    <Input type="number" className="bg-slate-950 border-slate-700 text-white" value={fluidProps.density} onChange={e => setFluidProps({...fluidProps, density: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Viscosity (cP)</Label>
                    <Input type="number" className="bg-slate-950 border-slate-700 text-white" value={fluidProps.viscosity} onChange={e => setFluidProps({...fluidProps, viscosity: parseFloat(e.target.value)})} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Flow Rate</Label>
                    <Input type="number" className="bg-slate-950 border-slate-700 text-white" value={flowRate} onChange={e => setFlowRate(parseFloat(e.target.value))} />
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
                        <Input type="number" className="bg-slate-950 border-slate-700 text-white" value={designParams.startPressure} onChange={e => setDesignParams({...designParams, startPressure: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">Inlet Temp (°F)</Label>
                        <Input type="number" className="bg-slate-950 border-slate-700 text-white" value={designParams.startTemp} onChange={e => setDesignParams({...designParams, startTemp: parseFloat(e.target.value)})} />
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
};

export default Step1FluidPVT;
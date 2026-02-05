import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Activity } from 'lucide-react';

const InteractiveFormula = () => {
  // Darcy's Law: Q = (k * A * dP) / (mu * L)
  // k in Darcies, A in cm2, dP in atm, mu in cp, L in cm -> Q in cm3/s
  // Simplified for display units
  const [params, setParams] = useState({
    k: 100, // Permeability (mD)
    A: 50,  // Area (ft2)
    dP: 500, // Pressure Diff (psi)
    mu: 1.0, // Viscosity (cp)
    L: 1000 // Length (ft)
  });

  const [result, setResult] = useState(0);

  useEffect(() => {
    // Simple proportional calculation for educational demonstration
    // Not strictly unit converted for real world accuracy, but concept accuracy
    // Q proportional to k*A*dP / mu*L
    const q = (params.k * params.A * params.dP) / (params.mu * params.L);
    setResult(q);
  }, [params]);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Interactive Darcy's Law
        </CardTitle>
        <p className="text-xs text-slate-400 font-mono bg-slate-950/50 p-2 rounded border border-slate-800">
          Q = (k · A · ΔP) / (μ · L)
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Permeability (k)</Label>
              <span className="text-xs font-mono text-emerald-400">{params.k} mD</span>
            </div>
            <Slider 
              value={[params.k]} min={1} max={1000} step={10}
              onValueChange={([val]) => updateParam('k', val)} 
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Pressure Diff (ΔP)</Label>
              <span className="text-xs font-mono text-blue-400">{params.dP} psi</span>
            </div>
            <Slider 
              value={[params.dP]} min={0} max={5000} step={50}
              onValueChange={([val]) => updateParam('dP', val)} 
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Viscosity (μ)</Label>
              <span className="text-xs font-mono text-orange-400">{params.mu} cp</span>
            </div>
            <Slider 
              value={[params.mu]} min={0.1} max={100} step={0.1}
              onValueChange={([val]) => updateParam('mu', val)} 
            />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Calculated Flow Rate</p>
          <div className="text-3xl font-mono text-white font-bold tracking-tight">
            {result.toFixed(2)} 
            <span className="text-sm text-slate-500 font-normal ml-2">units</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveFormula;
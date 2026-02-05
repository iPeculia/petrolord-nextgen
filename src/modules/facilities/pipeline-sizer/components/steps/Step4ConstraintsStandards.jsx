import React from 'react';
import { Settings, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Step4ConstraintsStandards = ({ constraints, setConstraints, designParams, setDesignParams }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
                      <Input type="number" className="h-8 bg-slate-950 border-slate-700 text-white" value={constraints.maxVelocity} onChange={e => setConstraints({...constraints, maxVelocity: parseFloat(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Min Velocity (ft/s)</Label>
                      <Input type="number" className="h-8 bg-slate-950 border-slate-700 text-white" value={constraints.minVelocity} onChange={e => setConstraints({...constraints, minVelocity: parseFloat(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Max Pressure Drop (psi)</Label>
                      <Input type="number" className="h-8 bg-slate-950 border-slate-700 text-white" value={constraints.maxPressureDrop} onChange={e => setConstraints({...constraints, maxPressureDrop: parseFloat(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Erosion Ratio Limit</Label>
                      <Input type="number" className="h-8 bg-slate-950 border-slate-700 text-white" value={constraints.erosionalVelocityRatio} onChange={e => setConstraints({...constraints, erosionalVelocityRatio: parseFloat(e.target.value)})} />
                   </div>
              </div>
              <div className="pt-2">
                  <Label className="text-slate-300 text-xs mb-2 block">Standard Preset</Label>
                  <div className="flex gap-2">
                      {['API 14E', 'ISO 13623', 'NORSOK'].map(std => (
                          <Badge 
                              key={std} 
                              variant={constraints.standard === std ? 'default' : 'outline'}
                              className={`cursor-pointer ${constraints.standard === std ? 'bg-[#3b82f6]' : 'border-slate-600 text-slate-400 hover:text-white'}`}
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
  );
};

export default Step4ConstraintsStandards;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Cpu, GitMerge, Check } from 'lucide-react';

const RuleCard = ({ name, condition, action, active }) => (
  <Card className="bg-slate-900 border-slate-800 mb-4">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-purple-500/10 rounded-lg"><GitMerge className="w-5 h-5 text-purple-400" /></div>
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <div className="text-sm text-slate-400 flex gap-2 mt-1">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">IF {condition}</span>
            <span className="text-slate-600">➜</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">THEN {action}</span>
          </div>
        </div>
      </div>
      <Switch checked={active} />
    </CardContent>
  </Card>
);

const AutomatedDecisionPage = () => {
  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#BFFF00]" />
            Automated Decision Engine
          </h1>
          <p className="text-slate-400 mt-2">Configure logic rules for autonomous operational responses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white">Active Decision Rules</h3>
            <RuleCard 
               name="High Pressure Shut-in" 
               condition="WHP > 3000 psi AND Flow Rate < 100" 
               action="Close Choke Valve (SSV)" 
               active={true} 
            />
            <RuleCard 
               name="Gas Lift Optimization" 
               condition="Production Efficiency < 85%" 
               action="Increase Gas Injection +5%" 
               active={true} 
            />
            <RuleCard 
               name="Hydrate Prevention" 
               condition="Temp < 4°C AND Pressure > 1000 psi" 
               action="Start Methanol Injection" 
               active={false} 
            />
         </div>

         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
               <CardHeader><CardTitle className="text-white">Decision Log</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="flex gap-3 text-sm border-b border-slate-800 pb-3 last:border-0">
                        <div className="mt-1"><Check className="w-4 h-4 text-green-500" /></div>
                        <div>
                           <div className="text-slate-200 font-medium">Rule "High Pressure" Triggered</div>
                           <div className="text-slate-500 text-xs">Well A-05 • 2 hours ago</div>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default AutomatedDecisionPage;
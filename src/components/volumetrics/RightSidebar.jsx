import React from 'react';
import { Settings2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const RightSidebar = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400 mb-4 px-1">
        <Settings2 size={14} />
        <span className="text-xs">Global Settings</span>
      </div>

      <Accordion type="single" collapsible defaultValue="units" className="w-full">
        
        <AccordionItem value="units" className="border-slate-800">
          <AccordionTrigger className="text-sm py-2 text-slate-300 hover:no-underline">Units & Standards</AccordionTrigger>
          <AccordionContent className="space-y-3 p-1">
             <div className="grid gap-1.5">
                <Label className="text-xs text-slate-400">System</Label>
                <select className="bg-slate-900 border border-slate-800 rounded text-xs p-1.5 text-white focus:outline-none focus:border-slate-600">
                    <option>Field (Imperial)</option>
                    <option>Metric</option>
                </select>
             </div>
             <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-400">Use Standard Conditions</Label>
                <Switch className="scale-75" />
             </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="params" className="border-slate-800">
          <AccordionTrigger className="text-sm py-2 text-slate-300 hover:no-underline">Default Parameters</AccordionTrigger>
          <AccordionContent className="space-y-3 p-1">
             <div className="grid gap-1.5">
                <Label className="text-xs text-slate-400">Porosity Cutoff</Label>
                <Input type="number" className="h-7 text-xs bg-slate-900 border-slate-800" placeholder="0.05" />
             </div>
             <div className="grid gap-1.5">
                <Label className="text-xs text-slate-400">Water Saturation Cutoff</Label>
                <Input type="number" className="h-7 text-xs bg-slate-900 border-slate-800" placeholder="0.60" />
             </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default RightSidebar;
import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WellGeometryForm = () => {
  const { currentWell, setCurrentWell } = useWellPlanningDesign();
  
  // This would typically update the well metadata in context
  const handleChange = (field, value) => {
    // In a real app, this would call an update function. 
    // For Phase 2, we assume currentWell is read from context which might be managed elsewhere,
    // but let's assume we can update it locally or via context action.
    // console.log("Update well", field, value);
  };

  if (!currentWell) return null;

  return (
    <Card className="bg-[#1a1a2e] border-[#252541] mb-4">
      <CardContent className="p-4 grid gap-4">
        <h3 className="text-sm font-medium text-[#e0e0e0] border-b border-[#252541] pb-2">Well Parameters</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Well Name</Label>
            <Input 
              value={currentWell.name} 
              readOnly // Assuming managed by main context for now
              className="h-8 bg-[#252541] border-[#2f2f50] text-[#e0e0e0]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Well Type</Label>
            <Select defaultValue={currentWell.type}>
              <SelectTrigger className="h-8 bg-[#252541] border-[#2f2f50] text-[#e0e0e0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vertical">Vertical</SelectItem>
                <SelectItem value="Deviated">Deviated</SelectItem>
                <SelectItem value="Horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Target Depth (ft)</Label>
            <Input 
              type="number"
              defaultValue={currentWell.targetDepth} 
              className="h-8 bg-[#252541] border-[#2f2f50] text-[#e0e0e0]"
            />
          </div>
          <div className="space-y-1">
             <Label className="text-xs text-slate-400">Kick-off Point (ft)</Label>
             <Input 
               type="number"
               defaultValue={2000} 
               className="h-8 bg-[#252541] border-[#2f2f50] text-[#e0e0e0]"
             />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellGeometryForm;
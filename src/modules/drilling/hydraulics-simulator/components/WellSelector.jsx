import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';

const WellSelector = () => {
  const { wells, current_well, setCurrentWell, current_project } = useHydraulicsSimulator();

  // Filter wells by current project
  const projectWells = wells.filter(w => w.project_id === current_project?.project_id);

  const handleSelect = (value) => {
    const selected = wells.find(w => w.well_id === value);
    if (selected) setCurrentWell(selected);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-slate-800 p-1.5 rounded">
        <Target className="h-4 w-4 text-green-400" />
      </div>
      <Select value={current_well?.well_id || ''} onValueChange={handleSelect} disabled={!current_project}>
        <SelectTrigger className="w-[180px] h-8 bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-500 disabled:opacity-50">
          <SelectValue placeholder={current_project ? "Select Well" : "No Project"} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
          {projectWells.map(well => (
            <SelectItem key={well.well_id} value={well.well_id} className="focus:bg-slate-800 focus:text-white cursor-pointer">
              {well.name}
            </SelectItem>
          ))}
          {projectWells.length === 0 && (
             <div className="p-2 text-xs text-slate-500 text-center">No wells found</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WellSelector;
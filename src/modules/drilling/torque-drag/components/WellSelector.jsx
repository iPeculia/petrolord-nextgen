import React from 'react';
import { ChevronDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const WellSelector = () => {
  const { wells, current_well, setCurrentWell, current_project } = useTorqueDrag();

  const projectWells = wells.filter(w => w.project_id === current_project?.project_id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          disabled={!current_project}
          className="h-full px-3 py-2 hover:bg-slate-800 text-slate-300 border-r border-slate-800 rounded-none flex items-center gap-2 min-w-[200px] justify-between disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="truncate max-w-[140px]">
              {current_well ? current_well.name : 'Select Well'}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-slate-900 border-slate-700 text-slate-300">
        <DropdownMenuLabel>Wells</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {projectWells.length === 0 ? (
          <div className="px-2 py-2 text-xs text-slate-500">No wells in this project</div>
        ) : (
          projectWells.map((well) => (
            <DropdownMenuItem
              key={well.well_id}
              className={`cursor-pointer focus:bg-slate-800 focus:text-white ${
                current_well?.well_id === well.well_id ? 'bg-slate-800 text-white' : ''
              }`}
              onClick={() => setCurrentWell(well)}
            >
              <Target className="mr-2 h-4 w-4 text-green-500" />
              <span>{well.name}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WellSelector;
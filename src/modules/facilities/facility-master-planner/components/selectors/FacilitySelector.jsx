import React from 'react';
import { Check, ChevronDown, Plus, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const FacilitySelector = () => {
  const { facilities, currentProject, currentFacility, setCurrentFacility } = useFacilityMasterPlanner();

  const projectFacilities = currentProject 
    ? facilities.filter(f => f.project_id === currentProject.project_id)
    : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="outline" 
            className="w-[240px] justify-between border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            disabled={!currentProject}
        >
          <span className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 text-[#00cc66]" />
            {currentFacility ? currentFacility.name : 'Select Facility'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-slate-900 border-slate-700 text-slate-200">
        <DropdownMenuLabel>Facilities</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {projectFacilities.length > 0 ? (
          projectFacilities.map((facility) => (
            <DropdownMenuItem
              key={facility.facility_id}
              onSelect={() => setCurrentFacility(facility)}
              className="focus:bg-slate-800 focus:text-white cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{facility.name}</span>
                {currentFacility?.facility_id === facility.facility_id && (
                  <Check className="h-4 w-4 text-[#00cc66]" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
             <div className="px-2 py-2 text-xs text-slate-500 text-center">No facilities found</div>
        )}
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer text-[#00cc66]">
          <Plus className="mr-2 h-4 w-4" />
          <span>Add New Facility</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FacilitySelector;
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { cn } from '@/lib/utils';

const BreadcrumbNavigation = ({ className }) => {
  const { 
    currentProject, 
    currentFacility, 
    currentUnit,
    setCurrentProject,
    setCurrentFacility,
    setCurrentUnit
  } = useFacilityMasterPlanner();

  return (
    <nav className={cn("flex items-center text-sm text-slate-400 py-2", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <button 
            onClick={() => {
              setCurrentProject(null);
              setCurrentFacility(null);
              setCurrentUnit(null);
            }}
            className="hover:text-white flex items-center transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </button>
        </li>
        
        {currentProject && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <li>
              <button 
                onClick={() => {
                    setCurrentFacility(null);
                    setCurrentUnit(null);
                }}
                className={cn(
                    "hover:text-white transition-colors truncate max-w-[150px]",
                    !currentFacility && "text-white font-medium"
                )}
              >
                {currentProject.name}
              </button>
            </li>
          </>
        )}

        {currentFacility && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <li>
              <button 
                onClick={() => {
                    setCurrentUnit(null);
                }}
                className={cn(
                    "hover:text-white transition-colors truncate max-w-[150px]",
                    !currentUnit && "text-white font-medium"
                )}
              >
                {currentFacility.name}
              </button>
            </li>
          </>
        )}

        {currentUnit && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <li>
              <span className="text-white font-medium truncate max-w-[150px]">
                {currentUnit.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
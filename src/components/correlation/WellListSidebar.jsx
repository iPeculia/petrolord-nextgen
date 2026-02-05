import React, { useState } from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useProject, useWellLogCurves } from '@/hooks/useWellLogCorrelation';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { Loader2, ChevronDown, ChevronRight, ListTree } from 'lucide-react';

const WellListItem = ({ well }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { selectedWellId, selectWell } = useCorrelationPanelStore();
  const wellId = well.id;
  
  const { curveNames, isLoading: curvesLoading } = useWellLogCurves(wellId);

  if (!well) return null;

  return (
    <li 
      className={`well-list-item text-sm whitespace-nowrap ${selectedWellId === wellId ? 'selected' : ''}`}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => selectWell(wellId)}
        title={well.name}
      >
        <span>{well.name}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
          className="p-1 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full"
          title={isExpanded ? "Collapse Curves" : "Expand Curves"}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      {isExpanded && (
        <div className="pl-6 pr-3 pb-3">
          {curvesLoading ? (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Loader2 className="animate-spin mr-2" size={14} /> Loading curves...
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold mb-1 flex items-center"><ListTree size={14} className="mr-2"/> Available Curves</p>
              {curveNames && curveNames.length > 0 ? (
                <ul className="text-xs list-disc list-inside text-slate-600 dark:text-slate-300">
                  {curveNames.map(curve => <li key={curve}>{curve.toUpperCase()}</li>)}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">No log curves found.</p>
              )}
            </>
          )}
        </div>
      )}
    </li>
  );
};

const WellListSidebar = ({ isCollapsed, projectId }) => {
  const { data: projectData, isLoading } = useProject(projectId);
  const wells = useGlobalDataStore(state => state.wells);

  const wellsInProject = projectData?.wells?.map(w => wells[w.id]).filter(Boolean) || [];

  return (
    <div className={`well-list-sidebar correlation-sidebar border-r flex flex-col transition-all duration-300 ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="flex items-center justify-between p-2 border-b flex-shrink-0 overflow-hidden">
        <h2 className="text-lg font-semibold whitespace-nowrap">Project Wells</h2>
      </div>
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : wellsInProject.length === 0 ? (
          <p className="p-3 text-sm whitespace-nowrap">No wells in project.</p>
        ) : (
          <ul>
            {wellsInProject.map(well => (
              <WellListItem key={well.id} well={well} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WellListSidebar;
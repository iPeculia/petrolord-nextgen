import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Plus, 
  FolderOpen, Target, MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const LeftSidebar = () => {
  const { 
    sidebarCollapsed, toggleSidebar,
    projects, current_project, setCurrentProject,
    wells, current_well, setCurrentWell
  } = useTorqueDrag();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`bg-[#1a1a1a] border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Search & Actions Header */}
      {!sidebarCollapsed && (
        <div className="p-3 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search..." 
              className="pl-8 bg-slate-900 border-slate-700 text-slate-300 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800 h-8">
              <Plus className="h-3 w-3 mr-1" /> Proj
            </Button>
            <Button size="sm" variant="outline" className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800 h-8">
              <Plus className="h-3 w-3 mr-1" /> Well
            </Button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {!sidebarCollapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2 mt-2">Projects</h3>
          )}
          <div className="space-y-1">
            {filteredProjects.map(project => (
              <button
                key={project.project_id}
                onClick={() => setCurrentProject(project)}
                className={`w-full text-left px-2 py-2 rounded-md flex items-center group transition-colors ${
                  current_project?.project_id === project.project_id 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={project.name}
              >
                <FolderOpen className={`h-4 w-4 shrink-0 ${
                  current_project?.project_id === project.project_id ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                {!sidebarCollapsed && (
                  <span className="ml-2 text-sm truncate">{project.name}</span>
                )}
              </button>
            ))}
          </div>

          {!sidebarCollapsed && current_project && (
            <>
               <div className="h-px bg-slate-800 my-3 mx-2" />
               <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
                 Wells in {current_project.name.substring(0, 15)}...
               </h3>
               <div className="space-y-1">
                 {wells.filter(w => w.project_id === current_project.project_id).map(well => (
                   <button
                     key={well.well_id}
                     onClick={() => setCurrentWell(well)}
                     className={`w-full text-left px-2 py-2 rounded-md flex items-center group transition-colors ${
                       current_well?.well_id === well.well_id 
                         ? 'bg-green-900/20 text-green-400' 
                         : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                     }`}
                     title={well.name}
                   >
                     <Target className={`h-4 w-4 shrink-0 ${
                       current_well?.well_id === well.well_id ? 'text-green-500' : 'text-slate-500 group-hover:text-slate-300'
                     }`} />
                     {!sidebarCollapsed && (
                       <span className="ml-2 text-sm truncate">{well.name}</span>
                     )}
                   </button>
                 ))}
               </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-slate-800">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-slate-500 hover:text-slate-300 hover:bg-slate-800"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
import React, { useState } from 'react';
import { 
  FolderKanban, 
  Building2, 
  Search, 
  Plus, 
  Database, 
  Cog,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import StreamForm from '../forms/StreamForm'; // Placeholder import if needed later for modal triggers

const SectionHeader = ({ title, onAdd, icon: Icon, isCollapsed }) => {
  if (isCollapsed) return null;
  
  return (
    <div className="flex items-center justify-between px-4 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            {title}
        </div>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 hover:bg-[#0066cc] hover:text-white rounded-full"
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
        >
            <Plus className="w-3 h-3" />
        </Button>
    </div>
  );
};

const ListItem = ({ title, subtitle, isActive, onClick, icon: Icon, isCollapsed }) => {
  const content = (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center transition-all duration-200 border-l-2 group relative",
        isCollapsed ? "justify-center px-0 py-3" : "px-4 py-2.5 gap-3",
        isActive 
          ? "bg-[#0066cc]/10 border-[#0066cc] text-white" 
          : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
      )}
    >
      <Icon className={cn("shrink-0 transition-colors", isActive ? "text-[#0066cc]" : "text-slate-500 group-hover:text-slate-300", isCollapsed ? "w-5 h-5" : "w-4 h-4 mt-0.5")} />
      
      {!isCollapsed && (
        <div className="overflow-hidden min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 truncate group-hover:text-slate-400">{subtitle}</div>}
        </div>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-900 border-slate-700 text-white z-50">
            <p className="font-semibold">{title}</p>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

const LeftSidebar = ({ isCollapsed }) => {
  const { 
    projects, 
    facilities, 
    processUnits, 
    equipment,
    streams,
    currentProject, 
    currentFacility, 
    currentUnit, 
    currentEquipment,
    setCurrentProject,
    setCurrentFacility,
    setCurrentUnit,
    setCurrentEquipment,
    addProject,
    addFacility,
    addProcessUnit,
    addEquipment
  } = useFacilityMasterPlanner();

  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const projectFacilities = currentProject 
    ? facilities.filter(f => f.project_id === currentProject.project_id && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
    
  const facilityUnits = currentFacility
    ? processUnits.filter(u => u.facility_id === currentFacility.facility_id && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
    
  const unitEquipment = currentUnit
    ? equipment.filter(e => e.unit_id === currentUnit.unit_id && (e.tag_number.toLowerCase().includes(searchQuery.toLowerCase()) || e.model.toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-[#333333] shrink-0 animate-in fade-in duration-300">
            <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search assets..." 
                className="pl-9 bg-[#262626] border-[#404040] text-sm h-9 focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="pb-4">
            {/* Projects Section */}
            <SectionHeader title="Projects" onAdd={() => console.log('Add Project')} icon={FolderKanban} isCollapsed={isCollapsed} />
            {filteredProjects.map(project => (
            <ListItem 
                key={project.project_id}
                title={project.name}
                subtitle={project.location}
                isActive={currentProject?.project_id === project.project_id}
                onClick={() => {
                    setCurrentProject(project);
                    setCurrentFacility(null);
                    setCurrentUnit(null);
                    setCurrentEquipment(null);
                }}
                icon={FolderKanban}
                isCollapsed={isCollapsed}
            />
            ))}

            {/* Facilities Section */}
            {currentProject && (
                <>
                    <SectionHeader title="Facilities" onAdd={() => console.log('Add Facility')} icon={Building2} isCollapsed={isCollapsed} />
                    {projectFacilities.map(facility => (
                    <ListItem 
                        key={facility.facility_id}
                        title={facility.name}
                        subtitle={facility.facility_type}
                        isActive={currentFacility?.facility_id === facility.facility_id}
                        onClick={() => {
                            setCurrentFacility(facility);
                            setCurrentUnit(null);
                            setCurrentEquipment(null);
                        }}
                        icon={Building2}
                        isCollapsed={isCollapsed}
                    />
                    ))}
                    {/* Add Button for Collapsed Mode if needed? No, context is king. */}
                </>
            )}

            {/* Units Section */}
            {currentFacility && (
                <>
                    <SectionHeader title="Process Units" onAdd={() => console.log('Add Unit')} icon={Database} isCollapsed={isCollapsed} />
                    {facilityUnits.map(unit => (
                    <ListItem 
                        key={unit.unit_id}
                        title={unit.name}
                        subtitle={unit.unit_type}
                        isActive={currentUnit?.unit_id === unit.unit_id}
                        onClick={() => {
                            setCurrentUnit(unit);
                            setCurrentEquipment(null);
                        }}
                        icon={Database}
                        isCollapsed={isCollapsed}
                    />
                    ))}
                </>
            )}

            {/* Equipment Section */}
            {currentUnit && (
                <>
                    <SectionHeader title="Equipment" onAdd={() => console.log('Add Equipment')} icon={Cog} isCollapsed={isCollapsed} />
                    {unitEquipment.map(eq => (
                    <ListItem 
                        key={eq.equipment_id}
                        title={eq.tag_number}
                        subtitle={eq.equipment_type}
                        isActive={currentEquipment?.equipment_id === eq.equipment_id}
                        onClick={() => setCurrentEquipment(eq)}
                        icon={Cog}
                        isCollapsed={isCollapsed}
                    />
                    ))}
                </>
            )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeftSidebar;
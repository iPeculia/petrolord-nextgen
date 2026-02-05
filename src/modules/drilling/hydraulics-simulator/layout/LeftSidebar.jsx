import React, { useState } from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    ChevronLeft, ChevronRight, Search, Plus, 
    Folder, Target, FileText, Settings2, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const LeftSidebar = () => {
    const { 
        sidebarCollapsed, toggleSidebar, 
        projects, wells, scenarios, 
        current_project, current_well, current_scenario,
        setCurrentProject, setCurrentWell, setCurrentScenario,
        addProject, addWell, addScenario
    } = useHydraulicsSimulator();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredWells = wells.filter(w => w.project_id === current_project?.project_id && w.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredScenarios = scenarios.filter(s => s.well_id === current_well?.well_id && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div 
            className={cn(
                "h-full bg-[#1a1a1a] border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out relative z-40",
                sidebarCollapsed ? "w-[60px]" : "w-[240px]"
            )}
        >
            {/* Collapse Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="absolute -right-3 top-2 h-6 w-6 rounded-full bg-slate-800 border border-slate-700 shadow-sm z-50 text-slate-400 hover:text-white"
            >
                {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            {/* Search Bar */}
            {!sidebarCollapsed ? (
                <div className="p-3 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-500" />
                        <Input 
                            placeholder="Filter..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8 bg-slate-900 border-slate-700 pl-8 text-xs text-slate-200 focus-visible:ring-blue-600"
                        />
                    </div>
                </div>
            ) : (
                 <div className="p-3 border-b border-slate-800 flex justify-center">
                    <Search className="h-5 w-5 text-slate-500" />
                 </div>
            )}

            {/* Navigation Sections */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-4">
                    
                    {/* Projects Section */}
                    <div>
                        {!sidebarCollapsed && (
                            <div className="flex items-center justify-between px-2 mb-1">
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Projects</span>
                                <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-500 hover:text-blue-400" onClick={() => {}}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                        <div className="space-y-0.5">
                            {filteredProjects.map(project => (
                                <button
                                    key={project.project_id}
                                    onClick={() => setCurrentProject(project)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors group relative",
                                        current_project?.project_id === project.project_id 
                                            ? "bg-blue-600/10 text-blue-400" 
                                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                    )}
                                    title={sidebarCollapsed ? project.name : undefined}
                                >
                                    <Folder className="h-4 w-4 shrink-0" />
                                    {!sidebarCollapsed && <span className="truncate">{project.name}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wells Section */}
                    {current_project && (
                         <div>
                            {!sidebarCollapsed && (
                                <div className="flex items-center justify-between px-2 mb-1 mt-4">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Wells</span>
                                    <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-500 hover:text-green-400" onClick={() => {}}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                            <div className="space-y-0.5">
                                {filteredWells.map(well => (
                                    <button
                                        key={well.well_id}
                                        onClick={() => setCurrentWell(well)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors group",
                                            current_well?.well_id === well.well_id 
                                                ? "bg-green-600/10 text-green-400" 
                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        )}
                                        title={sidebarCollapsed ? well.name : undefined}
                                    >
                                        <Target className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="truncate">{well.name}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scenarios Section */}
                    {current_well && (
                         <div>
                            {!sidebarCollapsed && (
                                <div className="flex items-center justify-between px-2 mb-1 mt-4">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Scenarios</span>
                                    <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-500 hover:text-yellow-400" onClick={() => {}}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                            <div className="space-y-0.5">
                                {filteredScenarios.map(scenario => (
                                    <button
                                        key={scenario.scenario_id}
                                        onClick={() => setCurrentScenario(scenario)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors group",
                                            current_scenario?.scenario_id === scenario.scenario_id 
                                                ? "bg-yellow-600/10 text-yellow-400" 
                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        )}
                                        title={sidebarCollapsed ? scenario.name : undefined}
                                    >
                                        <Settings2 className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="truncate">{scenario.name}</span>}
                                        
                                        {!sidebarCollapsed && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-500">
                                                        <MoreHorizontal className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                                                    <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 cursor-pointer">Duplicate</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 focus:bg-slate-800 cursor-pointer">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </ScrollArea>
        </div>
    );
};

export default LeftSidebar;
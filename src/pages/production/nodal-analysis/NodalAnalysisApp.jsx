import React, { useState, useEffect } from 'react';
import NodalAnalysisStudio from '@/components/nodal-analysis/layout/NodalAnalysisStudio';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import CreateSessionModal from '@/components/nodal-analysis/modals/CreateSessionModal';
import { Button } from '@/components/ui/button';
import { Activity, Plus, Search, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

// Form Imports 
import WellDataForm from '@/components/nodal-analysis/forms/WellDataForm';
import EquipmentDataForm from '@/components/nodal-analysis/forms/EquipmentDataForm';
import FluidPropertiesForm from '@/components/nodal-analysis/forms/FluidPropertiesForm';
import CalculationParamsForm from '@/components/nodal-analysis/forms/CalculationParamsForm';

const ResultsPlaceholder = () => (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-xl m-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/20">
            <Activity className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium text-slate-200">Analysis Results</h3>
        <p className="text-slate-500 mt-2 max-w-md">Run calculations to generate IPR/VLP curves and determine the operating point.</p>
        <Button className="mt-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">Go to Calculations</Button>
    </div>
);

const SettingsPlaceholder = () => (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-xl m-6 animate-in fade-in zoom-in-95 duration-300">
         <h3 className="text-xl font-medium text-slate-300">Session Settings</h3>
         <p className="text-slate-500 mt-2">Configuration options for this specific session.</p>
    </div>
);

// Main Content Switcher
const SessionContent = () => {
    const { activeTab } = useNodalAnalysis();

    const renderContent = () => {
        switch (activeTab) {
            case 'wells': return <WellDataForm />;
            case 'equipment': return <EquipmentDataForm />;
            case 'fluids': return <FluidPropertiesForm />;
            case 'calculations': return <CalculationParamsForm />;
            case 'results': return <ResultsPlaceholder />;
            case 'settings': return <SettingsPlaceholder />;
            default: return <WellDataForm />;
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="flex-1 p-6 lg:p-10">
                 <div className="max-w-6xl mx-auto w-full">
                     <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {activeTab === 'wells' && "Well Configuration"}
                            {activeTab === 'equipment' && "Equipment & Geometry"}
                            {activeTab === 'fluids' && "Fluid Properties"}
                            {activeTab === 'calculations' && "Calculation Parameters"}
                            {activeTab === 'results' && "Analysis Results"}
                            {activeTab === 'settings' && "Settings"}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {activeTab === 'wells' && "Define basic wellbore identifiers and location data."}
                            {activeTab === 'equipment' && "Configure tubing, casing, and surface equipment specifications."}
                            {activeTab === 'fluids' && "Set PVT properties for oil, gas, and water phases."}
                            {activeTab === 'calculations' && "Setup nodal points and correlation parameters."}
                        </p>
                     </div>
                    {renderContent()}
                 </div>
            </div>
        </div>
    );
};

// Empty State / Session Selector (Fullscreen Design)
const SessionSelector = () => {
    const { sessions, loadSession, createSession, loadSessions } = useNodalAnalysis();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSessions();
    }, []);

    const filteredSessions = sessions?.filter(session => 
        session.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 w-full bg-[#0F172A]">
             <div className="w-full max-w-4xl space-y-8">
                 <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Select Analysis Session</h1>
                    <p className="text-slate-400 text-lg">Choose an existing session to resume work or create a new one.</p>
                 </div>

                 <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Search sessions..." 
                            className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Session
                    </Button>
                 </div>

                 <ScrollArea className="h-[500px] border border-slate-800 rounded-xl bg-[#0B1120] shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                        {filteredSessions.length === 0 ? (
                             <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                                 <FolderOpen className="w-16 h-16 mb-4 opacity-20" />
                                 <p className="text-lg font-medium">{searchTerm ? "No matching sessions found" : "No sessions available"}</p>
                                 <p className="text-sm opacity-70 mt-1">Create a new session to get started</p>
                             </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <div 
                                    key={session.id}
                                    onClick={() => loadSession(session.id)}
                                    className="group bg-slate-800/40 border border-slate-700 hover:border-blue-500/50 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:bg-slate-800/80 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-blue-600 rounded-full p-1">
                                            <Activity className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">{session.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                                                    {session.fluid_type || 'General'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5em]">
                                        {session.description || "No description provided for this session."}
                                    </p>
                                    
                                    <div className="text-xs text-slate-600 flex items-center justify-between pt-3 border-t border-slate-700/50">
                                        <span className="flex items-center">
                                            Updated {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                 </ScrollArea>
             </div>

             <CreateSessionModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={createSession}
            />
        </div>
    );
};

// App Wrapper
const NodalAnalysisInner = () => {
    const { currentSession } = useNodalAnalysis(); 
    
    if (!currentSession) {
        return <SessionSelector />;
    }

    return <SessionContent />;
};

const NodalAnalysisApp = () => {
    return (
        <NodalAnalysisStudio>
            <NodalAnalysisInner />
        </NodalAnalysisStudio>
    );
};

export default NodalAnalysisApp;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FolderOpen, Save, FileOutput, ChevronDown, ChevronRight, TestTube, Map, Database } from 'lucide-react';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import { PROJECT_STRUCTURE, findTestById } from '@/data/wellTestAnalysis/sampleDataMapping';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { loadSampleDataset } from '@/utils/wellTestAnalysis/sampleDataUtils';

const LeftSidebar = ({ projects = [], onNewProject }) => {
  const { dispatch, log } = useWellTestAnalysisContext();
  const [activeTestId, setActiveTestId] = useState(null);

  const handleTestClick = (testId, datasetId) => {
    try {
        log(`Loading sample test: ${testId}...`, 'info');
        setActiveTestId(testId);
        
        const { data, meta } = loadSampleDataset(datasetId);
        if (!data || data.length === 0) throw new Error("Dataset not found");

        dispatch({ type: 'SET_RAW_IMPORT', payload: { data: data, columns: ['time', 'pressure', 'rate'] } });
        dispatch({ type: 'SET_COLUMN_MAPPING', payload: { time: 'time', pressure: 'pressure', rate: 'rate' } });
        dispatch({ type: 'SET_STANDARDIZED_DATA', payload: data });
        
        // Auto-configure basic test parameters based on the sample
        dispatch({ 
            type: 'UPDATE_TEST_CONFIG', 
            payload: { 
                type: meta.type, 
                wellName: meta.meta.well, 
                porosity: 0.2, 
                compressibility: 3e-6, 
                rw: 0.35, 
                h: 50,
                initialPressure: data[0].pressure + 100 // Estimate
            } 
        });
        
        dispatch({ type: 'RUN_DIAGNOSTICS' });
        log(`Successfully loaded ${meta.title}`, 'success');
    } catch (error) {
        console.error("Failed to load test:", error);
        log("Failed to load sample test data.", "error");
    }
  };

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      {/* Actions */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-800">
        <Button size="sm" className="bg-[#BFFF00] text-black hover:bg-[#a3d900]" onClick={onNewProject}>
            <Plus className="w-4 h-4 mr-1" /> New
        </Button>
        <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
            <FolderOpen className="w-4 h-4 mr-1" /> Open
        </Button>
      </div>

      {/* Navigation Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
           <div className="text-xs font-bold text-slate-500 px-2 py-2 uppercase tracking-wider">Project Explorer</div>
           
           <Accordion type="single" collapsible className="w-full" defaultValue="permian">
             {PROJECT_STRUCTURE.map((project) => (
                 <AccordionItem key={project.id} value={project.id} className="border-none">
                   <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white hover:no-underline px-2 py-2 group">
                      <span className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-blue-500" />
                        {project.name}
                      </span>
                   </AccordionTrigger>
                   <AccordionContent className="pl-0 pb-0">
                      {project.fields.map(field => (
                          <div key={field.id} className="ml-2 border-l border-slate-800 pl-2 mb-2">
                             <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-400">
                                <Map className="w-3 h-3" /> {field.name}
                             </div>
                             {field.wells.map(well => (
                                 <div key={well.id} className="ml-2 border-l border-slate-800 pl-2">
                                     <div className="px-2 py-1 text-xs text-slate-500 font-mono">
                                        {well.name}
                                     </div>
                                     <div className="flex flex-col gap-0.5 ml-2">
                                        {well.tests.map(test => (
                                            <Button 
                                                key={test.id}
                                                variant="ghost" 
                                                size="sm" 
                                                className={`
                                                    w-full justify-start h-7 text-xs truncate
                                                    ${activeTestId === test.id ? 'text-[#BFFF00] bg-slate-900/80' : 'text-slate-400 hover:text-[#BFFF00]'}
                                                `}
                                                onClick={() => handleTestClick(test.id, test.datasetId)}
                                            >
                                               <TestTube className="w-3 h-3 mr-2 shrink-0" />
                                               <span className="truncate">{test.name}</span>
                                            </Button>
                                        ))}
                                     </div>
                                 </div>
                             ))}
                          </div>
                      ))}
                   </AccordionContent>
                 </AccordionItem>
             ))}
           </Accordion>
           
           {projects.length === 0 && PROJECT_STRUCTURE.length === 0 && (
             <div className="p-4 text-center text-slate-500 text-xs italic">
               No projects loaded.
             </div>
           )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-2 border-t border-slate-800 grid grid-cols-2 gap-2">
         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Save className="w-4 h-4 mr-1" /> Save
         </Button>
         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <FileOutput className="w-4 h-4 mr-1" /> Export
         </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
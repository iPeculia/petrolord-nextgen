import React from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import ProjectForm from './ProjectForm';
import RiskRegisterTable from './RiskRegisterTable';
import RiskIdentificationForm from './RiskIdentificationForm';
import RiskMatrix from './RiskMatrix';

const SetupWorkspace = () => {
  return (
    <div className="h-[calc(100vh-140px)] w-full">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-[#333] bg-[#141414]">
            {/* Left Panel: Configuration & Form */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="bg-[#1a1a1a]">
                <div className="flex flex-col h-full gap-4 p-4 overflow-y-auto">
                    <div className="shrink-0">
                        <ProjectForm />
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <RiskIdentificationForm />
                    </div>
                </div>
            </ResizablePanel>
            
            <ResizableHandle className="bg-[#333]" />
            
            {/* Center Panel: Register Table */}
            <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4 bg-[#141414]">
                    <RiskRegisterTable />
                </div>
            </ResizablePanel>

            <ResizableHandle className="bg-[#333]" />

            {/* Right Panel: Visualization */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
                <div className="h-full p-4 bg-[#1a1a1a]">
                    <RiskMatrix />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
};

export default SetupWorkspace;
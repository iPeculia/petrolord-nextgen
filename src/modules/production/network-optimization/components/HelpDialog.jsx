import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const HelpDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] bg-[#0F172A] border-slate-800 text-slate-50 flex flex-col">
        <DialogHeader>
          <DialogTitle>Network Optimization Studio Help</DialogTitle>
          <DialogDescription>
            Comprehensive guide to navigating and using the studio.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 mt-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Getting Started</h3>
              <p className="text-slate-300 mb-2">
                The Network Optimization Studio allows you to model, analyze, and optimize production networks. 
                Start by creating a network or selecting a demo network from the header dropdown.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li>Create nodes (wells, junctions, sinks)</li>
                <li>Connect nodes with pipelines</li>
                <li>Define facilities and constraints</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Visualization Canvas</h3>
              <p className="text-slate-300 mb-2">
                The central canvas visualizes your network topology.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li><strong>Pan:</strong> Click and drag on the background.</li>
                <li><strong>Zoom:</strong> Use mouse wheel or control buttons.</li>
                <li><strong>Select:</strong> Click on any node or pipeline to view details in the right panel.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Optimization Workflows</h3>
              <p className="text-slate-300 mb-2">
                Use the "Optimization" tab in the sidebar to define scenarios.
              </p>
              <p className="text-slate-400">
                You can set objectives like "Maximize Production" or "Minimize Cost". The system runs simulations 
                to identify bottlenecks and suggests debottlenecking strategies.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
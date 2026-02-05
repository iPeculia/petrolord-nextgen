import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, FileQuestion, ExternalLink } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Nodal Analysis Help Center
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Documentation, FAQs, and guides for Nodal Analysis.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-2">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-200 border-b border-slate-700 pb-2">Getting Started</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Welcome to the Nodal Analysis Studio. This tool helps you optimize well performance by analyzing the interaction between the reservoir inflow and the wellbore outflow.
              </p>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                <li><strong>Well Data:</strong> Define well geometry and trajectory.</li>
                <li><strong>Equipment:</strong> Configure tubing, casing, and restrictions.</li>
                <li><strong>Fluids:</strong> Set PVT properties for oil, gas, and water.</li>
                <li><strong>Calculations:</strong> Run sensitivities and generate IPR/VLP curves.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
                 <FileQuestion className="w-4 h-4" /> FAQ
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <h4 className="font-medium text-blue-300 text-sm mb-1">How do I create a new IPR curve?</h4>
                  <p className="text-slate-400 text-xs">Navigate to the 'Analysis' tab and select 'IPR Construction'. You can choose between Vogel, Fetkovich, or Joshi models.</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <h4 className="font-medium text-blue-300 text-sm mb-1">Can I import data from Excel?</h4>
                  <p className="text-slate-400 text-xs">Yes, use the 'Import' button in the Well Data section to upload .csv or .xlsx files adhering to the standard template.</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-200 border-b border-slate-700 pb-2">External Resources</h3>
               <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 group">
                  <span className="text-sm font-medium">Official Documentation</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
               </a>
               <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 group">
                  <span className="text-sm font-medium">Video Tutorials</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
               </a>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t border-slate-800 bg-slate-900/50">
          <Button onClick={onClose} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
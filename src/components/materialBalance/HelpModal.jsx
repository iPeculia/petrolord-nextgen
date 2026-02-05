import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHelp } from '@/contexts/HelpContext';
import HelpGuide from './HelpGuide'; // Reusing the main help guide component inside the modal
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HelpModal = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useHelp();

  return (
    <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
      <DialogContent className="max-w-[90vw] h-[85vh] p-0 bg-[#0F172A] border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
           <DialogTitle className="text-white flex items-center gap-2">
             Material Balance Help Center
           </DialogTitle>
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsHelpModalOpen(false)} className="text-slate-400 hover:text-white">
               <X className="w-5 h-5" />
             </Button>
           </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
           <HelpGuide embedded={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
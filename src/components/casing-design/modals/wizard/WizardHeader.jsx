import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const WizardHeader = ({ isEditMode, name }) => {
  return (
    <DialogHeader className="px-8 py-5 border-b border-slate-800 bg-[#1E293B]">
      <DialogTitle className="text-xl font-bold tracking-tight">
          {isEditMode ? 'Edit Design Configuration' : 'Create New Design'}
      </DialogTitle>
      <DialogDescription className="text-slate-400">
         {isEditMode ? `Modifying: ${name}` : 'Setup casing or tubing string parameters and sections.'}
      </DialogDescription>
    </DialogHeader>
  );
};

export default WizardHeader;
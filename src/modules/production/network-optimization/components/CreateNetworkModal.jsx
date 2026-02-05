import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NetworkForm from './forms/NetworkForm';

// Reusing the NetworkForm inside the modal for better code reuse
const CreateNetworkModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-slate-800 text-slate-50 p-0 overflow-hidden">
        <NetworkForm 
            onSuccess={() => onOpenChange(false)} 
            onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNetworkModal;
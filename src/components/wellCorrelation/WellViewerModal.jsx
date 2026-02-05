import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WellLogViewer from './WellLogViewer';

const WellViewerModal = ({ open, onOpenChange, well }) => {
    // Basic settings for the modal viewer
    const settings = {
        verticalScale: 100, // 100 pixels per unit (assuming meter)
        depthUnit: well?.depthRange?.unit || 'M'
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[85vh] flex flex-col bg-slate-50 border-slate-200 p-0 overflow-hidden text-slate-900">
                <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                    <DialogTitle className="text-slate-900 flex items-center justify-between">
                        <span>Well Log Viewer: {well?.name}</span>
                        <div className="text-sm font-normal text-slate-500 flex gap-4">
                           <span>Field: {well?.field}</span>
                           <span>UWI: {well?.uwi}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 min-h-0 bg-slate-100 relative">
                     <WellLogViewer well={well} settings={settings} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WellViewerModal;
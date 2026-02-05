import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ScheduleReportModal = ({ isOpen, onClose, reportType, filters }) => {
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            variant: "default",
            title: "🚧 Feature In Progress",
            description: "This scheduling feature isn't implemented yet—but stay tuned!",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#1E293B] border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Schedule Report</DialogTitle>
                    <DialogDescription>
                        Configure automated delivery for the "{reportType.replace(/_/g, ' ')}" report.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                   <p className="text-center text-gray-400">Scheduling options will be available here.</p>
                </div>
                 <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleNotImplemented}>Save Schedule</Button>
                 </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleReportModal;
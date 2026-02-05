import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Shield, Box, Tag, Info, Clock, CheckCircle, XCircle } from 'lucide-react';

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start py-2">
        <div className="w-1/3 text-gray-400 font-medium flex items-center shrink-0">
            {React.createElement(icon, { className: "w-4 h-4 mr-2" })}
            {label}
        </div>
        <div className="w-2/3 text-white break-words">{value}</div>
    </div>
);

const JsonDiffViewer = ({ title, data }) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-gray-300 mt-2 mb-1">{title}</h4>
            <pre className="bg-gray-800 p-3 rounded-md text-xs text-white overflow-auto max-h-40">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

const AuditDetailModal = ({ log, isOpen, onClose }) => {
    if (!log) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Audit Log Details</DialogTitle>
                    <DialogDescription>
                        Detailed view of an event that occurred on {new Date(log.timestamp).toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <DetailItem icon={User} label="User" value={log.user_email || log.user_id} />
                    <DetailItem icon={Shield} label="Action" value={log.action} />
                    <DetailItem icon={Box} label="Resource Type" value={log.resource_type} />
                    {log.resource_name && <DetailItem icon={Tag} label="Resource Name" value={log.resource_name} />}
                    {log.resource_id && <DetailItem icon={Tag} label="Resource ID" value={log.resource_id} />}
                    <DetailItem icon={Clock} label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
                    <DetailItem 
                        icon={log.status === 'success' ? CheckCircle : XCircle} 
                        label="Status" 
                        value={<span className={log.status === 'success' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>} 
                    />
                    {log.description && <DetailItem icon={Info} label="Description" value={log.description} />}
                    {log.error_message && <DetailItem icon={XCircle} label="Error" value={log.error_message} />}
                </div>
                
                <div className="mt-4 space-y-4">
                    <JsonDiffViewer title="Old Value" data={log.old_value} />
                    <JsonDiffViewer title="New Value" data={log.new_value} />
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AuditDetailModal;
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Type, Tag, AlertTriangle, Send, User, Calendar, MessageSquare, Copy } from 'lucide-react';

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start py-2">
        <div className="w-1/4 text-gray-400 font-medium flex items-center shrink-0">
            {React.createElement(icon, { className: "w-4 h-4 mr-2" })}
            {label}
        </div>
        <div className="w-3/4 text-white break-words">{value}</div>
    </div>
);

const EmailDetailModal = ({ log, isOpen, onClose, onResend }) => {
    const { toast } = useToast();

    if (!log) return null;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard', description: `${label} copied.` });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Email Log Details</DialogTitle>
                    <DialogDescription>
                        Viewing details for email sent to {log.recipient_email}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 text-sm">
                    <DetailItem icon={Mail} label="Recipient" value={log.recipient_email} />
                    <DetailItem icon={Type} label="Email Type" value={log.email_type} />
                    <DetailItem icon={Tag} label="Subject" value={log.subject} />
                    <DetailItem icon={AlertTriangle} label="Status" value={log.status} />
                    {log.user_id && <DetailItem icon={User} label="User ID" value={log.user_id} />}
                    <DetailItem icon={Send} label="Sent At" value={log.sent_at ? new Date(log.sent_at).toLocaleString() : 'N/A'} />
                    <DetailItem icon={Calendar} label="Created At" value={new Date(log.created_at).toLocaleString()} />
                    {log.error_message && <DetailItem icon={MessageSquare} label="Error" value={log.error_message} />}
                </div>

                <div className="mt-6 flex-1 flex flex-col min-h-0">
                   <div className="flex justify-between items-center mb-2">
                     <h3 className="text-lg font-semibold text-white">Email Body</h3>
                     <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.body, "Email body")}>
                       <Copy className="w-4 h-4 mr-2" /> Copy HTML
                     </Button>
                   </div>
                    <div className="border border-gray-700 rounded-md flex-1 overflow-auto bg-gray-900">
                        <iframe
                            srcDoc={log.body}
                            title="Email Content"
                            className="w-full h-full bg-white"
                            sandbox="allow-same-origin"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    {log.status === 'failed' && (
                        <Button onClick={() => onResend(log)} className="bg-orange-500 hover:bg-orange-600">
                            Resend Email
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EmailDetailModal;
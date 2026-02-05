import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { resendEmail } from '@/lib/emailLogger';
import { Loader2 } from 'lucide-react';

const EmailResendModal = ({ log, isOpen, onClose, onResent }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleResend = async () => {
        if (!log) return;
        setLoading(true);
        try {
            await resendEmail(log.id);
            toast({ title: 'Success', description: 'Email has been queued for resending.' });
            onResent();
            onClose();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Resend Failed', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Resend Email Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to resend this email?
                        <div className="mt-4 text-sm space-y-1 text-gray-300">
                            <p><strong>To:</strong> {log?.recipient_email}</p>
                            <p><strong>Subject:</strong> {log?.subject}</p>
                        </div>
                        <p className="mt-2 text-yellow-400 text-xs">This might result in the user receiving a duplicate email.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResend} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Resend
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmailResendModal;
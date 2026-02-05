import { useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { logAction as auditLog } from '@/lib/auditLogger';

export const useAuditLog = () => {
    const { user } = useAuth();

    const logAction = useCallback(async (actionDetails) => {
        if (!user) {
            console.warn('Audit log skipped: User not authenticated.');
            return;
        }

        const logData = {
            user_id: user.id,
            user_email: user.email,
            status: 'success', // Default to success
            ...actionDetails,
        };
        
        // We don't need ip_address and user_agent on the client-side
        // as they can be faked. This should be handled by the server/edge function if needed.

        try {
            await auditLog(logData);
        } catch (error) {
            console.error('Failed to write audit log:', error);
        }
    }, [user]);

    return { logAction };
};
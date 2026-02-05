import { auditService as mainAuditService, ACTIONS, LOG_TYPES } from '@/services/auditService';

/**
 * Wrapper for the main AuditService to maintain Volumetrics-specific call signatures
 * while using the centralized audit logging system.
 */
export const AuditService = {
    /**
     * @deprecated Local log buffer is deprecated. Logs are now sent to DB via auditService.
     */
    logs: [],

    logAction: (user, action, target, details = {}) => {
        // Log to centralized service
        mainAuditService.logAction(
            action, 
            'volumetrics', 
            details.id || 'unknown', 
            { ...details, target }, 
            'success'
        );

        // Keep local return structure for compatibility
        return {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            userId: user?.id || 'anonymous',
            action,
            target,
            details
        };
    },

    getHistory: async () => {
        const { data } = await mainAuditService.fetchLogs({ 
            pageSize: 100, 
            filters: { resourceType: 'volumetrics' } 
        });
        return data || [];
    },

    exportLog: async () => {
        const history = await AuditService.getHistory();
        return JSON.stringify(history, null, 2);
    }
};
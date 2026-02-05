import { supabase } from '@/lib/customSupabaseClient';

/**
 * Standardized Audit Logger for Facility Layout Designer
 */
export const logAuditAction = async (layoutId, action, details = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('facility_layout_audit_log').insert({
            layout_id: layoutId,
            action: action, // e.g., 'CREATE_ITEM', 'UPDATE_STATUS', 'ADD_COMMENT'
            user_id: user.id,
            details: details // JSON object with old/new values, specific IDs, etc.
        });
    } catch (error) {
        console.error("Failed to log audit action:", error);
    }
};
import { supabase } from '@/lib/customSupabaseClient';
import { logAuditEvent, ACTIONS, LOG_TYPES } from '@/services/auditService';

export const SystemSettingsService = {
  // --- System Settings ---
  
  getAllSettings: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('group_name', { ascending: true })
      .order('setting_key', { ascending: true });
    
    if (error) throw error;
    
    // Transform array to object grouped by group_name for easier UI consumption if needed, 
    // or return flat list. Returning flat list is often more flexible.
    return data;
  },

  updateSetting: async (key, value, type, userId) => {
    try {
      // Fetch old value for audit log
      const { data: oldData } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single();

      const { data, error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: String(value), // Ensure stored as string
          last_updated_at: new Date(),
          last_updated_by: userId
        })
        .eq('setting_key', key)
        .select()
        .single();

      if (error) throw error;

      await logAuditEvent({
        action: ACTIONS.SYSTEM_UPDATE,
        resourceType: 'system_setting',
        resourceId: key,
        resourceName: key,
        oldValue: oldData?.setting_value,
        newValue: String(value),
        details: { type: 'setting_update' },
        logType: LOG_TYPES.SYSTEM
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error };
    }
  },

  // --- Feature Toggles ---

  getAllFeatures: async () => {
    const { data, error } = await supabase
      .from('feature_toggles')
      .select('*')
      .order('feature_key', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  toggleFeature: async (key, isEnabled, userId) => {
    try {
      const { data, error } = await supabase
        .from('feature_toggles')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date(),
          last_updated_by: userId
        })
        .eq('feature_key', key)
        .select()
        .single();

      if (error) throw error;

      await logAuditEvent({
        action: ACTIONS.SYSTEM_UPDATE,
        resourceType: 'feature_toggle',
        resourceId: key,
        resourceName: key,
        newValue: isEnabled ? 'enabled' : 'disabled',
        details: { type: 'feature_toggle' },
        logType: LOG_TYPES.SYSTEM
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error toggling feature:', error);
      return { success: false, error };
    }
  },

  // --- Maintenance Operations (Simulated for Frontend) ---
  
  // Note: Actual DB backup/restore usually requires backend/CLI access or specific Supabase API calls 
  // that might not be fully exposed via client-side JS for security. 
  // These are placeholders for logic that would likely trigger Edge Functions.
  
  triggerBackup: async () => {
    // In a real implementation, this would call an Edge Function
    console.log("Triggering database backup via Edge Function...");
    return new Promise(resolve => setTimeout(() => resolve({ success: true, timestamp: new Date() }), 2000));
  },

  clearCache: async () => {
    console.log("Clearing application cache...");
    // Logic to clear frontend stores/localStorage if needed
    return { success: true };
  }
};
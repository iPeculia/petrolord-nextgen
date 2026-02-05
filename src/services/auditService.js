import { supabase } from '@/lib/customSupabaseClient';

export const ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SYSTEM_UPDATE: 'SYSTEM_UPDATE',
  ACCESS_SENSITIVE: 'ACCESS_SENSITIVE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  VIEW: 'VIEW',
  COMPLIANCE_EVENT: 'COMPLIANCE_EVENT'
};

export const LOG_TYPES = {
  ACTION: 'action',
  ACCESS: 'access',
  SYSTEM: 'system',
  COMPLIANCE: 'compliance',
  SECURITY: 'security'
};

/**
 * Service for handling all audit and compliance logging
 */
export const auditService = {
  
  // --- Core Logging Functions ---

  /**
   * Log a standard user action (CRUD, business logic)
   */
  async logAction(action, resourceType, resourceId, details = {}, status = 'success') {
    return this._log({
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      log_type: LOG_TYPES.ACTION,
      status,
      details
    });
  },

  /**
   * Log data access (viewing sensitive info, downloads, exports)
   */
  async logDataAccess(resourceType, resourceId, accessType, reason = '', details = {}) {
    return this._log({
      action: `ACCESS_${accessType.toUpperCase()}`,
      resource_type: resourceType,
      resource_id: resourceId,
      log_type: LOG_TYPES.ACCESS,
      details: { ...details, reason }
    });
  },

  /**
   * Log system events (errors, maintenance, API failures)
   */
  async logSystemEvent(eventType, description, severity = 'medium', details = {}) {
    return this._log({
      action: eventType,
      resource_type: 'SYSTEM',
      log_type: LOG_TYPES.SYSTEM,
      details: { ...details, description, severity }
    });
  },

  /**
   * Log compliance specific events (policy violations, critical failures)
   */
  async logComplianceEvent(logType, description, severity = 'high', details = {}) {
    // Log to main audit table for unified view
    await this._log({
      action: ACTIONS.COMPLIANCE_EVENT,
      resource_type: 'COMPLIANCE',
      log_type: LOG_TYPES.COMPLIANCE,
      details: { ...details, description, compliance_type: logType, severity }
    });
  },

  /**
   * Internal helper to write to Supabase
   */
  async _log(payload) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Destructure to separate top-level columns from details
      const { 
        action, 
        resource_type, 
        resource_id, 
        resource_name,
        log_type, 
        status, 
        error_message, 
        old_value, 
        new_value, 
        description,
        details 
      } = payload;

      const logEntry = {
        user_id: user?.id || null,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        action,
        resource_type,
        resource_id,
        resource_name,
        log_type,
        status: status || 'success',
        error_message,
        description,
        old_value,
        new_value,
        details: details || {}
      };

      const { error } = await supabase.from('audit_logs').insert([logEntry]);
      
      if (error) {
        console.error('Failed to write audit log:', error);
      }
    } catch (err) {
      console.error('Audit service error:', err);
    }
  },

  // --- Fetching & Reporting ---

  /**
   * Fetch audit logs with filtering and pagination
   */
  async fetchLogs({ page = 1, pageSize = 20, filters = {} }) {
    let query = supabase
      .from('audit_logs')
      .select('*, profiles(email, display_name, role)', { count: 'exact' });

    // Apply filters
    if (filters.userId) query = query.eq('user_id', filters.userId);
    if (filters.action) query = query.ilike('action', `%${filters.action}%`);
    if (filters.resourceType) query = query.eq('resource_type', filters.resourceType);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.logType) query = query.eq('log_type', filters.logType);
    
    if (filters.startDate) query = query.gte('timestamp', filters.startDate);
    if (filters.endDate) query = query.lte('timestamp', filters.endDate);
    
    if (filters.search) {
      // Basic search on common fields
      query = query.or(`action.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.order('timestamp', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;
    
    return { data, count };
  },

  /**
   * Get retention policies
   */
  async getRetentionPolicies() {
    const { data, error } = await supabase.from('retention_policies').select('*');
    if (error) throw error;
    return data;
  },

  /**
   * Update retention policy
   */
  async updateRetentionPolicy(id, updates) {
    const { data, error } = await supabase
      .from('retention_policies')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data;
  },

  /**
   * Get compliance alerts
   */
  async getComplianceAlerts() {
    const { data, error } = await supabase
      .from('compliance_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  /**
   * Dismiss alert
   */
  async dismissAlert(id) {
    const { error } = await supabase
      .from('compliance_alerts')
      .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
      .eq('id', id);
      
    if (error) throw error;
  }
};

// Helper function for direct usage matching the import in systemSettingsService
export const logAuditEvent = async ({ action, resourceType, resourceId, resourceName, details, logType, severity, oldValue, newValue }) => {
    return auditService._log({
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        resource_name: resourceName,
        log_type: logType || LOG_TYPES.ACTION,
        old_value: oldValue,
        new_value: newValue,
        details: {
            ...details,
            severity: severity || 'info'
        }
    });
};
import { supabase } from '@/lib/customSupabaseClient';

const LOGS_PER_PAGE = 25;

/**
 * Logs an action to the audit_logs table.
 * This should be called from the `useAuditLog` hook.
 */
export async function logAction(logData) {
  const { error } = await supabase.from('audit_logs').insert([logData]);

  if (error) {
    console.error('Error logging audit action:', error);
    // In a real app, you might want a fallback logging mechanism here.
  }
}

/**
 * Fetches audit logs with filtering, searching, and sorting.
 */
export async function getAuditLogs({
  page = 1,
  searchTerm = '',
  filters = { action: 'all', resourceType: 'all', status: 'all', userId: 'all', dateRange: {} },
  sort = { by: 'timestamp', ascending: false },
}) {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' });

  if (searchTerm) {
    query = query.or(`user_email.ilike.%${searchTerm}%,resource_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Filters
  if (filters.action && filters.action !== 'all') {
    query = query.eq('action', filters.action);
  }
  if (filters.resourceType && filters.resourceType !== 'all') {
    query = query.eq('resource_type', filters.resourceType);
  }
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.userId && filters.userId !== 'all') {
    query = query.eq('user_id', filters.userId);
  }
  if (filters.dateRange?.from) {
    query = query.gte('timestamp', filters.dateRange.from.toISOString());
  }
  if (filters.dateRange?.to) {
    query = query.lte('timestamp', filters.dateRange.to.toISOString());
  }

  // Sorting
  if (sort.by) {
    query = query.order(sort.by, { ascending: sort.ascending });
  }

  // Pagination
  const from = (page - 1) * LOGS_PER_PAGE;
  const to = from + LOGS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }

  return { logs: data || [], count: count || 0 };
}
import { supabase } from '@/lib/customSupabaseClient';
import { logAction as auditLog } from '@/lib/auditLogger';

const LOGS_PER_PAGE = 20;

/**
 * Fetches email logs with pagination, filtering, searching, and sorting.
 * @param {object} options - The query options.
 * @param {number} options.page - The current page number.
 * @param {string} options.searchTerm - The term to search for.
 * @param {object} options.filters - The filters for role and status.
 * @param {object} options.sort - The sorting configuration.
 * @returns {Promise<{logs: Array, count: number}>}
 */
export async function getEmailLogs({ page = 1, searchTerm = '', filters = { type: 'all', status: 'all', dateRange: {} }, sort = { by: 'created_at', ascending: false } }) {
  let query = supabase
    .from('email_logs')
    .select('*', { count: 'exact' });

  // Search
  if (searchTerm) {
    query = query.or(`recipient_email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
  }

  // Filters
  if (filters.type && filters.type !== 'all') {
    query = query.eq('email_type', filters.type);
  }
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.dateRange.from) {
    query = query.gte('created_at', filters.dateRange.from.toISOString());
  }
  if (filters.dateRange.to) {
    query = query.lte('created_at', filters.dateRange.to.toISOString());
  }

  // Sorting
  if (sort.by) {
    query = query.order(sort.by, { ascending: sort.ascending, nullsFirst: false });
  }

  // Pagination
  const from = (page - 1) * LOGS_PER_PAGE;
  const to = from + LOGS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: logs, error, count } = await query;

  if (error) {
    console.error('Error fetching email logs:', error);
    throw error;
  }

  return { logs, count };
}

/**
 * Resends a failed email. This function invokes a Supabase Edge Function.
 * @param {string} emailLogId - The ID of the email log to resend.
 * @returns {Promise<object>} The result from the edge function.
 */
export async function resendEmail(emailLogId) {
    const { data: log, error: fetchError } = await supabase.from('email_logs').select('*').eq('id', emailLogId).single();
    if(fetchError || !log) throw new Error("Email log not found.");
    if(log.status === 'sent') throw new Error("Cannot resend an email that was already sent successfully.");

    try {
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: { 
                isResend: true,
                emailLogId: emailLogId,
                recipient: log.recipient_email,
                subject: log.subject,
                html: log.body,
            },
        });

        if (error) throw error;

        await supabase.from('email_logs').update({ status: 'sent', sent_at: new Date().toISOString(), error_message: null }).eq('id', emailLogId);
        
        await auditLog({
            action: 'EMAIL_RESENT',
            resource_type: 'EMAIL',
            resource_id: emailLogId,
            resource_name: `Email to ${log.recipient_email}`,
            old_value: { status: 'failed' },
            new_value: { status: 'sent' },
            description: `Email resent: ${log.email_type} to ${log.recipient_email}`
        });

        return data;
    } catch (error) {
        await supabase.from('email_logs').update({ status: 'failed', error_message: error.message }).eq('id', emailLogId);
        
        await auditLog({
            action: 'EMAIL_RESENT',
            resource_type: 'EMAIL',
            resource_id: emailLogId,
            resource_name: `Email to ${log.recipient_email}`,
            status: 'failure',
            error_message: error.message,
            description: `Failed to resend email: ${log.email_type} to ${log.recipient_email}`
        });
        
        throw error;
    }
}

/**
 * Deletes an email log from the database.
 * @param {string} emailLogId - The ID of the email log to delete.
 */
export async function deleteEmailLog(emailLogId) {
  const { error } = await supabase
    .from('email_logs')
    .delete()
    .eq('id', emailLogId);

  if (error) {
    console.error('Error deleting email log:', error);
    throw new Error(error.message);
  }
}
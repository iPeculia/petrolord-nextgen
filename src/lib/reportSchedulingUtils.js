import { supabase } from '@/lib/customSupabaseClient';

export const getScheduledReports = async () => {
    const { data, error } = await supabase.from('scheduled_reports').select('*').order('created_at', { ascending: false });
    if (error) throw new Error('Failed to fetch scheduled reports.');
    return data;
};

export const createScheduledReport = async (reportData, adminId) => {
    const { data, error } = await supabase.from('scheduled_reports').insert([{ ...reportData, admin_id: adminId, created_by: adminId }]).select().single();
    if (error) throw new Error('Failed to create scheduled report.');
    return data;
};

export const updateScheduledReport = async (id, reportData) => {
    const { data, error } = await supabase.from('scheduled_reports').update(reportData).eq('id', id).select().single();
    if (error) throw new Error('Failed to update scheduled report.');
    return data;
};

export const deleteScheduledReport = async (id) => {
    const { error } = await supabase.from('scheduled_reports').delete().eq('id', id);
    if (error) throw new Error('Failed to delete scheduled report.');
};

export const toggleScheduledReport = async (id, enabled) => {
    return updateScheduledReport(id, { enabled });
};
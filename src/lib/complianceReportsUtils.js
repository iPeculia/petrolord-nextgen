import { supabase } from '@/lib/customSupabaseClient';

const applyDateRange = (query, dateRange, column = 'timestamp') => {
    if (dateRange.from) {
        query = query.gte(column, dateRange.from.toISOString());
    }
    if (dateRange.to) {
        query = query.lte(column, dateRange.to.toISOString());
    }
    return query;
};

export async function getAllUsers() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, display_name, email')
            .order('display_name', { ascending: true });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users.');
    }
}

export async function generateSystemActivityReport(dateRange) {
    try {
        let query = supabase.from('audit_logs').select('*', { count: 'exact' });
        query = applyDateRange(query, dateRange);
        const { data, count, error } = await query;

        if (error) throw error;

        const failedActions = data.filter(log => log.status === 'failure').length;
        const successRate = count > 0 ? ((count - failedActions) / count) * 100 : 100;

        const userActivity = data.reduce((acc, log) => {
            if (log.user_email) {
                acc[log.user_email] = (acc[log.user_email] || 0) + 1;
            }
            return acc;
        }, {});
        const mostActiveUser = Object.keys(userActivity).length > 0 ? Object.entries(userActivity).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

        const actionTypes = data.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});
        const mostCommonAction = Object.keys(actionTypes).length > 0 ? Object.entries(actionTypes).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

        const summary = {
            totalActions: count,
            successRate: successRate.toFixed(2),
            failedActions,
            mostActiveUser,
            mostCommonAction,
            uniqueUsers: Object.keys(userActivity).length,
        };

        return {
            summary,
            details: data,
        };

    } catch (error) {
        console.error('Error generating system activity report:', error);
        throw new Error('Failed to generate system activity report.');
    }
}

export async function getUserActivityReport(userId, dateRange) {
    try {
        const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('display_name, email, role, created_at')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        let query = supabase.from('audit_logs').select('*', { count: 'exact' }).eq('user_id', userId);
        query = applyDateRange(query, dateRange);
        const { data, count, error } = await query;

        if (error) throw error;

        const failedActions = data.filter(log => log.status === 'failure').length;
        const successRate = count > 0 ? ((count - failedActions) / count) * 100 : 100;

        const summary = {
            'User Name': userProfile.display_name,
            'Email': userProfile.email,
            'Role': userProfile.role,
            'Total Actions': count,
            'Success Rate': `${successRate.toFixed(2)}%`,
            'Failed Actions': failedActions,
        };

        return { summary, details: data };

    } catch (error) {
        console.error('Error generating user activity report:', error);
        throw new Error('Failed to generate user activity report.');
    }
}

export async function getDataChangeReport(resourceType, dateRange) {
    try {
        const changeActions = ['CREATE', 'UPDATE', 'DELETE'];
        let query = supabase.from('audit_logs').select('*', { count: 'exact' }).in('action', changeActions);
        if (resourceType !== 'ALL') {
            query = query.eq('resource_type', resourceType);
        }
        query = applyDateRange(query, dateRange);
        const { data, count, error } = await query;

        if (error) throw error;

        const changesByType = data.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});

        const summary = {
            'Total Changes': count,
            'Created': changesByType['CREATE'] || 0,
            'Updated': changesByType['UPDATE'] || 0,
            'Deleted': changesByType['DELETE'] || 0,
        };

        const details = data.map(log => ({
            'Resource': `${log.resource_type}: ${log.resource_name || log.resource_id}`,
            'Action': log.action,
            'Changed By': log.user_email,
            'Timestamp': log.timestamp,
            'Old Value': JSON.stringify(log.old_value, null, 2),
            'New Value': JSON.stringify(log.new_value, null, 2),
        }));

        return { summary, details };
    } catch (error) {
        console.error('Error generating data change report:', error);
        throw new Error('Failed to generate data change report.');
    }
}

export async function getSecurityEventReport(dateRange) {
    try {
        const securityActions = ['LOGIN', 'LOGOUT', 'ROLE_CHANGE', 'STATUS_CHANGE', 'PASSWORD_RESET', 'LOGIN_FAILED'];
        let query = supabase.from('audit_logs').select('*', { count: 'exact' }).in('action', securityActions);
        query = applyDateRange(query, dateRange);
        const { data, count, error } = await query;

        if (error) throw error;

        const eventsByType = data.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});

        const summary = {
            'Total Security Events': count,
            'Logins': eventsByType['LOGIN'] || 0,
            'Failed Logins': eventsByType['LOGIN_FAILED'] || 0,
            'Role Changes': eventsByType['ROLE_CHANGE'] || 0,
            'Password Resets': eventsByType['PASSWORD_RESET'] || 0,
        };

        return { summary, details: data };
    } catch (error) {
        console.error('Error generating security event report:', error);
        throw new Error('Failed to generate security event report.');
    }
}


export async function getUserEnrollmentReport(dateRange) {
    try {
        let query = supabase.from('course_enrollments').select('*, profiles(display_name), courses(title)', { count: 'exact' });
        query = applyDateRange(query, dateRange, 'enrolled_at');
        const { data, count, error } = await query;

        if (error) throw error;

        const completions = data.filter(e => e.status === 'completed').length;
        const completionRate = count > 0 ? (completions / count) * 100 : 0;

        const summary = {
            'Total Enrollments': count,
            'Total Completions': completions,
            'Completion Rate': `${completionRate.toFixed(2)}%`,
        };
        
        const details = data.map(e => ({
            'Student': e.profiles?.display_name || 'N/A',
            'Course': e.courses?.title || 'N/A',
            'Enrolled At': new Date(e.enrolled_at).toLocaleString(),
            'Status': e.status,
            'Progress': `${e.progress_percentage}%`,
        }));

        return { summary, details };
    } catch(error) {
        console.error('Error generating enrollment report:', error);
        throw new Error('Failed to generate enrollment report.');
    }
}

export async function getCertificateReport(dateRange) {
     try {
        let query = supabase.from('certificates').select('*, profiles(display_name), courses(title)', { count: 'exact' });
        query = applyDateRange(query, dateRange, 'issued_date');
        const { data, count, error } = await query;

        if (error) throw error;

        const summary = {
            'Total Certificates Issued': count,
        };
        
        const details = data.map(c => ({
            'Student': c.profiles?.display_name || 'N/A',
            'Course': c.courses?.title || 'N/A',
            'Certificate Number': c.certificate_number,
            'Issued Date': new Date(c.issued_date).toLocaleString(),
        }));

        return { summary, details };
    } catch(error) {
        console.error('Error generating certificate report:', error);
        throw new Error('Failed to generate certificate report.');
    }
}

export async function getEmailReport(dateRange) {
    try {
        let query = supabase.from('email_logs').select('*', { count: 'exact' });
        query = applyDateRange(query, dateRange, 'sent_at');
        const { data, count, error } = await query;

        if (error) throw error;
        
        const failed = data.filter(e => e.status === 'failed').length;
        const successRate = count > 0 ? ((count - failed) / count) * 100 : 0;
        
        const summary = {
            'Total Emails Sent': count,
            'Failed Emails': failed,
            'Success Rate': `${successRate.toFixed(2)}%`,
        };

        return { summary, details: data };
    } catch(error) {
        console.error('Error generating email report:', error);
        throw new Error('Failed to generate email report.');
    }
}


export async function getFailureReport(dateRange) {
    try {
        let query = supabase.from('audit_logs').select('*', { count: 'exact' }).eq('status', 'failure');
        query = applyDateRange(query, dateRange);
        const { data, count, error } = await query;
        if (error) throw error;

        const summary = {
            'Total Failed Actions': count
        };

        return { summary, details: data };
    } catch(error) {
        console.error('Error generating failure report:', error);
        throw new Error('Failed to generate failure report.');
    }
}


export async function saveReportHistory(reportData) {
    const { error } = await supabase.from('report_history').insert([reportData]);
    if (error) {
        console.error('Error saving report history:', error);
    }
}
import { supabase } from '@/lib/customSupabaseClient';

const applyDateRange = (query, dateRange) => {
    if (dateRange.from) {
        query = query.gte('timestamp', dateRange.from.toISOString());
    }
    if (dateRange.to) {
        query = query.lte('timestamp', dateRange.to.toISOString());
    }
    return query;
};

export async function getAuditStats(dateRange) {
    try {
        // Total Actions (all time)
        const { count: totalActions, error: totalError } = await supabase
            .from('audit_logs')
            .select('*', { count: 'exact', head: true });
        if (totalError) throw totalError;

        // Stats within date range
        let rangeQuery = supabase.from('audit_logs').select('*', { count: 'exact' });
        rangeQuery = applyDateRange(rangeQuery, dateRange);
        const { data: rangeData, count: rangeCount, error: rangeError } = await rangeQuery;
        if (rangeError) throw rangeError;

        const failedActionsCount = rangeData.filter(log => log.status === 'failure').length;
        const successRate = rangeCount > 0 ? ((rangeCount - failedActionsCount) / rangeCount) * 100 : 100;

        const userActivity = rangeData.reduce((acc, log) => {
            if (log.user_email) {
                acc[log.user_email] = (acc[log.user_email] || 0) + 1;
            }
            return acc;
        }, {});
        const mostActiveUser = Object.keys(userActivity).length > 0 ? Object.entries(userActivity).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

        const actionTypes = rangeData.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});
        const mostCommonAction = Object.keys(actionTypes).length > 0 ? Object.entries(actionTypes).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

        return {
            totalActions,
            actionsInDateRange: rangeCount,
            failedActionsCount,
            successRate,
            mostActiveUser,
            mostCommonAction,
        };
    } catch (error) {
        console.error('Error fetching audit stats:', error);
        return {
            totalActions: 0,
            actionsInDateRange: 0,
            failedActionsCount: 0,
            successRate: 0,
            mostActiveUser: 'Error',
            mostCommonAction: 'Error',
        };
    }
}

export async function getActionsOverTime(dateRange) {
    try {
        let query = supabase.from('audit_logs').select('timestamp');
        query = applyDateRange(query, dateRange);
        const { data, error } = await query;
        if (error) throw error;

        const dailyCounts = data.reduce((acc, log) => {
            const date = new Date(log.timestamp).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Error fetching actions over time:', error);
        return [];
    }
}

export async function getActionsByType(dateRange) {
    try {
        let query = supabase.from('audit_logs').select('action');
        query = applyDateRange(query, dateRange);
        const { data, error } = await query;
        if (error) throw error;

        const typeCounts = data.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    } catch (error) {
        console.error('Error fetching actions by type:', error);
        return [];
    }
}

export async function getActionsByResourceType(dateRange) {
    try {
        let query = supabase.from('audit_logs').select('resource_type');
        query = applyDateRange(query, dateRange);
        const { data, error } = await query;
        if (error) throw error;

        const resourceCounts = data.reduce((acc, log) => {
            acc[log.resource_type] = (acc[log.resource_type] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(resourceCounts).map(([name, value]) => ({ name, value }));
    } catch (error) {
        console.error('Error fetching actions by resource type:', error);
        return [];
    }
}

export async function getTopUsers(dateRange, limit = 10) {
    try {
        let query = supabase.from('audit_logs').select('user_email');
        query = applyDateRange(query, dateRange);
        const { data, error } = await query;
        if (error) throw error;

        const userCounts = data.reduce((acc, log) => {
            if (log.user_email) {
                acc[log.user_email] = (acc[log.user_email] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(userCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching top users:', error);
        return [];
    }
}

export async function getRecentCriticalActions(limit = 10) {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('user_email, action, resource_type, resource_name, timestamp')
            .in('action', ['DELETE', 'ROLE_CHANGE', 'STATUS_CHANGE'])
            .order('timestamp', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching recent critical actions:', error);
        return [];
    }
}
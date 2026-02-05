import { supabase } from '@/lib/customSupabaseClient';

export const logReportAnalytics = async (analyticsData) => {
    try {
        const { error } = await supabase.from('report_analytics').insert([analyticsData]);
        if (error) throw error;
    } catch (error) {
        console.error('Error logging report analytics:', error);
        // Fail silently in UI, but log error
    }
};

export const getDashboardAnalytics = async (dateRange) => {
    try {
        // Step 1: Fetch report_analytics with date filtering
        let reportsQuery = supabase.from('report_analytics').select('*');
        if (dateRange) {
            reportsQuery = reportsQuery.gte('generated_at', dateRange.from.toISOString());
            reportsQuery = reportsQuery.lte('generated_at', dateRange.to.toISOString());
        }
        const { data: reports, error: reportsError } = await reportsQuery.order('generated_at', { ascending: false });
        if (reportsError) throw reportsError;

        if (!reports || reports.length === 0) {
            const { count: totalRules } = await supabase.from('anonymization_rules').select('id', { count: 'exact', head: true });
            return {
                stats: { totalReports: 0, totalRules: totalRules || 0, avgRulesPerReport: '0.00' },
                charts: { ruleDistribution: [], reportsOverTime: [] },
                recentReports: []
            };
        }

        // Step 2: Get unique creator IDs
        const generatorIds = [...new Set(reports.map(r => r.generated_by).filter(id => id))];
        let profilesMap = new Map();

        if (generatorIds.length > 0) {
            // Step 3: Fetch profiles for the creator IDs
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, display_name')
                .in('id', generatorIds);
            
            if (profilesError) {
                console.error('Error fetching profiles:', profilesError);
            } else {
                profilesMap = new Map(profilesData.map(p => [p.id, p.display_name]));
            }
        }

        // Step 4: Fetch all rules to calculate distribution
        const { data: rules, error: rulesError } = await supabase.from('anonymization_rules').select('id, rule_type');
        if (rulesError) throw rulesError;

        // --- Calculate Stats ---
        const totalReports = reports.length;
        const totalRules = rules.length;
        
        const totalFieldsAnonymized = reports.reduce((acc, report) => {
            const fields = report.filters_applied?.anonymization?.fields_anonymized;
            return acc + (Array.isArray(fields) ? fields.length : 0);
        }, 0);
        
        const avgRulesPerReport = totalReports > 0 ? (totalFieldsAnonymized / totalReports) : 0;

        // --- Prepare Chart Data ---
        // Rule Distribution
        const ruleDistribution = rules.reduce((acc, rule) => {
            acc[rule.rule_type] = (acc[rule.rule_type] || 0) + 1;
            return acc;
        }, {});
        const ruleDistributionData = Object.entries(ruleDistribution).map(([name, value]) => ({ name, value }));
        
        // Reports Over Time
        const reportsOverTime = reports.reduce((acc, report) => {
            const date = new Date(report.generated_at).toISOString().split('T')[0];
            const entry = acc.find(e => e.date === date);
            if(entry) {
                entry.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }
            return acc;
        }, []).sort((a,b) => new Date(a.date) - new Date(b.date));


        // Recent Reports with creator names mapped
        const recentReports = reports.slice(0, 5).map(r => ({
            name: r.report_type,
            created_by: profilesMap.get(r.generated_by) || 'N/A',
            created_at: r.generated_at,
            rule_count: r.filters_applied?.anonymization?.fields_anonymized?.length || 0
        }));

        return {
            stats: {
                totalReports,
                totalRules,
                avgRulesPerReport: avgRulesPerReport.toFixed(2)
            },
            charts: {
                ruleDistribution: ruleDistributionData,
                reportsOverTime,
            },
            recentReports
        };

    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        throw new Error('Could not fetch dashboard analytics.');
    }
};

export const getReportAnalytics = async (filters) => {
    try {
        let query = supabase.from('report_analytics').select('*', { count: 'exact' });
        
        if (filters?.dateRange) {
            query = query.gte('generated_at', filters.dateRange.from.toISOString());
            query = query.lte('generated_at', filters.dateRange.to.toISOString());
        }

        const { data, count, error } = await query.order('generated_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return { data: [], count: 0 };
        }

        const generatorIds = [...new Set(data.map(r => r.generated_by).filter(id => id))];
        let profilesMap = new Map();

        if (generatorIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, display_name')
                .in('id', generatorIds);
            if (!profilesError) {
                profilesMap = new Map(profilesData.map(p => [p.id, p.display_name]));
            }
        }
        
        const dataWithProfiles = data.map(item => ({
            ...item,
            generated_by_profile: {
                display_name: profilesMap.get(item.generated_by) || 'N/A'
            }
        }));

        return { data: dataWithProfiles, count };
    } catch (error) {
        console.error('Error fetching report analytics:', error);
        throw new Error('Could not fetch report analytics.');
    }
};

export const getReportUsageStats = async (dateRange) => {
    try {
        let query = supabase.from('report_analytics').select('report_type, generated_by, export_format, generation_time_ms, file_size_bytes, is_scheduled');
        
        if (dateRange) {
            query = query.gte('generated_at', dateRange.from.toISOString());
            query = query.lte('generated_at', dateRange.to.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;

        const totalReports = data.length;
        if (totalReports === 0) {
            return {
                totalReports: 0,
                avgGenerationTime: 0,
                avgFileSize: 0,
                reportsByType: [],
                reportsByExport: [],
                scheduledVsManual: { scheduled: 0, manual: 0 },
            };
        }

        const avgGenerationTime = data.reduce((acc, r) => acc + r.generation_time_ms, 0) / totalReports;
        const avgFileSize = data.reduce((acc, r) => acc + (r.file_size_bytes || 0), 0) / totalReports;

        const reportsByType = data.reduce((acc, r) => {
            const existing = acc.find(item => item.name === r.report_type);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: r.report_type, value: 1 });
            }
            return acc;
        }, []);

        const reportsByExport = data.reduce((acc, r) => {
            const format = r.export_format || 'view';
            const existing = acc.find(item => item.name === format);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: format, value: 1 });
            }
            return acc;
        }, []);
        
        const scheduledVsManual = data.reduce((acc, r) => {
            r.is_scheduled ? acc.scheduled++ : acc.manual++;
            return acc;
        }, { scheduled: 0, manual: 0 });

        return {
            totalReports,
            avgGenerationTime,
            avgFileSize,
            reportsByType,
            reportsByExport,
            scheduledVsManual,
        };

    } catch (error) {
        console.error('Error fetching report usage stats:', error);
        throw new Error('Could not fetch report usage stats.');
    }
};
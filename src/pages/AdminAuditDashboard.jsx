import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { AlertTriangle, Clock, Users, Database } from 'lucide-react';
import StatisticCard from '@/components/StatisticCard';
import RecentCriticalActions from '@/components/RecentCriticalActions';
import ActionsTrendChart from '@/components/charts/ActionsTrendChart';
import ActionsByTypeChart from '@/components/charts/ActionsByTypeChart';
import TopUsersChart from '@/components/charts/TopUsersChart';
import ActionsByResourceChart from '@/components/charts/ActionsByResourceChart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AdminAuditDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total_actions: 0, distinct_users: 0, last_action_time: null, distinct_resources: 0 });
    const [criticalActions, setCriticalActions] = useState([]);
    const [chartData, setChartData] = useState({ trend: [], byType: [], topUsers: [], byResource: [] });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);

            const now = new Date();
            const fromDate = new Date();
            switch (timeRange) {
                case '24h': fromDate.setDate(now.getDate() - 1); break;
                case '7d': fromDate.setDate(now.getDate() - 7); break;
                case '30d': fromDate.setDate(now.getDate() - 30); break;
                default: fromDate.setDate(now.getDate() - 7);
            }

            try {
                // Fetch stats
                const { data: statsData, error: statsError } = await supabase.rpc('get_audit_dashboard_stats', { from_date: fromDate.toISOString() });
                if (statsError) throw statsError;
                if(statsData && statsData.length > 0) setStats(statsData[0]);

                // Fetch recent critical actions - Fixed the .single() call by removing it, as it might return 0 rows
                const { data: criticalActionsData, error: criticalActionsError } = await supabase
                    .from('audit_logs')
                    .select('*')
                    .in('action', ['delete', 'security_change', 'grant_access', 'revoke_access'])
                    .order('timestamp', { ascending: false })
                    .limit(5);

                if (criticalActionsError) {
                    console.warn("Could not fetch critical actions. This may be expected if there are none.", criticalActionsError);
                    setCriticalActions([]);
                } else {
                    setCriticalActions(criticalActionsData || []);
                }
                
                // Fetch chart data
                const { data: trendData, error: trendError } = await supabase.rpc('get_audit_log_trend', { from_date: fromDate.toISOString() });
                if (trendError) throw trendError;
                
                const { data: byTypeData, error: byTypeError } = await supabase.rpc('get_audit_actions_by_type', { from_date: fromDate.toISOString() });
                if (byTypeError) throw byTypeError;
                
                const { data: topUsersData, error: topUsersError } = await supabase.rpc('get_top_active_users', { from_date: fromDate.toISOString() });
                if (topUsersError) throw topUsersError;

                const { data: byResourceData, error: byResourceError } = await supabase.rpc('get_audit_actions_by_resource', { from_date: fromDate.toISOString() });
                if (byResourceError) throw byResourceError;

                setChartData({
                    trend: trendData || [],
                    byType: byTypeData || [],
                    topUsers: topUsersData || [],
                    byResource: byResourceData || []
                });

            } catch (error) {
                console.error('Error fetching audit dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, timeRange]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <Helmet>
                <title>Admin - Audit Dashboard</title>
                <meta name="description" content="Overview of system audit activities." />
            </Helmet>
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
                <div className="flex justify-between items-center">
                    <motion.h1 variants={itemVariants} className="text-3xl font-bold">Audit Dashboard</motion.h1>
                    <motion.div variants={itemVariants}>
                       <Select onValueChange={setTimeRange} value={timeRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24 hours</SelectItem>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </motion.div>
                </div>

                <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div variants={itemVariants}>
                        <StatisticCard title="Total Actions" value={stats.total_actions} icon={AlertTriangle} loading={loading} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatisticCard title="Active Users" value={stats.distinct_users} icon={Users} loading={loading} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatisticCard title="Resources Affected" value={stats.distinct_resources} icon={Database} loading={loading} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatisticCard title="Last Action" value={stats.last_action_time ? new Date(stats.last_action_time).toLocaleString() : 'N/A'} icon={Clock} loading={loading} isDate={true} />
                    </motion.div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                         <ActionsTrendChart data={chartData.trend} loading={loading} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <RecentCriticalActions actions={criticalActions} loading={loading} />
                    </motion.div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    <motion.div variants={itemVariants}>
                        <ActionsByTypeChart data={chartData.byType} loading={loading} />
                    </motion.div>
                     <motion.div variants={itemVariants}>
                        <TopUsersChart data={chartData.topUsers} loading={loading} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ActionsByResourceChart data={chartData.byResource} loading={loading} />
                    </motion.div>
                </motion.div>

            </motion.div>
        </>
    );
};

export default AdminAuditDashboard;
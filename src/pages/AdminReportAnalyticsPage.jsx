import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDashboardAnalytics } from '@/lib/reportAnalyticsUtils';
import { BarChart, Download, Loader2, FileText, CheckCircle, Hash } from 'lucide-react';
import ActionsTrendChart from '@/components/charts/ActionsTrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const DATE_RANGES = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'all': 'All Time',
};

const COLORS = ['#BFFF00', '#38BDF8', '#A78BFA', '#F472B6', '#FB923C', '#FACC15'];

const AdminReportAnalyticsPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [dateRangeKey, setDateRangeKey] = useState('30d');
    const [analyticsData, setAnalyticsData] = useState(null);

    const getDateRange = useCallback(() => {
        if (dateRangeKey === 'all') return null;
        const to = new Date();
        const from = new Date();
        switch (dateRangeKey) {
            case '7d': from.setDate(to.getDate() - 7); break;
            case '90d': from.setDate(to.getDate() - 90); break;
            case '30d': default: from.setDate(to.getDate() - 30); break;
        }
        return { from, to };
    }, [dateRangeKey]);
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const range = getDateRange();
            const data = await getDashboardAnalytics(range);
            setAnalyticsData(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
            setAnalyticsData(null);
        } finally {
            setLoading(false);
        }
    }, [getDateRange, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNotImplemented = () => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

    const renderRecentReports = () => {
        if (!analyticsData?.recentReports || analyticsData.recentReports.length === 0) {
            return <p className="text-gray-400 text-center py-4">No recent reports found for this period.</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-[#0F172A]">
                        <tr>
                            <th scope="col" className="px-6 py-3">Report Name</th>
                            <th scope="col" className="px-6 py-3">Created By</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Rules Applied</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analyticsData.recentReports.map((report, index) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-white">{report.name.replace(/_/g, ' ')}</td>
                                <td className="px-6 py-4">{report.created_by}</td>
                                <td className="px-6 py-4">{new Date(report.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{report.rule_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    return (
        <>
            <Helmet><title>Report Analytics - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><BarChart className="mr-3" /> Report Analytics</h1>
                     <div className="flex items-center gap-4">
                        <Select value={dateRangeKey} onValueChange={setDateRangeKey}><SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(DATE_RANGES).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent></Select>
                        <Button variant="outline" onClick={handleNotImplemented}><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-12 h-12 animate-spin text-[#BFFF00]" />
                    </div>
                ) : analyticsData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-[#1E293B] border-gray-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Reports Generated</CardTitle><FileText className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData.stats.totalReports}</div></CardContent></Card>
                            <Card className="bg-[#1E293B] border-gray-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Anonymization Rules</CardTitle><CheckCircle className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData.stats.totalRules}</div></CardContent></Card>
                            <Card className="bg-[#1E293B] border-gray-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg Rules Per Report</CardTitle><Hash className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData.stats.avgRulesPerReport}</div></CardContent></Card>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                             <div className="lg:col-span-3">
                                <ActionsTrendChart data={analyticsData.charts.reportsOverTime} loading={false} />
                            </div>
                            <div className="lg:col-span-2">
                                <Card className="bg-[#1E293B] border-gray-700 text-white h-full">
                                    <CardHeader><CardTitle>Anonymization Rule Distribution</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={245}>
                                            <PieChart>
                                                <Pie data={analyticsData.charts.ruleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                                    {analyticsData.charts.ruleDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #374151' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                         <Card className="bg-[#1E293B] border-gray-700 text-white">
                            <CardHeader><CardTitle>Recent Reports</CardTitle></CardHeader>
                            <CardContent>
                                {renderRecentReports()}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <p>No analytics data available.</p>
                        <p className="text-sm">Try selecting a different date range or generate some reports.</p>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default AdminReportAnalyticsPage;
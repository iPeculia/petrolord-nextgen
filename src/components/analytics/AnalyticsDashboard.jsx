import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle, Clock, Activity, Download } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { KPICard } from '@/components/charts/DashboardWidgets';
import { Loader2 } from 'lucide-react';

const COLORS = ['#BFFF00', '#38BDF8', '#ef4444', '#F59E0B'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricData, chartData] = await Promise.all([
          analyticsService.getDashboardMetrics(),
          analyticsService.getChartsData()
        ]);
        setMetrics(metricData);
        setCharts(chartData);
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard 
          title="Total Users" 
          value={metrics?.totalUsers} 
          icon={Users} 
          trend={12} 
          color="text-[#38BDF8]" 
        />
        <KPICard 
          title="Applications" 
          value={metrics?.totalApplications} 
          icon={FileText} 
          trend={5} 
          color="text-[#BFFF00]" 
        />
        <KPICard 
          title="Approval Rate" 
          value={`${metrics?.approvalRate}%`} 
          icon={CheckCircle} 
          trend={2.4} 
          color="text-emerald-400" 
        />
        <KPICard 
          title="Avg Process Time" 
          value={metrics?.avgProcessingTime} 
          icon={Clock} 
          trend={-1.5} 
          color="text-orange-400" 
        />
        <KPICard 
          title="Active Users" 
          value={metrics?.activeUsers} 
          icon={Activity} 
          trend={8.7} 
          color="text-purple-400" 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <Card className="bg-[#1E293B] border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={3} dot={{r: 4, fill: '#38BDF8'}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card className="bg-[#1E293B] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Application Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.applicationStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts?.applicationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Area */}
        <Card className="bg-[#1E293B] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.activeUsersTrend}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#BFFF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#BFFF00" fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Approvals vs Rejections */}
         <Card className="bg-[#1E293B] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Decision Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.applicationStatus.filter(i => i.name !== 'Pending')}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                   {charts?.applicationStatus.filter(i => i.name !== 'Pending').map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Approved' ? '#BFFF00' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
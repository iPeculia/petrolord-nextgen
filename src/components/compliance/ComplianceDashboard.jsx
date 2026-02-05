import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auditService } from '@/services/auditService';
import { AlertTriangle, ShieldCheck, Activity, Lock, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/charts/DashboardWidgets';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ComplianceDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        policyViolations: 0,
        failedLogins: 0,
        dataModifications: 0
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const alertsData = await auditService.getComplianceAlerts();
                setAlerts(alertsData);
                
                // Mock stats fetch - in production this would be a real aggregated query
                setStats({
                    totalEvents: 1250,
                    policyViolations: alertsData.length,
                    failedLogins: 45,
                    dataModifications: 320
                });
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const handleDismissAlert = async (id) => {
        try {
            await auditService.dismissAlert(id);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to dismiss alert", error);
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Compliance Score" value="98%" icon={ShieldCheck} color="text-emerald-400" subtext="System secure" />
                <KPICard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color={alerts.length > 0 ? "text-red-400" : "text-slate-400"} />
                <KPICard title="Failed Access" value={stats.failedLogins} icon={Lock} color="text-orange-400" />
                <KPICard title="Total Audit Events" value={stats.totalEvents.toLocaleString()} icon={Activity} color="text-[#BFFF00]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Alerts List */}
                <Card className="bg-[#1E293B] border-slate-800 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                            Security & Compliance Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                                <CheckCircle className="w-12 h-12 mb-2 text-emerald-500/50" />
                                <p>No active alerts. System is healthy.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map(alert => (
                                    <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg bg-red-900/10 border border-red-900/30">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-red-200">{alert.alert_type}</h4>
                                                <p className="text-sm text-red-300/80">{alert.message}</p>
                                                <span className="text-xs text-slate-500 mt-1 block">{new Date(alert.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDismissAlert(alert.id)}
                                            className="text-slate-400 hover:text-white"
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System Health / Status */}
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Database Integrity</span>
                                <span className="text-emerald-400">Optimal</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">API Latency</span>
                                <span className="text-emerald-400">45ms</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[95%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Audit Log Storage</span>
                                <span className="text-[#BFFF00]">12% Used</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#BFFF00] w-[12%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComplianceDashboard;
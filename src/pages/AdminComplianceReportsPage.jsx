import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Activity, User, Edit, Shield, Users, Award, Mail, AlertTriangle, FileText, Loader2, Download, FileType, FileSpreadsheet, Calendar, Save, List } from 'lucide-react';
import { 
    generateSystemActivityReport, 
    getUserActivityReport,
    getDataChangeReport,
    getSecurityEventReport,
    getUserEnrollmentReport,
    getCertificateReport,
    getEmailReport,
    getFailureReport,
    getAllUsers,
    saveReportHistory 
} from '@/lib/complianceReportsUtils';
import { exportToPDF, exportToCSV, exportToExcel } from '@/lib/reportExportUtils';
import { anonymizeReportData } from '@/lib/dataAnonymizationUtils';
import { logReportAnalytics } from '@/lib/reportAnalyticsUtils';
import SystemActivityReport from '@/components/reports/SystemActivityReport';
import UserActivityReport from '@/components/reports/UserActivityReport';
import DataChangeReport from '@/components/reports/DataChangeReport';
import SecurityEventReport from '@/components/reports/SecurityEventReport';
import UserEnrollmentReport from '@/components/reports/UserEnrollmentReport';
import CertificateReport from '@/components/reports/CertificateReport';
import EmailReport from '@/components/reports/EmailReport';
import FailureReport from '@/components/reports/FailureReport';
import ScheduleReportModal from '@/components/reports/ScheduleReportModal';
import AdvancedFilterPanel from '@/components/reports/AdvancedFilterPanel';
import DataAnonymizationPanel from '@/components/reports/DataAnonymizationPanel';

const DATE_RANGES = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days' };
const RESOURCE_TYPES = ['ALL', 'PROFILE', 'COURSE', 'ENROLLMENT', 'CERTIFICATE', 'SYSTEM'];
const REPORT_TYPES = {
    system_activity: { title: 'System Activity', generator: generateSystemActivityReport, icon: Activity },
    user_activity: { title: 'User Activity', generator: getUserActivityReport, icon: User },
    data_change: { title: 'Data Change', generator: getDataChangeReport, icon: Edit },
    security_event: { title: 'Security Event', generator: getSecurityEventReport, icon: Shield },
    user_enrollment: { title: 'Enrollment', generator: getUserEnrollmentReport, icon: Users },
    certificate: { title: 'Certificate', generator: getCertificateReport, icon: Award },
    email: { title: 'Email', generator: getEmailReport, icon: Mail },
    failure: { title: 'Failure', generator: getFailureReport, icon: AlertTriangle },
};
const REPORT_COMPONENTS = {
    system_activity: SystemActivityReport, user_activity: UserActivityReport, data_change: DataChangeReport,
    security_event: SecurityEventReport, user_enrollment: UserEnrollmentReport, certificate: CertificateReport,
    email: EmailReport, failure: FailureReport
};

const AdminComplianceReportsPage = () => {
    const { toast } = useToast();
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [originalReportData, setOriginalReportData] = useState(null);
    const [displayReportData, setDisplayReportData] = useState(null);
    const [reportType, setReportType] = useState('system_activity');
    const [dateRangeKey, setDateRangeKey] = useState('30d');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedResourceType, setSelectedResourceType] = useState('ALL');
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const handleNotImplemented = () => toast({ title: "🚧 Feature In Progress", description: "This feature isn't implemented yet—but you can request it!" });

    useEffect(() => {
        if (reportType === 'user_activity') {
            getAllUsers().then(setUsers).catch(err => toast({ variant: 'destructive', title: 'Error fetching users.'}));
        }
    }, [reportType, toast]);

    const getDateRange = useCallback(() => {
        const to = new Date(), from = new Date();
        from.setDate(to.getDate() - { '7d': 7, '90d': 90 }[dateRangeKey] || 30);
        return { from, to };
    }, [dateRangeKey]);

    const handleGenerateReport = async () => {
        const startTime = Date.now();
        setLoading(true);
        setOriginalReportData(null);
        setDisplayReportData(null);
        try {
            const range = getDateRange();
            const { title, generator } = REPORT_TYPES[reportType];
            let data, filters = { dateRangeKey };
            if (reportType === 'user_activity') {
                if (!selectedUserId) { toast({ variant: 'destructive', title: 'Please select a user.' }); setLoading(false); return; }
                data = await generator(selectedUserId, range);
                filters.userId = selectedUserId;
            } else if (reportType === 'data_change') {
                data = await generator(selectedResourceType, range);
                filters.resourceType = selectedResourceType;
            } else {
                data = await generator(range);
            }
            const generationTimeMs = Date.now() - startTime;
            setOriginalReportData(data);
            setDisplayReportData(data);
            toast({ title: 'Report Generated', description: `${title} Report has been successfully generated.` });
            
            await saveReportHistory({ admin_id: profile.id, report_type: reportType, title, date_range_start: range.from, date_range_end: range.to, summary: data.summary, filters });
            
            await logReportAnalytics({
                report_type: reportType,
                generated_by: profile.id,
                date_range_start: range.from,
                date_range_end: range.to,
                filters_applied: filters,
                export_format: 'view',
                record_count: data.details.length,
                generation_time_ms: generationTimeMs,
            });

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };
    
    const handleAnonymize = (config) => {
        const anonymizedData = anonymizeReportData(originalReportData, config);
        setDisplayReportData(anonymizedData);
    };

    const handleResetAnonymization = () => {
        setDisplayReportData(originalReportData);
    };

    const handleExport = async (format) => {
        if (!displayReportData) { toast({ variant: 'destructive', title: 'No report data to export.' }); return; }
        const title = `${REPORT_TYPES[reportType].title} Report`;
        const startTime = Date.now();
        try {
            const exportFunc = { pdf: exportToPDF, csv: exportToCSV, excel: exportToExcel }[format];
            const file = exportFunc(displayReportData, title, getDateRange(), profile.email);
            const generationTimeMs = Date.now() - startTime;
            
            toast({ title: `Exported as ${format.toUpperCase()}.` });
            
            await logReportAnalytics({
                report_type: reportType,
                generated_by: profile.id,
                date_range_start: getDateRange().from,
                date_range_end: getDateRange().to,
                filters_applied: { dateRangeKey, selectedUserId, selectedResourceType },
                export_format: format,
                record_count: displayReportData.details.length,
                generation_time_ms: generationTimeMs,
                // file_size_bytes would need to be determined from the blob, skipping for now
            });
            
        } catch (error) {
            toast({ variant: 'destructive', title: 'Export Failed' });
        }
    };

    const CurrentReportComponent = REPORT_COMPONENTS[reportType];

    return (
        <>
            <Helmet><title>Compliance Reports - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center"><FileText className="w-8 h-8 mr-4" />Compliance Reports</h1>
                        <p className="text-xl text-gray-400">Generate, filter, and anonymize compliance reports.</p>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsScheduleModalOpen(true)}><Calendar className="w-4 h-4 mr-2" /> Schedule</Button>
                        <Button variant="outline" onClick={handleNotImplemented}><Save className="w-4 h-4 mr-2" /> Save Template</Button>
                        <Button variant="outline" onClick={handleNotImplemented}><List className="w-4 h-4 mr-2" /> Load Template</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1E293B] p-6 rounded-lg border border-gray-800 space-y-6">
                            <Tabs value={reportType} onValueChange={val => { setOriginalReportData(null); setDisplayReportData(null); setReportType(val); }}>
                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                                    {Object.entries(REPORT_TYPES).map(([key, { title, icon: Icon }]) => <TabsTrigger key={key} value={key}><Icon className="w-4 h-4 mr-2" />{title}</TabsTrigger>)}
                                </TabsList>
                            </Tabs>
                            <div className="flex flex-wrap items-end gap-4">
                                {reportType === 'user_activity' && (
                                    <div className="flex-1 min-w-[200px]"><Label className="text-sm font-medium text-gray-300 mb-2 block">Select User</Label><Select value={selectedUserId} onValueChange={setSelectedUserId}><SelectTrigger><SelectValue placeholder="Select user..." /></SelectTrigger><SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.display_name}</SelectItem>)}</SelectContent></Select></div>
                                )}
                                {reportType === 'data_change' && (
                                    <div className="flex-1 min-w-[200px]"><Label className="text-sm font-medium text-gray-300 mb-2 block">Resource Type</Label><Select value={selectedResourceType} onValueChange={setSelectedResourceType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RESOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                                )}
                                <div className="flex-1 min-w-[180px]"><Label className="text-sm font-medium text-gray-300 mb-2 block">Date Range</Label><Select value={dateRangeKey} onValueChange={setDateRangeKey}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(DATE_RANGES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                                <Button onClick={handleGenerateReport} disabled={loading} className="bg-[#BFFF00] text-black hover:bg-lime-400 font-semibold">
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</> : 'Generate Report'}
                                </Button>
                            </div>
                        </div>
                    </div>
                     <div className="space-y-6">
                        <AdvancedFilterPanel />
                        <DataAnonymizationPanel onAnonymize={handleAnonymize} onReset={handleResetAnonymization} isAnonymized={displayReportData?.isAnonymized} />
                    </div>
                </div>

                {displayReportData && CurrentReportComponent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0F172A] p-6 rounded-lg border border-gray-800">
                        <div className="flex justify-end gap-2 mb-4">
                            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="w-4 h-4 mr-2" />PDF</Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><FileType className="w-4 h-4 mr-2" />CSV</Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2" />Excel</Button>
                        </div>
                        <CurrentReportComponent reportData={displayReportData} dateRange={getDateRange()} generatedBy={profile.email} />
                    </motion.div>
                )}
                 {loading && <div className="text-center py-16 text-gray-500"><Loader2 className="mx-auto h-12 w-12 animate-spin text-[#BFFF00]" /><p className="mt-4">Generating report...</p></div>}
                {!displayReportData && !loading && <div className="text-center py-16 text-gray-500"><FileText className="mx-auto h-12 w-12" /><p className="mt-4">Select criteria and generate a report.</p></div>}
            </motion.div>
            <ScheduleReportModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} reportType={reportType} filters={{dateRangeKey}} />
        </>
    );
};

export default AdminComplianceReportsPage;
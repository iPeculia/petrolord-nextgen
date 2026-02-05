import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getScheduledReports, createScheduledReport, deleteScheduledReport, toggleScheduledReport } from '@/lib/reportSchedulingUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScheduledReportForm from '@/components/reports/ScheduledReportForm';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { PlusCircle, Edit, Trash, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

const AdminReportSchedulingPage = () => {
    const { toast } = useToast();
    const { profile } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const data = await getScheduledReports();
            setSchedules(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleSave = async (data) => {
        setLoading(true);
        try {
            if (currentSchedule) {
                // Update logic here
            } else {
                await createScheduledReport(data, profile.id);
                toast({ title: 'Success', description: 'Report schedule created.' });
            }
            setIsModalOpen(false);
            setCurrentSchedule(null);
            fetchSchedules();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await deleteScheduledReport(id);
                toast({ title: 'Success', description: 'Schedule deleted.' });
                fetchSchedules();
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            }
        }
    };
    
    const handleToggle = async (id, enabled) => {
        try {
            await toggleScheduledReport(id, !enabled);
            toast({ title: 'Success', description: `Schedule ${!enabled ? 'enabled' : 'disabled'}.` });
            fetchSchedules();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    }

    return (
        <>
            <Helmet><title>Report Scheduling - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><Calendar className="mr-3" /> Report Scheduling</h1>
                    <Button onClick={() => { setCurrentSchedule(null); setIsModalOpen(true); }} className="bg-[#BFFF00] text-black hover:bg-lime-400">
                        <PlusCircle className="mr-2 h-4 w-4" /> New Schedule
                    </Button>
                </div>
                
                <div className="bg-[#1E293B] rounded-lg border border-gray-800">
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-[#0F172A] text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Report Type</th>
                                    <th className="px-6 py-3">Frequency</th>
                                    <th className="px-6 py-3">Recipients</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-gray-300">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center p-8">Loading schedules...</td></tr>
                                ) : schedules.length > 0 ? schedules.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4">{s.title}</td>
                                        <td className="px-6 py-4 capitalize">{s.report_type.replace(/_/g, ' ')}</td>
                                        <td className="px-6 py-4 capitalize">{s.frequency}</td>
                                        <td className="px-6 py-4">{s.email_recipients?.join(', ')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${s.enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                                {s.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleToggle(s.id, s.enabled)}>
                                                {s.enabled ? <ToggleRight className="text-green-400"/> : <ToggleLeft className="text-gray-400"/>}
                                            </Button>
                                            <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash className="h-4 w-4 text-red-500" /></Button>
                                        </td>
                                    </tr>
                                )) : (
                                     <tr><td colSpan="6" className="text-center p-8">No schedules found. Create one to get started.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl bg-[#1E293B] border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle>{currentSchedule ? 'Edit' : 'Create'} Scheduled Report</DialogTitle>
                    </DialogHeader>
                    <ScheduledReportForm 
                        onSave={handleSave} 
                        onCancel={() => setIsModalOpen(false)}
                        report={currentSchedule}
                        loading={loading}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminReportSchedulingPage;
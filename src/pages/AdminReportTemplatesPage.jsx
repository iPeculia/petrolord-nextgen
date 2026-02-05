import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getReportTemplates, createReportTemplate, deleteReportTemplate } from '@/lib/reportTemplateUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReportTemplateForm from '@/components/reports/ReportTemplateForm';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { PlusCircle, Edit, Trash, LayoutTemplate } from 'lucide-react';

const AdminReportTemplatesPage = () => {
    const { toast } = useToast();
    const { profile } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const { templates: data } = await getReportTemplates({});
            setTemplates(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSave = async (data) => {
        setLoading(true);
        try {
            if (currentTemplate) {
                // Update logic here
            } else {
                await createReportTemplate(data, profile.id);
                toast({ title: 'Success', description: 'Report template created.' });
            }
            setIsModalOpen(false);
            setCurrentTemplate(null);
            fetchTemplates();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await deleteReportTemplate(id);
                toast({ title: 'Success', description: 'Template deleted.' });
                fetchTemplates();
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            }
        }
    };


    return (
        <>
            <Helmet><title>Report Templates - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><LayoutTemplate className="mr-3" /> Report Templates</h1>
                    <Button onClick={() => { setCurrentTemplate(null); setIsModalOpen(true); }} className="bg-[#BFFF00] text-black hover:bg-lime-400">
                        <PlusCircle className="mr-2 h-4 w-4" /> New Template
                    </Button>
                </div>
                
                 <div className="bg-[#1E293B] rounded-lg border border-gray-800">
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-[#0F172A] text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Report Type</th>
                                    <th className="px-6 py-3">Created By</th>
                                    <th className="px-6 py-3">Created At</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-gray-300">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-8">Loading templates...</td></tr>
                                ) : templates.length > 0 ? templates.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4">{t.name}</td>
                                        <td className="px-6 py-4 capitalize">{t.report_type.replace(/_/g, ' ')}</td>
                                        <td className="px-6 py-4">{t.creator_display_name}</td>
                                        <td className="px-6 py-4">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash className="h-4 w-4 text-red-500" /></Button>
                                        </td>
                                    </tr>
                                )) : (
                                     <tr><td colSpan="5" className="text-center p-8">No templates found. Create one to get started.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg bg-[#1E293B] border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle>{currentTemplate ? 'Edit' : 'Create'} Report Template</DialogTitle>
                    </DialogHeader>
                    <ReportTemplateForm 
                        onSave={handleSave} 
                        onCancel={() => setIsModalOpen(false)}
                        template={currentTemplate}
                        loading={loading}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminReportTemplatesPage;
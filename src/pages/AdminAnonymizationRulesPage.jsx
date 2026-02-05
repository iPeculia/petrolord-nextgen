import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAnonymizationRules, deleteAnonymizationRule } from '@/lib/customAnonymizationUtils';
import { Shield, Plus, Edit, Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AnonymizationRuleForm from '@/components/reports/AnonymizationRuleForm';

const AdminAnonymizationRulesPage = () => {
    const { toast } = useToast();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const data = await getAnonymizationRules();
            setRules(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);
    
    const handleFormSave = () => {
        setIsFormOpen(false);
        setSelectedRule(null);
        fetchRules();
    };

    const handleDelete = async (id) => {
        try {
            await deleteAnonymizationRule(id);
            toast({ title: 'Success', description: 'Rule deleted successfully.' });
            fetchRules();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    return (
        <>
            <Helmet><title>Anonymization Rules - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><Shield className="mr-3" /> Anonymization Rules</h1>
                    <Button onClick={() => { setSelectedRule(null); setIsFormOpen(true); }} className="bg-[#BFFF00] text-black hover:bg-lime-400">
                        <Plus className="mr-2 h-4 w-4" /> Create New Rule
                    </Button>
                </div>
                
                 <div className="bg-[#1E293B] rounded-lg border border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#0F172A] text-gray-300">
                                <tr>
                                    {['Name', 'Field Name', 'Rule Type', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3 font-semibold">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-gray-300">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-8">Loading rules...</td></tr>
                                ) : rules.length > 0 ? (
                                    rules.map(rule => (
                                        <tr key={rule.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4">{rule.name}</td>
                                            <td className="px-6 py-4">{rule.field_name}</td>
                                            <td className="px-6 py-4 capitalize">{rule.rule_type}</td>
                                            <td className="px-6 py-4">{rule.is_active ? 'Active' : 'Inactive'}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => { setSelectedRule(rule); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                                <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the rule.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(rule.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center py-8">No rules found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
            <AnonymizationRuleForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleFormSave} rule={selectedRule} />
        </>
    );
};

export default AdminAnonymizationRulesPage;